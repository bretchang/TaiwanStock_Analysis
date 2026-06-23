#!/usr/bin/env python3
"""台股財務監測 ETL：從 FinMind 抓五大指標原始時序，輸出前端用的 data/data.js。

設計原則（見 plan.md）：資料層只負責「抓乾淨的原始時序」，所有分析
（QoQ / YoY / 交叉訊號 / heatmap / 排序）一律在前端 JS 計算，確保單一邏輯來源。

用法：
    python etl/build_data.py            # 增量更新：保留既有資料，只抓「新增/缺資料」的個股
    python etl/build_data.py --full     # 全量重抓所有個股
    set FINMIND_TOKEN=xxx && python etl/build_data.py   # 帶 token 提高額度（避免 guest 額度限制）

增量快取（plan §9）：FinMind guest 有每小時請求上限。本程式預設只抓 data/data.js
裡尚未有資料的個股，已抓過的直接沿用；若中途觸發額度限制，會保留已成功的資料並提前結束，
稍後再跑一次即可把剩下的補齊。
"""
from __future__ import annotations

import json
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

API = "https://api.finmindtrade.com/api/v4/data"

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "config" / "watchlist.json"
OUT_PATH = ROOT / "data" / "data.js"

# FinMind 欄位對應（Phase 1 資料探勘確認）
BALANCE_FIELDS = {
    "ar": "AccountsReceivableNet",          # 應收帳款
    "inventory": "Inventories",              # 存貨
    "contract_liab": "CurrentContractLiabilities",  # 合約負債（部分公司無）
    "total_assets": "TotalAssets",          # 總資產
    "total_liab": "Liabilities",             # 總負債
    "equity": "Equity",                      # 股東權益總額
    # 流動性
    "cash": "CashAndCashEquivalents",        # 現金及約當現金
    "current_assets": "CurrentAssets",       # 流動資產合計
    "current_liab": "CurrentLiabilities",    # 流動負債合計
    "ap": "AccountsPayable",                 # 應付帳款
    # 槓桿
    "st_borrow": "ShorttermBorrowings",      # 短期借款
    "noncurrent_liab": "NoncurrentLiabilities",  # 非流動負債合計
    "ppe": "PropertyPlantAndEquipment",      # 不動產廠房及設備
}
INCOME_FIELDS = {
    "revenue": "Revenue",                    # 單季營收
    "cogs": "CostOfGoodsSold",               # 營業成本
    "gross": "GrossProfit",                  # 營業毛利
    "op_exp": "OperatingExpenses",           # 營業費用
    "op_income": "OperatingIncome",          # 營業利益
    "nonop": "TotalNonoperatingIncomeAndExpense",  # 營業外收支
    "pre_tax": "PreTaxIncome",               # 稅前淨利
    "net": "IncomeAfterTaxes",               # 稅後淨利
    "eps": "EPS",                            # 每股盈餘
}
# 現金流量表（注意：原始為「年度累計」，build_stock 會還原為單季）
CASHFLOW_FIELDS = {
    "op_cf": "CashFlowsFromOperatingActivities",          # 營業活動現金流
    "inv_cf": "CashProvidedByInvestingActivities",        # 投資活動現金流
    "fin_cf": "CashFlowsProvidedFromFinancingActivities", # 籌資活動現金流
    "capex": "PropertyAndPlantAndEquipment",              # 取得不動產廠房設備（資本支出，負值）
}

TZ = timezone(timedelta(hours=8))  # 台北時間


def q_label(date_str: str) -> str:
    """'2025-03-31' -> '2025Q1'。"""
    y, m, _ = date_str.split("-")
    q = (int(m) - 1) // 3 + 1
    return f"{y}Q{q}"


def m_label(date_str: str) -> str:
    """'2026-05-01' -> '2026-05'。"""
    y, m, _ = date_str.split("-")
    return f"{y}-{m}"


class RateLimited(Exception):
    """FinMind 觸發每小時請求上限。"""


def fetch(dataset: str, data_id: str, start_date: str, token: str | None) -> list[dict]:
    params = {"dataset": dataset, "data_id": data_id, "start_date": start_date}
    if token:
        params["token"] = token
    for attempt in range(3):
        try:
            r = requests.get(API, params=params, timeout=60)
            if r.status_code == 200:
                body = r.json()
                msg = body.get("msg")
                if msg in ("success", None):
                    return body.get("data", [])
                if "limit" in str(msg).lower():
                    raise RateLimited(msg)
                print(f"    ! {dataset} {data_id} msg={msg}", flush=True)
                return body.get("data", [])
            if r.status_code in (402, 429):
                raise RateLimited(f"HTTP {r.status_code}")
            print(f"    ! {dataset} {data_id} HTTP {r.status_code}", flush=True)
        except RateLimited:
            raise
        except Exception as exc:  # noqa: BLE001
            print(f"    ! {dataset} {data_id} error: {exc}", flush=True)
        time.sleep(1 + attempt)
    return []


