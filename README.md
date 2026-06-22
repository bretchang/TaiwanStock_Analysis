# FINMETRICS // 台股財務監測儀表板

追蹤台股個股五大財務指標（**應收帳款 · 存貨 · 合約負債 · 營收 · 獲利**）的單頁監測儀表板，
深色 Cyberpunk 風格，依產業／自訂主題分組，對大幅變動自動以熱力色塊標記並排序。

資料來源為開源財經 API [FinMind](https://finmindtrade.com/)。

---

## 功能

- **財報三表 + 多指標監測**：
  - 綜合損益表：季營收、營業毛利、營業利益、稅前/稅後淨利、EPS、月營收（領先指標）。
  - 資產負債表：應收帳款、存貨、合約負債、總資產、總負債、股東權益。
  - 現金流量表：營業/投資/籌資現金流（官方年度累計值已自動還原為單季）。
- **約 200 檔追蹤**：用證交所/櫃買 OpenAPI 的成交值排前 200 大（排除金融保險），並保留 AI 供應鏈自訂主題。
- **分組與比較**：可切換「自訂主題」「官方產業別」「全市場 Top」三種檢視，支援產業內與跨產業比較。
- **大幅變動標記**：每檔顯示五大指標 YoY 熱力色塊（強烈 ±50% / 顯著 30% / 留意 15%），上升暖色、下降冷色，可依 YoY／QoQ／絕對值／訊號嚴重度排序。
- **交叉訊號**：合約負債暴增、存貨↑營收↓、應收增速>營收等自動標籤。
- **指標說明彈窗**：右上「？指標說明」說明三大表與各指標意義（也可用網址 `?help` 直接開啟）。
- **即時更新**：右上「更新即時資料」按鈕純前端直接抓 FinMind，並顯示最後更新時間。
- **明細展開**：點任一列展開近 8 季三表各指標明細與月營收。
- 字型採 JetBrains Mono（數字清晰），深色 Cyberpunk 風格，響應式。

---

## 檔案結構

```
TaiwanStock_Analysis/
├── index.html              # 儀表板（單檔，CSS/JS 內嵌）
├── data/
│   └── data.js             # 前端資料（由 ETL 產生，window.SEED_DATA）
├── config/
│   └── watchlist.json      # 追蹤清單 + 自訂主題 + 門檻（ETL 與前端共用）
├── etl/
│   ├── gen_watchlist.py    # 用 TWSE/TPEx 成交值排前 N 大，產生 watchlist.json
│   └── build_data.py       # 從 FinMind 抓原始時序，輸出 data/data.js
├── plan.md                 # 開發計畫
└── README.md
```

> 架構原則：**資料層只負責抓乾淨的原始時序，所有分析（QoQ/YoY/訊號/熱力/排序）都在前端計算**，邏輯單一來源、易維護。

---

## 快速開始

### 方式 A：直接開啟（最簡單）

雙擊 `index.html` 即可（已內含一份資料快照）。按「更新即時資料」會在瀏覽器直接抓 FinMind 最新數字。

### 方式 B：本機伺服器（可選）

```powershell
python -m http.server 8000
# 瀏覽器開 http://localhost:8000/
```

---

## 更新資料的兩種方式

1. **前端即時更新**：點右上「更新即時資料」。直接抓 FinMind、重算、重繪，並更新「最後更新」時間。
   *此方式為記憶體內更新，不會寫回 `data/data.js`。*

2. **重建快照（持久化）**：執行 ETL 重新產生 `data/data.js`，下次開頁即為最新。

   ```powershell
   python etl/build_data.py          # 增量：只抓「新增/缺資料」的個股，已抓過的沿用
   python etl/build_data.py --full   # 全量重抓所有個股
   ```

   **增量快取**：FinMind guest 有每小時請求上限。增量模式只抓 `data/data.js` 裡尚未有資料的個股；
   若中途觸發額度（HTTP 402），會保留已成功的資料並提前結束，**等額度恢復後再跑一次即可把剩下的補齊**
   （可重複執行，自動接續）。回傳碼 0=全部有資料、2=仍有缺漏。

### ⚠️ Anaconda 的 SSL 問題（Windows）

若執行 ETL 出現 `Can't connect to HTTPS URL because the SSL module is not available`，
是 Anaconda 的 DLL 未在 PATH。請先在該 PowerShell 工作階段補上：

```powershell
$env:PATH = "C:\Users\<你>\anaconda3;C:\Users\<你>\anaconda3\Library\bin;C:\Users\<你>\anaconda3\DLLs;C:\Users\<你>\anaconda3\Scripts;" + $env:PATH
python etl/build_data.py
```

### FinMind Token（選填）

免費 guest 有每小時請求上限。若要抓更多個股或更新頻繁，至 FinMind 註冊取得 token：

- 前端：貼到右上「FinMind Token」欄位。
- ETL：`set FINMIND_TOKEN=你的token`（PowerShell 用 `$env:FINMIND_TOKEN="..."`）後再跑。

---

## 指標欄位對應（FinMind）

| 指標 | dataset | 欄位 |
|------|---------|------|
| 應收帳款／存貨／合約負債 | `TaiwanStockBalanceSheet` | `AccountsReceivableNet` / `Inventories` / `CurrentContractLiabilities`（部分公司無，顯示「—」） |
| 總資產／總負債／股東權益 | `TaiwanStockBalanceSheet` | `TotalAssets` / `Liabilities` / `Equity` |
| 季營收／獲利 | `TaiwanStockFinancialStatements` | `Revenue`/`GrossProfit`/`OperatingIncome`/`PreTaxIncome`/`IncomeAfterTaxes`/`EPS` |
| 營業／投資／籌資現金流 | `TaiwanStockCashFlowsStatement` | `CashFlowsFromOperatingActivities` 等（年度累計→還原單季） |
| 月營收 | `TaiwanStockMonthRevenue` | `revenue`（依歸屬月份標示） |
| 產業別 | `TaiwanStockInfo` | `industry_category` |

---

## 交叉訊號規則

| 訊號 | 條件 | 意義 |
|------|------|------|
| 🟢 合約負債暴增 | 合約負債 YoY ≥ 30% | 在手訂單／預收增加，未來營收領先指標 |
| 🔴 存貨↑營收↓ | 存貨 YoY ≥ 15% 且 營收 YoY ≤ 0 | 可能滯銷或需求轉弱 |
| 🔵 備貨迎需求 | 存貨與營收同步 ↑ | 中性偏正 |
| 🔴 應收>營收增速 | 應收 YoY 明顯高於營收 YoY | 收款品質惡化或塞貨疑慮 |

---

## 自訂追蹤清單

### 自動產生前 N 大（排除金融保險）

```powershell
python etl/gen_watchlist.py        # 預設前 200 大
python etl/gen_watchlist.py 150    # 指定檔數
```

依證交所/櫃買當日成交值排序，排除金融保險與 ETF/ETN 等；既有自訂主題（AI 供應鏈）會被保留並優先，其餘以官方產業別當主題。

### 手動編輯

編輯 `config/watchlist.json`：

- `stocks`：個股 `id`、`name`、自訂 `theme`。
- `thresholds`：標記門檻（`strong`/`notable`/`watch`）與小基期降權門檻 `small_base`。
- `quarters_back` / `months_back`：回溯期數。

改完重跑 `python etl/build_data.py` 即生效（增量，只補新增的）。

---

## 注意事項

- **資料延遲**：財報每季才更新（5/15、8/14、11/14、隔年 3/31），月營收每月 10 日前公布；儀表板顯示「資料截至最新財報期別」。
- **合約負債覆蓋率**：非所有公司皆有此科目，缺值顯示「—」而非 0，避免假訊號。
- **基期失真**：YoY 在去年基期極小時會爆出超大百分比，已對絕對金額過小者（< `small_base`）降權。
- **跨產業比較**：不同產業存貨／應收結構差異大，跨產業僅比變動率、不比絕對水準。
