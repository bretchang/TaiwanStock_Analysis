#!/usr/bin/env python3
"""產生 config/watchlist.json 的追蹤清單（前 N 大個股，排除金融保險）。

選股方式（register 免費 tier 取不到市值權重，故用免費公開資料）：
- 個股基本資料 / 產業別：FinMind TaiwanStockInfo（全市場一次抓）
- 規模/活躍度排名：證交所 + 櫃買 OpenAPI 的「當日成交值」（各一次請求）

規則：
- 只留 4 位數普通股（上市 twse / 上櫃 tpex），排除 ETF/ETN/受益證券/存託憑證/金融保險。
- 既有 config/watchlist.json 的自訂主題（AI 供應鏈）會被保留並優先；其餘以官方產業別當主題。
- 既有清單個股一律納入，再依成交值由大到小補足到 TARGET 檔。

用法：
    python etl/gen_watchlist.py            # 預設 200 檔
    python etl/gen_watchlist.py 150        # 指定檔數
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "config" / "watchlist.json"
SUB_INDUSTRY_PATH = ROOT / "config" / "sub_industry.json"
TOKEN_FILE = ROOT / "finmind token"


def load_sub_industry() -> dict:
    """細產業對照表 stock_id -> 細主題。"""
    if not SUB_INDUSTRY_PATH.exists():
        return {}
    raw = json.loads(SUB_INDUSTRY_PATH.read_text(encoding="utf-8"))
    return {k: v for k, v in raw.items() if not k.startswith("_")}

FINMIND = "https://api.finmindtrade.com/api/v4/data"
TWSE_ALL = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL"
TPEX_ALL = "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes"

# 排除的產業別（金融保險、各類非普通股工具）
EXCLUDE_INDUSTRY = {
    "金融業", "金融保險",
    "ETF", "ETN", "上櫃ETF", "上櫃指數股票型基金(ETF)", "指數投資證券(ETN)",
    "受益證券", "存託憑證", "所有證券", "Index", "大盤", None,
}
STOCK_ID_RE = re.compile(r"^[1-9]\d{3}$")  # 4 位數、非 0 開頭


def get_token() -> str:
    if TOKEN_FILE.exists():
        return TOKEN_FILE.read_text(encoding="utf-8").strip()
    import os
    return os.environ.get("FINMIND_TOKEN", "")


def fetch_info(token: str) -> dict:
    r = requests.get(FINMIND, params={"dataset": "TaiwanStockInfo", "token": token}, timeout=120)
    data = r.json().get("data", [])
    info = {}
    # 同一 id 可能有多筆（不同日期），取任一即可
    for x in data:
        sid = x.get("stock_id", "")
        if sid in info:
            continue
        info[sid] = {
            "name": x.get("stock_name", sid),
            "industry": x.get("industry_category"),
            "type": x.get("type"),
        }
    return info


def fetch_trade_values() -> dict:
    vals: dict[str, float] = {}
    try:
        for x in requests.get(TWSE_ALL, timeout=60).json():
            code = x.get("Code", "")
            if STOCK_ID_RE.match(code):
                try:
                    vals[code] = float(x.get("TradeValue", 0) or 0)
                except ValueError:
                    pass
    except Exception as e:  # noqa: BLE001
        print(f"  ! TWSE 取得失敗：{e}")
    try:
        for x in requests.get(TPEX_ALL, timeout=60).json():
            code = x.get("SecuritiesCompanyCode", "")
            if STOCK_ID_RE.match(code):
                try:
                    vals[code] = float(str(x.get("TransactionAmount", 0)).replace(",", "") or 0)
                except ValueError:
                    pass
    except Exception as e:  # noqa: BLE001
        print(f"  ! TPEx 取得失敗：{e}")
    return vals


def main() -> int:
    target = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 200
    token = get_token()

    cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    sub_ind = load_sub_industry()
    # 既有自訂主題：排除「等於官方產業別」的粗主題，這些應由細產業表或官方別接手
    custom_theme = {
        s["id"]: s["theme"] for s in cfg.get("stocks", [])
        if s.get("theme") and s["id"] not in sub_ind
    }
    keep_ids = [s["id"] for s in cfg.get("stocks", [])]  # 既有清單一律保留

    print("抓取全市場基本資料 (FinMind)...")
    info = fetch_info(token)
    print(f"  共 {len(info)} 筆")
    print("抓取當日成交值 (TWSE + TPEx OpenAPI)...")
    vals = fetch_trade_values()
    print(f"  共 {len(vals)} 檔有成交值")

    def is_valid(sid: str) -> bool:
        meta = info.get(sid)
        if not meta or not STOCK_ID_RE.match(sid):
            return False
        if meta["type"] not in ("twse", "tpex"):
            return False
        if meta["industry"] in EXCLUDE_INDUSTRY:
            return False
        return True

    # 候選：有效普通股且有成交值，依成交值排序
    candidates = sorted(
        (sid for sid in info if is_valid(sid) and sid in vals),
        key=lambda s: vals.get(s, 0),
        reverse=True,
    )

    selected: list[str] = []
    seen = set()
    for sid in keep_ids:  # 既有清單優先（即使非當日活躍）
        if sid in info and sid not in seen and info[sid]["industry"] not in EXCLUDE_INDUSTRY:
            selected.append(sid)
            seen.add(sid)
    for sid in candidates:
        if len(selected) >= target:
            break
        if sid not in seen:
            selected.append(sid)
            seen.add(sid)

    stocks = []
    for sid in selected:
        meta = info[sid]
        stocks.append({
            "id": sid,
            "name": meta["name"],
            "theme": sub_ind.get(sid) or custom_theme.get(sid) or (meta["industry"] or "其他"),
        })

    cfg["stocks"] = stocks
    CONFIG_PATH.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")

    themes = {}
    for s in stocks:
        themes[s["theme"]] = themes.get(s["theme"], 0) + 1
    print(f"\n完成！寫出 {len(stocks)} 檔到 {CONFIG_PATH}")
    print("主題分佈：")
    for t, c in sorted(themes.items(), key=lambda kv: -kv[1]):
        print(f"  {c:>3}  {t}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