def load_existing() -> dict:
    """讀回既有 data/data.js 的 stocks（id -> stock dict），供增量沿用。"""
    if not OUT_PATH.exists():
        return {}
    try:
        t = OUT_PATH.read_text(encoding="utf-8")
        j = t[t.index("{"): t.rstrip().rstrip(";").rindex("}") + 1]
        d = json.loads(j)
        return {s["id"]: s for s in d.get("stocks", [])}
    except Exception as exc:  # noqa: BLE001
        print(f"  （無法解析既有 data.js，將全量重抓：{exc}）", flush=True)
        return {}


def has_data(stock: dict) -> bool:
    # 必須是新版 schema（含 cashflow 與 total_assets）才算完整，否則強制重抓補新欄位
    if not stock or not stock.get("quarters"):
        return False
    if "cashflow" not in stock or "total_assets" not in stock.get("balance", {}):
        return False
    # v3 schema：含流動性/槓桿/FCF 等新欄位，缺則強制重抓
    if "cash" not in stock.get("balance", {}) or "fcf" not in stock.get("cashflow", {}):
        return False
    inc = stock.get("income", {}).get("revenue", [])
    bal = stock.get("balance", {}).get("ar", [])
    mr = stock.get("month_rev", {}).get("values", [])
    return any(v is not None for v in inc + bal + mr)


def empty_stock(cfg_stock: dict) -> dict:
    return {
        "id": cfg_stock["id"],
        "name": cfg_stock.get("name", cfg_stock["id"]),
        "industry": "未分類",
        "theme": cfg_stock.get("theme", "其他"),
        "has_contract_liab": False,
        "quarters": [],
        "balance": {k: [] for k in BALANCE_FIELDS},
        "income": {k: [] for k in INCOME_FIELDS},
        "cashflow": {**{k: [] for k in CASHFLOW_FIELDS}, "fcf": []},
        "month_rev": {"months": [], "values": []},
    }


def fetch_info_map(token: str | None) -> dict:
    """一次抓全市場基本資料，建 id -> {name, industry}，省去逐檔請求。"""
    try:
        r = requests.get(API, params={"dataset": "TaiwanStockInfo", "token": token} if token
                         else {"dataset": "TaiwanStockInfo"}, timeout=120)
        data = r.json().get("data", [])
    except Exception as exc:  # noqa: BLE001
        print(f"  （TaiwanStockInfo 批次抓取失敗：{exc}）", flush=True)
        return {}
    info = {}
    for x in data:
        sid = x.get("stock_id", "")
        if sid and sid not in info:
            info[sid] = {"name": x.get("stock_name", sid), "industry": x.get("industry_category")}
    return info


def pivot_quarterly(rows: list[dict], fields: dict[str, str], quarters: list[str]) -> dict:
    """把 FinMind 的 (date,type,value) 長表，pivot 成各指標對齊 quarters 的陣列。"""
    by_q: dict[str, dict[str, float]] = {}
    for x in rows:
        t = x.get("type")
        if t not in fields.values():
            continue
        ql = q_label(x["date"])
        by_q.setdefault(ql, {})[t] = x.get("value")
    out: dict[str, list] = {}
    for key, fin_type in fields.items():
        out[key] = [by_q.get(q, {}).get(fin_type) for q in quarters]
    return out


def collect_quarters(*row_sets: list[dict], limit: int) -> list[str]:
    qs = set()
    for rows in row_sets:
        for x in rows:
            qs.add(q_label(x["date"]))
    return sorted(qs)[-limit:]


def de_cumulate(cum: list, quarters: list[str]) -> list:
    """把年度累計序列還原成單季：Q1=累計值；Q2~Q4=本期累計−上期累計。"""
    out = []
    for i, q in enumerate(quarters):
        qn = int(q.split("Q")[1])
        v = cum[i]
        if v is None:
            out.append(None)
        elif qn == 1:
            out.append(v)
        elif i >= 1 and cum[i - 1] is not None:
            out.append(v - cum[i - 1])
        else:
            out.append(None)  # 缺上一期，無法還原
    return out


