# FINMETRICS // 台股財務監測儀表板

追蹤台股個股六大財務指標（**應收 · 存貨 · 應付 · 營收 · 毛利% · 淨利**）的單頁監測儀表板。
依細產業／官方產業別分組，對大幅變動以熱力色塊標記，並提供交叉訊號與多種介面風格（含手機卡片版）。

資料來源為開源財經 API [FinMind](https://finmindtrade.com/)。

---

## 功能

- **財報三表 + 多指標監測**
  - 綜合損益表：季營收、營業毛利、**毛利率**、營業利益、稅前/稅後淨利、EPS、月營收。
  - 資產負債表：應收帳款、存貨、合約負債、流動/槓桿科目、總資產、股東權益等。
  - 現金流量表：營業/投資/籌資現金流、資本支出、自由現金流（官方年度累計值已還原為單季）。
- **約 500 檔追蹤**：成交值排行 + AI 供應鏈自訂主題（見 `config/watchlist.json`）。
- **三種分組**：細產業、官方產業別、全市場 Top（可選 Top 10／25／50／100，預設 25）。
- **焦點指標**：可切換任一三表科目；選「月營收」時，主畫面 QoQ 欄會改顯示 **MoM**，趨勢圖為最近 8 個月。
- **熱力色塊**：六大指標 YoY／QoQ（強烈 ±50% / 顯著 30% / 留意 15%；**毛利%** 以百分點 pp：±5 / 3 / 1.5pp），可依 YoY／QoQ(MoM)／絕對值／訊號嚴重度排序。
- **交叉訊號**：見下方「交叉訊號規則」。
- **五種介面風格**：賽博霓虹、霧面玻璃、簡約明亮、便當格、新粗獷（設定會記住於 `localStorage`）。
- **響應式**：桌面為表格；手機（≤720px）改為**一檔一卡**，訊號置頂、六指標附標籤說明。
- **明細展開**：點選個股可展開近 8 季三表明細（月營收為近 12 個月）。
- **指標說明**：右上「？ 指標說明」，或網址 `?help` / `?sig` 直接開啟。

---

## 檔案結構

```
TaiwanStock_Analysis/
├── index.html                  # 儀表板（單檔，CSS/JS 內嵌，含五種主題）
├── data/
│   ├── data.js                 # 前端資料（window.SEED_DATA，由 ETL 產生）
│   └── version.js              # 資料版本戳（快取破壞用）
├── config/
│   └── watchlist.json          # 追蹤清單 + 自訂主題 + 門檻
├── etl/
│   ├── gen_watchlist.py        # 用 TWSE/TPEx 成交值產生 watchlist.json
│   └── build_data.py           # 從 FinMind 抓原始時序，輸出 data/data.js
├── .github/workflows/
│   └── build_data.yml          # GitHub Actions：排程 / 手動更新資料
├── logs/                       # ETL 執行 log（Actions 會一併提交）
├── style test/                 # 舊版單一主題 HTML 原型（僅供參考）
├── plan.md
└── README.md
```

> **架構原則**：資料層只負責抓乾淨的原始時序；所有分析（QoQ/MoM、YoY、訊號、熱力、排序）皆在 `index.html` 前端計算，邏輯單一來源。

---

## 快速開始

### 方式 A：直接開啟

雙擊 `index.html`，或部署於 GitHub Pages 後以網址開啟。頁面會載入 `data/data.js`（帶 `version.js` 快取參數）。

### 方式 B：本機伺服器（建議）

```powershell
python -m http.server 8000
# 瀏覽器開 http://localhost:8000/
```

手機版面可在瀏覽器開發者工具（`Ctrl+Shift+M`）模擬，或將視窗寬度縮至 720px 以下。

---

## 更新資料

### 本機 ETL

```powershell
# 建議先設定 token（見下方「FinMind Token」）
$env:FINMIND_TOKEN = "你的token"

python etl/build_data.py              # 增量：已有完整資料的個股沿用
python etl/build_data.py --refresh    # 接續全量：當日已刷過的沿用，其餘重抓（可分多小時接續）
python etl/build_data.py --full       # 全量：清空後從頭重抓所有個股
```

| 模式 | 說明 |
|------|------|
| **增量**（預設） | 只補「尚無完整資料」的個股；已抓過的直接沿用。適合日常小補。 |
| **接續全量** `--refresh` | 以**今日台北 00:00**為界：`fetched_at` 當日已更新的沿用，其餘重抓。觸發 FinMind 額度時保留已完成部分，**下一輪再跑會接續**未刷新的檔。 |
| **全量** `--full` | 忽略快取，全部重抓。 |

回傳碼：`0` = 全部有資料；`2` = 仍有缺漏（多因額度限制，可再跑）。

### GitHub Actions 自動更新

Workflow：[每日更新台股財務資料](.github/workflows/build_data.yml)

| 觸發 | 執行模式 |
|------|----------|
| **排程** `cron: 0 0-12 * * *`（UTC） | 自動 `build_data.py --refresh` |
| **手動** Run workflow | 可選 `increment` / `refresh` / `full`（預設 increment） |

- 排程約對應 **台北 08:00～20:00 每整點**；GitHub 可能延遲數分鐘至數十分鐘才實際開跑。
- 需在 repo **Settings → Secrets → Actions** 設定 `FINMIND_TOKEN`。
- 成功後會自動 commit `data/data.js`、`data/version.js` 與 `logs/`，並觸發 GitHub Pages 重新部署。

### ⚠️ Anaconda 的 SSL 問題（Windows）

若出現 `Can't connect to HTTPS URL because the SSL module is not available`，請先補 PATH 再執行 ETL：

```powershell
$env:PATH = "C:\Users\<你>\anaconda3;C:\Users\<你>\anaconda3\Library\bin;C:\Users\<你>\anaconda3\DLLs;C:\Users\<你>\anaconda3\Scripts;" + $env:PATH
python etl/build_data.py --refresh
```

### FinMind Token

免費 guest 有每小時請求上限（帶 token 額度較高）。Token **僅用於 ETL / GitHub Actions**，不在網頁上輸入。

```powershell
$env:FINMIND_TOKEN = "你的token"   # PowerShell
set FINMIND_TOKEN=你的token        # cmd
```

---

## 指標欄位對應（FinMind）

| 指標 | dataset | 欄位 |
|------|---------|------|
| 應收帳款／存貨／合約負債 | `TaiwanStockBalanceSheet` | 多科目加總或單一 type（部分公司無合約負債，顯示「—」） |
| 總資產／總負債／股東權益 | `TaiwanStockBalanceSheet` | `TotalAssets` / `Liabilities` / `Equity` |
| 季營收／獲利 | `TaiwanStockFinancialStatements` | `Revenue` / `GrossProfit` / `OperatingIncome` / `IncomeAfterTaxes` / `EPS` 等 |
| **毛利率** | ETL 衍生 | `income.gross_margin` = `GrossProfit ÷ Revenue`（小數，前端顯示為 %） |
| 現金流量 | `TaiwanStockCashFlowsStatement` | 營業/投資/籌資（年度累計→還原單季） |
| 月營收 | `TaiwanStockMonthRevenue` | `revenue`（依歸屬月份） |
| 產業別 | `TaiwanStockInfo` | `industry_category` |

---

## 交叉訊號規則（已實作）

| 訊號 | 條件 | 意義 |
|------|------|------|
| 合約負債暴增 | 合約負債 YoY ≥ 30% | 在手訂單／預收增加，未來營收領先指標 |
| 存貨↑營收↓ | 存貨 YoY ≥ 15% 且 營收 YoY ≤ 0 | 可能滯銷或需求轉弱 |
| 備貨迎需求 | 存貨與營收同步成長（皆 YoY ≥ 15%） | 中性偏正 |
| 應收>營收增速 | 應收 YoY 高出營收 YoY ≥ 10pp | 收款品質惡化或塞貨疑慮 |
| **獲利背離營收** | 季營收 YoY ≥ 15% 且 營業利益 YoY ≤ 0 | 有量沒利，可能降價或成本上升 |
| **獲利虛胖** | 稅後淨利 YoY ≥ 15%，且營業現金流 YoY ≤ 0 或低於淨利 | 帳面獲利未轉為現金 |
| **應付>營收增速** | 應付 YoY 高出營收 YoY ≥ 10pp | 可能延遲付款或囤料，中性偏留意 |
| **月營收領先走強** | 月營收 YoY 領先季營收 YoY ≥ 20pp，或方向背離且月營收偏強 | 需求可能加速，領先季報轉折 |
| **月營收領先轉弱** | 月營收 YoY 落後季營收 YoY ≥ 20pp，或方向背離且季營收偏強 | 需求可能放緩，領先季報轉折 |

---

## 交叉訊號擴充候選（未實作，供未來參考）

以下規則資料皆已在 `data.js` 中，僅尚未寫入 `computeSignals()`。

### 第二優先（週轉天數與獲利品質）

| 候選訊號 | 條件草案 | 意義 |
|----------|----------|------|
| 存貨週轉惡化 | 存貨天數（存貨÷季營收×90）YoY 或 QoQ 拉長 ≥ 門檻 | 比單看存貨 YoY 更穩，跨公司較公平 |
| 應收週轉惡化 | 應收天數（應收÷季營收×90）YoY 或 QoQ 拉長 ≥ 門檻 | 收款週期拉長 |
| 業外撐獲利 | 稅後淨利 YoY > 0，營業利益 YoY ≤ 0，營業外收支為正且占比高 | 本業轉弱、靠業外撐帳面 |
| 毛利率下滑 | 毛利率 YoY 下降 ≥ 3pp，且營收仍成長 | 量增價跌、成本轉嫁不順 |

### 第三優先（擴產與財務體質）

| 候選訊號 | 條件草案 | 意義 |
|----------|----------|------|
| 擴產訊號 | 資本支出 YoY ≥ 30%，且合約負債或營收同步成長 | CapEx 搭配訂單／營收較有意義 |
| 短借攀升 | 短期借款 YoY ≥ 30%，且現金減少或營業現金流為負 | 營運資金吃緊、靠舉債周轉 |
| 自由現金流轉負 | FCF 由正轉負，或連續兩季為負且 CapEx 仍高 | 擴產期可接受，營收未跟上則警訊 |
| 槓桿上升 | 總負債÷總資產（或負債÷權益）較去年同期惡化超過門檻 | 財務結構惡化 |

---

## 自訂追蹤清單

### 自動產生前 N 大（排除金融保險）

```powershell
python etl/gen_watchlist.py        # 預設前 200 大
python etl/gen_watchlist.py 500      # 指定檔數
```

依證交所/櫃買成交值排序；既有自訂主題（AI 供應鏈）會保留。

### 手動編輯

編輯 `config/watchlist.json`：

- `stocks`：個股 `id`、`name`、自訂 `theme`。
- `thresholds`：`strong` / `notable` / `watch`、`small_base`（小基期降權）。
- `quarters_back` / `months_back`：回溯期數。

改完執行 `python etl/build_data.py`（或 `--refresh`）寫入 `data/data.js`。

---

## 注意事項

- **資料延遲**：財報每季更新（5/15、8/14、11/14、隔年 3/31）；月營收每月公布。儀表板顯示各指標最新期別。
- **合約負債**：非所有公司皆有，缺值顯示「—」。
- **毛利率**：由 ETL 自 `GrossProfit ÷ Revenue` 計算；舊版 `data.js` 若無此欄位，前端會自動補算。
- **基期失真**：YoY 在基期極小時易失真，已對絕對金額過小者降權。
- **跨產業比較**：僅比變動率，不比絕對水準。
- **排程與額度**：`--refresh` 在單次 run 額度用盡時會略過剩餘個股；等下一個排程時段或手動選 `refresh` 再跑即可接續。