def build_stock(cfg_stock: dict, cfg: dict, token: str | None, info_map: dict) -> dict:
    sid = cfg_stock["id"]
    quarters_back = cfg.get("quarters_back", 9)
    months_back = cfg.get("months_back", 14)

    # 抓足夠回溯期：季資料多抓 1 年供 YoY 計算
    q_start = (datetime.now(TZ) - timedelta(days=365 * 4)).strftime("%Y-%m-%d")
    m_start = (datetime.now(TZ) - timedelta(days=31 * (months_back + 14))).strftime("%Y-%m-%d")

    meta = info_map.get(sid, {})
    industry = meta.get("industry") or "未分類"
    name = cfg_stock.get("name") or meta.get("name") or sid

    bs = fetch("TaiwanStockBalanceSheet", sid, q_start, token)
    fs = fetch("TaiwanStockFinancialStatements", sid, q_start, token)
    cf = fetch("TaiwanStockCashFlowsStatement", sid, q_start, token)
    mr = fetch("TaiwanStockMonthRevenue", sid, m_start, token)

    # 季資料對齊（多抓 4 季供前端算 YoY）
    quarters = collect_quarters(bs, fs, cf, limit=quarters_back + 4)
    balance = pivot_quarterly(bs, BALANCE_FIELDS, quarters)
    income = pivot_quarterly(fs, INCOME_FIELDS, quarters)
    # 現金流量：原始為年度累計 -> 還原為單季
    cf_cum = pivot_quarterly(cf, CASHFLOW_FIELDS, quarters)
    cashflow = {k: de_cumulate(cf_cum[k], quarters) for k in CASHFLOW_FIELDS}
    # 自由現金流 FCF = 營業現金流 + 資本支出（capex 為負值）
    cashflow["fcf"] = [
        (o + c) if (o is not None and c is not None) else None
        for o, c in zip(cashflow["op_cf"], cashflow["capex"])
    ]

    # 月營收（以 revenue_year/revenue_month 標示「歸屬月份」，而非公告日）
    mr_map = {}
    for x in mr:
        y = x.get("revenue_year")
        m = x.get("revenue_month")
        key = f"{y}-{int(m):02d}" if y and m else m_label(x["date"])
        mr_map[key] = x.get("revenue")
    months = sorted(mr_map.keys())[-(months_back + 12):]
    month_values = [mr_map.get(m) for m in months]

    has_cl = any(v is not None for v in balance["contract_liab"])

    return {
        "id": sid,
        "name": name,
        "industry": industry,
        "theme": cfg_stock.get("theme", "其他"),
        "has_contract_liab": has_cl,
        "quarters": quarters,
        "balance": balance,
        "income": income,
        "cashflow": cashflow,
        "month_rev": {"months": months, "values": month_values},
    }


def main() -> int:
    token = os.environ.get("FINMIND_TOKEN")
    full = "--full" in sys.argv
    cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    stocks_cfg = cfg["stocks"]
    existing = {} if full else load_existing()

    mode = "全量" if full else "增量"
    print(f"開始{mode}更新 {len(stocks_cfg)} 檔（token={'有' if token else '無/guest'}，既有 {len(existing)} 檔）...", flush=True)

    need_fetch = full or any(not (sid in existing and has_data(existing[sid])) for sid in [s["id"] for s in stocks_cfg])
    info_map = fetch_info_map(token) if need_fetch else {}

    results: dict[str, dict] = {}
    limited = False
    fetched = reused = skipped = 0
    n = len(stocks_cfg)
    for i, s in enumerate(stocks_cfg, 1):
        sid = s["id"]
        # 既有且有資料 -> 直接沿用（只更新名稱/主題）
        if not full and sid in existing and has_data(existing[sid]):
            st = existing[sid]
            st["name"] = s.get("name") or st.get("name")
            st["theme"] = s.get("theme", "其他")
            results[sid] = st
            reused += 1
            print(f"  [{i}/{n}] {sid} {s.get('name','')}  > 沿用既有", flush=True)
            continue
        if limited:  # 已觸發額度，後續不再打 API
            results[sid] = existing.get(sid) or empty_stock(s)
            skipped += 1
            print(f"  [{i}/{n}] {sid} {s.get('name','')}  > 略過（額度限制）", flush=True)
            continue
        try:
            print(f"  [{i}/{n}] {sid} {s.get('name','')}  > 抓取中…", flush=True)
            results[sid] = build_stock(s, cfg, token, info_map)
            fetched += 1
            time.sleep(0.5)
        except RateLimited as e:
            limited = True
            results[sid] = existing.get(sid) or empty_stock(s)
            print(f"  !! 觸發 FinMind 額度限制（{e}）：保留已完成資料，提前結束。稍後再跑一次可補齊。", flush=True)

    stocks = [results[s["id"]] for s in stocks_cfg]

    payload = {
        "updated_at": datetime.now(TZ).isoformat(timespec="seconds"),
        "source": "FinMind",
        "config": {
            "thresholds": cfg.get("thresholds", {}),
            "quarters_back": cfg.get("quarters_back", 9),
            "months_back": cfg.get("months_back", 14),
            "stocks": [{"id": s["id"], "name": s.get("name", ""), "theme": s.get("theme", "其他")} for s in stocks_cfg],
        },
        "stocks": stocks,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    js = "// 由 etl/build_data.py 自動產生，請勿手動編輯。\n"
    js += "window.SEED_DATA = " + json.dumps(payload, ensure_ascii=False, indent=1) + ";\n"
    OUT_PATH.write_text(js, encoding="utf-8")
    ok = sum(1 for s in stocks if has_data(s))
    print(f"\n完成！已寫出 {OUT_PATH}", flush=True)
    print(f"  新抓 {fetched}、沿用 {reused}、略過 {skipped}；目前有資料 {ok}/{len(stocks)} 檔", flush=True)
    if limited or ok < len(stocks):
        print("  [!] 部分個股尚無資料（多半因 guest 額度）。等額度恢復或設 FINMIND_TOKEN 後再跑一次即可補齊。", flush=True)
    print(f"  更新時間 {payload['updated_at']}", flush=True)
    return 0 if ok == len(stocks) else 2  # 0=全部有資料；2=仍有缺漏（多因額度）


if __name__ == "__main__":
    sys.exit(main())
