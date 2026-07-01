/* =============================================================================
 * config/leaders.js  —  台股細產業 × 全球龍頭對照（單一資料源）
 * -----------------------------------------------------------------------------
 * 由 index.html（全球龍頭 view）與 leaders.html 共同載入：window.LEADERS_DATA.data
 * 每筆 = 一個細產業卡：cat/sub/lead/twRank/tags/tw/us/jp/kr/(cn)/(leadText)/rel
 *   - lead：全球龍頭所在地區（tw/us/jp/kr/other，other 多為中/歐）
 *   - twRank：台股全球地位 ★全球龍頭 / ◆全球前段 / ○利基或落後
 *   - tags：對應 config/tag.js 的標籤（作為與財務監測 view 的 join key）
 *   - peer.lead:true → 該地區個股即該細產業全球龍頭（顯示 ★）
 * 時點：2025H2~2026 快照，市占/競合會變動，非投資建議。
 * ============================================================================= */
window.LEADERS_DATA = {
  version: "2026-07-01",
  updated: "2026-07-01",
  note: "台股細產業 × 美/日/韓/中 全球龍頭對照；tags 對應 tag.js 供 index.html 串接。",
  data: [
  {
    "cat": "半導體核心",
    "sub": "晶圓代工",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "晶圓代工"
    ],
    "tw": {
      "name": "台積電",
      "biz": "先進製程全球壟斷 >90%",
      "id": "2330",
      "lead": true
    },
    "us": {
      "name": "Intel Foundry / GlobalFoundries",
      "biz": "重返代工／成熟製程",
      "tic": "INTC / GFS"
    },
    "jp": {
      "name": "Rapidus（2nm 試產）",
      "biz": "追趕中",
      "tic": "未上市"
    },
    "kr": {
      "name": "三星晶圓代工",
      "biz": "全球#2，先進製程唯一對手",
      "tic": "005930.KS"
    },
    "rel": "台積電是 Nvidia/Apple/AMD/聯發科的核心代工，AI 供應鏈源頭；三星為先進製程主要競爭者。成熟製程另有聯電2303、世界先進5347、力積電6770。"
  },
  {
    "cat": "半導體核心",
    "sub": "IC 設計（Fabless）",
    "lead": "us",
    "twRank": "◆",
    "tags": [
      "運算晶片",
      "特殊應用晶片"
    ],
    "tw": {
      "name": "聯發科",
      "biz": "手機 SoC 全球#1、Fabless 前五",
      "id": "2454"
    },
    "us": {
      "name": "Nvidia / 高通 / 博通",
      "biz": "AI GPU 壟斷、手機高階",
      "tic": "NVDA / QCOM / AVGO",
      "lead": true
    },
    "jp": {
      "name": "瑞薩 / Socionext",
      "biz": "車用 MCU",
      "tic": "6723.T"
    },
    "kr": {
      "name": "三星 System LSI",
      "biz": "Exynos，主要自用",
      "tic": "005930.KS"
    },
    "rel": "聯發科手機 SoC 與高通競爭；ASIC 由世芯3661、創意3443 對打博通/Marvell 雲端大單。全數委台積代工，Nvidia 為 AI 需求源頭。"
  },
  {
    "cat": "半導體核心",
    "sub": "矽智財 IP",
    "lead": "other",
    "twRank": "◆",
    "tags": [
      "矽智財"
    ],
    "leadText": "🇬🇧 英國(Arm)",
    "tw": {
      "name": "力旺",
      "biz": "嵌入式 NVM IP 全球#1",
      "id": "3529",
      "lead": true
    },
    "us": {
      "name": "新思 / 益華 / SiFive",
      "biz": "EDA + IP 雙雄",
      "tic": "SNPS / CDNS"
    },
    "jp": null,
    "kr": null,
    "rel": "CPU 架構龍頭為英商 Arm；力旺在 NVM IP 利基全球第一。晶心科6533 以 RISC-V 與 Arm/SiFive 競爭架構，屬設計最上游。"
  },
  {
    "cat": "半導體核心",
    "sub": "記憶體 DRAM / HBM",
    "lead": "kr",
    "twRank": "○",
    "tags": [
      "動態記憶體"
    ],
    "tw": {
      "name": "南亞科",
      "biz": "標準型 DRAM，市占約2%",
      "id": "2408"
    },
    "us": {
      "name": "美光 Micron",
      "biz": "DRAM/HBM 三強之一",
      "tic": "MU"
    },
    "jp": {
      "name": "鎧俠 Kioxia",
      "biz": "NAND Flash 前段",
      "tic": "285A.T"
    },
    "kr": {
      "name": "三星 / SK 海力士",
      "biz": "HBM 全球龍頭",
      "tic": "005930 / 000660",
      "lead": true
    },
    "rel": "DRAM/HBM 由韓美三強寡占，SK 海力士 HBM 領先供 Nvidia，台廠不在 HBM 戰局。SK 海力士 HBM base die 需台積代工。"
  },
  {
    "cat": "半導體核心",
    "sub": "NOR Flash / 利基記憶體",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "利基記憶體"
    ],
    "tw": {
      "name": "旺宏 / 華邦電",
      "biz": "NOR Flash 全球前二",
      "id": "2337 / 2344",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "旺宏(Macronix)、華邦電(Winbond) 是 NOR Flash 全球龍頭，客戶含車用/工控/Nintendo；華邦另做利基 DRAM，與三強市場區隔。"
  },
  {
    "cat": "半導體核心",
    "sub": "記憶體控制 IC",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "記憶體控制晶片"
    ],
    "tw": {
      "name": "群聯 / 慧榮",
      "biz": "SSD 控制 IC 全球前段",
      "id": "8299",
      "lead": true
    },
    "us": {
      "name": "Marvell",
      "biz": "企業級控制 IC",
      "tic": "MRVL"
    },
    "jp": null,
    "kr": null,
    "rel": "群聯(Phison)、慧榮(SMI) SSD/eMMC 控制 IC 全球領先，綁三星/美光/鎧俠 NAND 顆粒，與 Marvell 競爭。"
  },
  {
    "cat": "半導體核心",
    "sub": "記憶體模組",
    "lead": "us",
    "twRank": "◆",
    "tags": [
      "記憶體模組"
    ],
    "leadText": "🇺🇸 美國(Kingston)",
    "tw": {
      "name": "威剛 / 十銓 / 宇瞻",
      "biz": "全球前段，威剛常居前三",
      "id": "3260 / 4967"
    },
    "us": {
      "name": "金士頓 Kingston",
      "biz": "全球模組#1",
      "tic": "未上市",
      "lead": true
    },
    "jp": null,
    "kr": null,
    "rel": "Kingston 全球第一；台廠威剛、十銓做零售/工控模組，宜鼎5289/宇瞻攻工控嵌入式，向三星/美光採購顆粒。"
  },
  {
    "cat": "半導體核心",
    "sub": "矽晶圓",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "矽晶圓"
    ],
    "tw": {
      "name": "環球晶",
      "biz": "全球#3",
      "id": "6488"
    },
    "us": null,
    "jp": {
      "name": "信越 / SUMCO",
      "biz": "全球#1、#2",
      "tic": "4063 / 3436",
      "lead": true
    },
    "kr": {
      "name": "SK Siltron",
      "biz": "全球#4",
      "tic": "(SK集團)"
    },
    "rel": "矽晶圓是晶圓代工最上游原料，客戶即台積/三星/Intel。日商信越、SUMCO 前二；環球晶(母中美晶5483)全球第三。"
  },
  {
    "cat": "半導體核心",
    "sub": "化合物半導體 GaAs/GaN",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "砷化鎵",
      "氮化鎵",
      "化合物磊晶"
    ],
    "tw": {
      "name": "穩懋",
      "biz": "GaAs 砷化鎵代工全球#1",
      "id": "3105",
      "lead": true
    },
    "us": {
      "name": "Qorvo / Skyworks / Wolfspeed",
      "biz": "RF 前端 / SiC",
      "tic": "QRVO / SWKS / WOLF"
    },
    "jp": {
      "name": "住友電工 / 三菱電機",
      "biz": "化合物基板",
      "tic": "5802 / 6503"
    },
    "kr": null,
    "rel": "穩懋是 Qorvo/Skyworks/博通 的 RF 前端代工夥伴（既客戶又對手）；全新2455 供磊晶為上游，漢磊3707 做 SiC/GaN 代工。"
  },
  {
    "cat": "半導體核心",
    "sub": "功率半導體",
    "lead": "other",
    "twRank": "○",
    "tags": [
      "功率半導體"
    ],
    "leadText": "🇩🇪 德國(Infineon)",
    "tw": {
      "name": "強茂 / 富鼎 / 大中",
      "biz": "分立元件 MOSFET/二極體",
      "id": "2481 / 8261"
    },
    "us": {
      "name": "onsemi / TI / Vishay",
      "biz": "全球前段",
      "tic": "ON / TXN"
    },
    "jp": {
      "name": "羅姆 / 東芝 / 三菱",
      "biz": "SiC/IGBT",
      "tic": "6963 / 6502"
    },
    "kr": null,
    "rel": "全球龍頭為德商 Infineon；高階 IGBT/SiC 由歐日主導。台廠以中低壓分立元件為主，與國際大廠錯位競爭。"
  },
  {
    "cat": "半導體核心",
    "sub": "光罩 Photomask",
    "lead": "us",
    "twRank": "○",
    "tags": [
      "光罩"
    ],
    "tw": {
      "name": "光罩",
      "biz": "區域型小廠、成熟製程",
      "id": "2338"
    },
    "us": {
      "name": "Photronics",
      "biz": "商用光罩全球#1",
      "tic": "PLAB",
      "lead": true
    },
    "jp": {
      "name": "凸版 / 大日本印刷",
      "biz": "商用光罩前段",
      "tic": "7911 / 7912"
    },
    "kr": null,
    "rel": "先進光罩多由晶圓廠內製；商用市場由 Photronics、Toppan、DNP 寡占，台灣光罩屬利基。"
  },
  {
    "cat": "半導體核心",
    "sub": "半導體材料",
    "lead": "jp",
    "twRank": "○",
    "tags": [
      "半導體材料"
    ],
    "tw": {
      "name": "光洋科 / 中砂",
      "biz": "靶材/貴金屬回收、鑽石碟",
      "id": "1785 / 1560"
    },
    "us": {
      "name": "杜邦 / Entegris",
      "biz": "製程化學/過濾",
      "tic": "DD / ENTG"
    },
    "jp": {
      "name": "JSR / 東京應化 / 信越",
      "biz": "光阻/CMP 壟斷",
      "tic": "4185 / 4186",
      "lead": true
    },
    "kr": {
      "name": "Dongjin / SK materials",
      "biz": "光阻/特氣",
      "tic": "(SK)"
    },
    "rel": "光阻、CMP 漿料、特用化學幾乎被日商壟斷；台廠在靶材、再生晶圓、耗材等利基切入，供台積等晶圓廠。"
  },
  {
    "cat": "半導體核心",
    "sub": "封測 OSAT",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "封測"
    ],
    "tw": {
      "name": "日月光投控",
      "biz": "OSAT 全球#1",
      "id": "3711",
      "lead": true
    },
    "us": {
      "name": "Amkor",
      "biz": "OSAT 全球#2",
      "tic": "AMKR"
    },
    "jp": null,
    "kr": null,
    "cn": {
      "name": "江蘇長電 JCET",
      "biz": "全球#3",
      "tic": "600584.SS"
    },
    "rel": "日月光(ASE) 與 Amkor、中國 JCET 競爭；先進封裝主力在台積廠內，OSAT 承接外溢與打線/覆晶，AI 晶片放量直接受惠。力成6239、頎邦6147 跟進。"
  },
  {
    "cat": "半導體核心",
    "sub": "測試代工",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "測試代工"
    ],
    "tw": {
      "name": "京元電子",
      "biz": "獨立測試代工全球#1",
      "id": "2449",
      "lead": true
    },
    "us": {
      "name": "Amkor（含測試）",
      "biz": "兼營測試",
      "tic": "AMKR"
    },
    "jp": null,
    "kr": null,
    "rel": "京元承接 Nvidia/聯發科高階測試，機台採購自 Advantest/Teradyne（上游）；欣銓3264 跟進。"
  },
  {
    "cat": "半導體核心",
    "sub": "先進封裝 CoWoS",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "先進封裝"
    ],
    "tw": {
      "name": "台積電 / 日月光 / 家登",
      "biz": "CoWoS 產能主力/耗材",
      "id": "2330 / 3680",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "CoWoS 由台積主導、產能為瓶頸；日月光3711 承接封裝，家登3680 做 EUV/晶圓載具耗材，辛耘3583 濕製程，屬 AI 晶片關鍵鏈。"
  },
  {
    "cat": "半導體核心",
    "sub": "探針卡 / 測試介面",
    "lead": "us",
    "twRank": "◆",
    "tags": [
      "探針卡"
    ],
    "leadText": "🇺🇸 美國(FormFactor)",
    "tw": {
      "name": "旺矽 / 精測 / 穎崴",
      "biz": "探針卡、MEMS 卡",
      "id": "6223 / 6510 / 6515"
    },
    "us": {
      "name": "FormFactor",
      "biz": "探針卡全球#1",
      "tic": "FORM",
      "lead": true
    },
    "jp": {
      "name": "MJC 日本電子材料",
      "biz": "探針卡",
      "tic": "6871.T"
    },
    "kr": null,
    "rel": "FormFactor 全球第一；台廠旺矽/穎崴/精測在 HBM、AI 晶片測試需求下成長，屬晶圓廠測試介面上游。"
  },
  {
    "cat": "半導體核心",
    "sub": "自動測試設備 ATE",
    "lead": "jp",
    "twRank": "○",
    "tags": [
      "測試設備"
    ],
    "tw": {
      "name": "致茂",
      "biz": "利基測試/電動車測試",
      "id": "2360"
    },
    "us": {
      "name": "Teradyne",
      "biz": "SoC 測試機",
      "tic": "TER"
    },
    "jp": {
      "name": "愛德萬 Advantest",
      "biz": "記憶體/SoC ATE 龍頭",
      "tic": "6857.T",
      "lead": true
    },
    "kr": null,
    "rel": "ATE 由 Advantest、Teradyne 雙雄壟斷；致茂做利基與電動車/電源測試，非主流 ATE。"
  },
  {
    "cat": "半導體核心",
    "sub": "半導體前段設備",
    "lead": "other",
    "twRank": "○",
    "tags": [
      "半導體設備"
    ],
    "leadText": "🇳🇱 荷蘭(ASML)",
    "tw": {
      "name": "京鼎 / 弘塑 / 辛耘",
      "biz": "設備次系統/濕製程",
      "id": "3413 / 3131"
    },
    "us": {
      "name": "應材 / 科林 / 科磊",
      "biz": "沉積/蝕刻/量測",
      "tic": "AMAT / LRCX / KLAC"
    },
    "jp": {
      "name": "東京威力 TEL",
      "biz": "塗布/蝕刻",
      "tic": "8035.T"
    },
    "kr": null,
    "rel": "EUV 微影由荷商 ASML 獨家、前段被美日荷壟斷。台廠做次系統代工（京鼎之於 AMAT）與零組件，客戶為台積。"
  },
  {
    "cat": "半導體核心",
    "sub": "半導體耗材（EUV Pod）",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "半導體耗材"
    ],
    "tw": {
      "name": "家登",
      "biz": "EUV 光罩傳送盒全球#1",
      "id": "3680",
      "lead": true
    },
    "us": {
      "name": "Entegris",
      "biz": "晶圓載具/過濾",
      "tic": "ENTG"
    },
    "jp": null,
    "kr": null,
    "rel": "家登 EUV Pod 全球第一，深度綁定台積/ASML；為先進製程專屬耗材利基龍頭。"
  },
  {
    "cat": "半導體核心",
    "sub": "無塵室工程",
    "lead": "tw",
    "twRank": "◆",
    "tags": [
      "無塵室工程"
    ],
    "tw": {
      "name": "漢唐 / 帆宣 / 聖暉",
      "biz": "晶圓廠無塵室與廠務",
      "id": "2404 / 6196",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "漢唐、帆宣、聖暉5536 為台積/美光/Intel 建廠主要潔淨室與氣體系統統包商，受惠全球晶圓廠資本支出；國際對手德商 Exyte。"
  },
  {
    "cat": "半導體核心",
    "sub": "檢測 / 故障分析",
    "lead": "tw",
    "twRank": "◆",
    "tags": [
      "檢測分析"
    ],
    "leadText": "🇹🇼 台灣(汎銓，亞洲)",
    "tw": {
      "name": "汎銓",
      "biz": "材料分析/故障分析亞洲龍頭",
      "id": "6830",
      "lead": true
    },
    "us": {
      "name": "Eurofins EAG",
      "biz": "全球 FA 實驗室",
      "tic": "ERF.PA"
    },
    "jp": null,
    "kr": null,
    "rel": "汎銓(MA-tek) 為亞洲材料/故障分析龍頭，客戶含各晶圓廠/IDM；國際對手為美 Eurofins EAG。"
  },
  {
    "cat": "PCB / 載板 / 材料",
    "sub": "ABF 載板",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "載板"
    ],
    "tw": {
      "name": "欣興 / 南電 / 景碩",
      "biz": "全球前三，AI GPU 大載板",
      "id": "3037 / 8046 / 3189"
    },
    "us": null,
    "jp": {
      "name": "Ibiden / 新光電工",
      "biz": "ABF 載板全球#1",
      "tic": "4062 / 6967",
      "lead": true
    },
    "kr": {
      "name": "三星電機 / LG Innotek",
      "biz": "載板",
      "tic": "009150 / 011070"
    },
    "rel": "ABF 載板由 Ibiden、Shinko、欣興 三強主導，客戶 Intel/Nvidia/AMD。欣興全球前三，AI 大尺寸載板為核心動能。"
  },
  {
    "cat": "PCB / 載板 / 材料",
    "sub": "PCB 板廠（總產值）",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "印刷電路板"
    ],
    "tw": {
      "name": "臻鼎-KY",
      "biz": "PCB 產值全球#1（Apple 軟板）",
      "id": "4958",
      "lead": true
    },
    "us": {
      "name": "TTM",
      "biz": "軍工/通訊板",
      "tic": "TTMI"
    },
    "jp": {
      "name": "Meiko",
      "biz": "車用板",
      "tic": "6787.T"
    },
    "kr": {
      "name": "ISU Petasys",
      "biz": "高層數伺服器板",
      "tic": "007660.KS"
    },
    "rel": "臻鼎(鵬鼎)全球 PCB 產值第一；健鼎3044、華通2313 跟進，AI 伺服器高層板與韓 ISU Petasys 競爭 GB200 訂單。"
  },
  {
    "cat": "PCB / 載板 / 材料",
    "sub": "AI 伺服器 PCB",
    "lead": "tw",
    "twRank": "◆",
    "tags": [
      "印刷電路板"
    ],
    "tw": {
      "name": "金像電 / 健鼎 / 高技",
      "biz": "AI 伺服器高層板/UBB",
      "id": "2368 / 3044",
      "lead": true
    },
    "us": {
      "name": "TTM",
      "biz": "高速板",
      "tic": "TTMI"
    },
    "jp": null,
    "kr": {
      "name": "ISU Petasys",
      "biz": "高層數板競爭者",
      "tic": "007660.KS"
    },
    "rel": "金像電專供 AI 伺服器高層板/UBB，綁 Nvidia GPU 平台；與韓 ISU Petasys 競爭，材料吃高速 CCL。"
  },
  {
    "cat": "PCB / 載板 / 材料",
    "sub": "高速 CCL 銅箔基板",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "高速銅箔基板"
    ],
    "tw": {
      "name": "台光電 / 台燿 / 聯茂",
      "biz": "AI 伺服器高速 CCL 主力",
      "id": "2383 / 6274 / 6213"
    },
    "us": {
      "name": "Isola / Rogers",
      "biz": "高頻材料",
      "tic": "ROG"
    },
    "jp": {
      "name": "松下 Panasonic(Megtron)",
      "biz": "高速 CCL 龍頭",
      "tic": "6752.T",
      "lead": true
    },
    "kr": {
      "name": "Doosan",
      "biz": "CCL/銅箔",
      "tic": "(斗山)"
    },
    "cn": {
      "name": "生益科技",
      "biz": "高速級三強之一",
      "tic": "600183.SS"
    },
    "rel": "AI 伺服器材料核心戰場。台光電高速 CCL 卡進 Nvidia GB200，與 Panasonic(Megtron)、生益 正面競爭；上游吃金居銅箔、富喬玻纖。"
  },
  {
    "cat": "PCB / 載板 / 材料",
    "sub": "高階銅箔",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "高階銅箔"
    ],
    "tw": {
      "name": "金居",
      "biz": "高速 HVLP/RTF 銅箔",
      "id": "8358"
    },
    "us": null,
    "jp": {
      "name": "三井金屬 / 古河電工",
      "biz": "HVLP 銅箔龍頭",
      "tic": "5706 / 5801",
      "lead": true
    },
    "kr": {
      "name": "Iljin / SKC",
      "biz": "銅箔",
      "tic": "020150"
    },
    "rel": "金居 HVLP/RTF 高頻低損耗銅箔切入前段，是台光電/聯茂的上游供應商，對標日商三井金屬、古河。"
  },
  {
    "cat": "PCB / 載板 / 材料",
    "sub": "玻纖布（Low-DK）",
    "lead": "jp",
    "twRank": "○",
    "tags": [
      "玻纖布"
    ],
    "tw": {
      "name": "富喬 / 台玻 / 南亞",
      "biz": "玻纖布（富喬攻 Low-DK；台玻、南亞為大廠）",
      "id": "1815 / 1802 / 1303"
    },
    "us": {
      "name": "AGY",
      "biz": "特殊玻纖",
      "tic": "未上市"
    },
    "jp": {
      "name": "日東紡 Nittobo",
      "biz": "Low-DK 玻纖龍頭",
      "tic": "3110.T",
      "lead": true
    },
    "kr": null,
    "cn": {
      "name": "中國巨石",
      "biz": "量大",
      "tic": "600176.SS"
    },
    "rel": "玻纖布是 CCL 上游；高階 Low-DK/Low-CTE 布由日東紡領先，富喬切入、中國巨石量大；台玻(1802)、南亞(1303) 為台灣傳統玻纖布大廠。"
  },
  {
    "cat": "PCB / 載板 / 材料",
    "sub": "電子材料（PI膜/焊錫）",
    "lead": "jp",
    "twRank": "○",
    "tags": [
      "電子材料"
    ],
    "tw": {
      "name": "達邁 / 昇貿",
      "biz": "PI 膜 / 焊錫錫膏",
      "id": "3645 / 3305"
    },
    "us": null,
    "jp": {
      "name": "Kaneka / 千住金屬",
      "biz": "PI 膜/焊錫龍頭",
      "tic": "4118.T",
      "lead": true
    },
    "kr": {
      "name": "SKC / Kolon",
      "biz": "PI 膜",
      "tic": "011790"
    },
    "rel": "PI 膜（軟板基材/散熱）由日韓主導；達邁為台灣少數量產廠，與 Kaneka/SKC 競爭，供 FPC 板廠。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "MLCC 積層陶瓷電容",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "積層陶瓷電容"
    ],
    "tw": {
      "name": "國巨 / 華新科",
      "biz": "國巨全球#3",
      "id": "2327 / 2492"
    },
    "us": {
      "name": "Vishay",
      "biz": "電容",
      "tic": "VSH"
    },
    "jp": {
      "name": "村田 Murata / TDK / 太陽誘電",
      "biz": "MLCC 全球#1",
      "tic": "6981 / 6762",
      "lead": true
    },
    "kr": {
      "name": "三星電機",
      "biz": "MLCC 全球#2",
      "tic": "009150.KS"
    },
    "rel": "高階 MLCC 由村田主導；國巨(含 KEMET)全球第三，AI 伺服器高容值 MLCC 需求兩邊皆受惠。華新科2492 跟進中低階。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "晶片電阻",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "晶片電阻"
    ],
    "tw": {
      "name": "國巨 / 華新科 / 大毅",
      "biz": "晶片電阻全球#1",
      "id": "2327",
      "lead": true
    },
    "us": {
      "name": "Vishay",
      "biz": "電阻",
      "tic": "VSH"
    },
    "jp": {
      "name": "KOA / 羅姆",
      "biz": "電阻",
      "tic": "6999 / 6963"
    },
    "kr": null,
    "rel": "國巨晶片電阻全球最大；2026 起調漲。華新科、大毅2478 跟進。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "鉭質電容",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "鉭質電容"
    ],
    "tw": {
      "name": "國巨（KEMET）",
      "biz": "鉭質電容全球#1",
      "id": "2327",
      "lead": true
    },
    "us": {
      "name": "Vishay",
      "biz": "鉭電容",
      "tic": "VSH"
    },
    "jp": null,
    "kr": null,
    "rel": "國巨 2020 併購 KEMET 後成鉭質電容全球最大。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "電感",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "電感"
    ],
    "tw": {
      "name": "國巨 / 奇力新 / 臺慶科",
      "biz": "AI 電源電感",
      "id": "2327 / 3357"
    },
    "us": null,
    "jp": {
      "name": "村田 / TDK / 太陽誘電",
      "biz": "電感前段",
      "tic": "6981 / 6762",
      "lead": true
    },
    "kr": null,
    "rel": "日系電感前段；台系奇力新(國巨集團)、臺慶科3357 切 AI 伺服器電源電感。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "鋁質電解電容",
    "lead": "jp",
    "twRank": "○",
    "tags": [
      "鋁質電容"
    ],
    "tw": {
      "name": "立隆電 / 智寶 / 凱美",
      "biz": "中低階鋁電容",
      "id": "2472"
    },
    "us": null,
    "jp": {
      "name": "Nichicon / Rubycon / Chemi-Con",
      "biz": "日系三強",
      "tic": "6996 / 6997",
      "lead": true
    },
    "kr": null,
    "rel": "高階鋁電由日系壟斷；台系立隆電做中低階。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "石英元件",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "石英元件"
    ],
    "tw": {
      "name": "晶技",
      "biz": "石英元件全球前段",
      "id": "3042"
    },
    "us": null,
    "jp": {
      "name": "NDK / Epson / KDS",
      "biz": "石英元件龍頭",
      "tic": "6779 / 6724",
      "lead": true
    },
    "kr": null,
    "rel": "晶技(TXC) 石英晶體全球前段，AI/網通/車用時脈需求，與日商 NDK/Epson 競爭。希華2484 跟進。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "連接器",
    "lead": "us",
    "twRank": "◆",
    "tags": [
      "連接器"
    ],
    "tw": {
      "name": "嘉澤 / 貿聯 / 正崴",
      "biz": "伺服器 CPU/GPU 插槽領先",
      "id": "3533 / 3665"
    },
    "us": {
      "name": "Amphenol / TE / Molex",
      "biz": "連接器全球#1",
      "tic": "APH / TEL",
      "lead": true
    },
    "jp": {
      "name": "廣瀨 Hirose / JAE",
      "biz": "高密度連接器",
      "tic": "6806 / 6807"
    },
    "kr": null,
    "rel": "全球龍頭美商 Amphenol、TE；嘉澤伺服器 Socket 領先供 Intel/AMD，貿聯做 EV 線束與伺服器高速線。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "高速線材 / Cable",
    "lead": "us",
    "twRank": "◆",
    "tags": [
      "高速線材"
    ],
    "tw": {
      "name": "貿聯-KY / 信邦",
      "biz": "AI 伺服器高速銅纜/線束",
      "id": "3665 / 3023"
    },
    "us": {
      "name": "Amphenol",
      "biz": "AI 高速銅纜大贏家",
      "tic": "APH",
      "lead": true
    },
    "jp": null,
    "kr": null,
    "rel": "AI 伺服器內部高速銅纜（NVLink/224G）是 Amphenol 主戰場；貿聯(BizLink) 在部分線束/cable assembly 全球領先。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "散熱模組（風冷/VC）",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "散熱模組"
    ],
    "tw": {
      "name": "奇鋐 / 雙鴻 / 健策",
      "biz": "AI GPU 散熱模組/均熱板",
      "id": "3017 / 3324 / 3653",
      "lead": true
    },
    "us": {
      "name": "Boyd(Eaton)",
      "biz": "熱管理",
      "tic": "ETN"
    },
    "jp": {
      "name": "Nidec 尼得科",
      "biz": "風扇/馬達",
      "tic": "6594.T"
    },
    "kr": null,
    "rel": "AI GPU 散熱模組由台廠主導，奇鋐(AVC)/雙鴻(Auras) 供 Nvidia，健策做 cold plate；component 層台廠強。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "液冷系統 CDU",
    "lead": "us",
    "twRank": "◆",
    "tags": [
      "液冷系統",
      "水冷板"
    ],
    "tw": {
      "name": "台達電 / 高力 / 奇鋐",
      "biz": "冷板/CDU/熱交換器",
      "id": "2308 / 8996 / 3017"
    },
    "us": {
      "name": "Vertiv / CoolIT / Boyd",
      "biz": "資料中心液冷#1",
      "tic": "VRT",
      "lead": true
    },
    "jp": null,
    "kr": null,
    "dk": {
      "name": "Asetek",
      "biz": "液冷",
      "tic": "ASTK.OL"
    },
    "rel": "系統級 CDU/機櫃由 Vertiv 主導；台廠強在 cold plate 與部分 CDU，高力做熱交換器，向美系供零組件（既競爭又上下游）。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "伺服器電源 PSU",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "伺服器電源"
    ],
    "tw": {
      "name": "台達電 / 光寶科 / 全漢",
      "biz": "交換式電源全球#1",
      "id": "2308 / 2301",
      "lead": true
    },
    "us": {
      "name": "Vertiv / MPS",
      "biz": "系統電源/電源 IC",
      "tic": "VRT / MPWR"
    },
    "jp": {
      "name": "TDK-Lambda",
      "biz": "工業電源",
      "tic": "6762.T"
    },
    "kr": null,
    "rel": "台達電為全球電源龍頭，AI 伺服器 power shelf/busbar/PSU 與 800V HVDC 主力；光寶科、全漢跟進。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "不斷電系統 UPS",
    "lead": "tw",
    "twRank": "◆",
    "tags": [
      "不斷電系統"
    ],
    "leadText": "🇹🇼 台灣(旭隼)",
    "tw": {
      "name": "旭隼",
      "biz": "離網逆變器/UPS 全球前二",
      "id": "6409",
      "lead": true
    },
    "us": {
      "name": "Vertiv / Eaton",
      "biz": "資料中心 UPS",
      "tic": "VRT / ETN"
    },
    "jp": null,
    "kr": null,
    "rel": "旭隼(Voltronic) 全球 UPS/離網逆變器前二；資料中心級與 Vertiv/Eaton 互補競爭。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "伺服器滑軌 / 機構",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "伺服器滑軌",
      "機構件"
    ],
    "tw": {
      "name": "川湖",
      "biz": "伺服器滑軌全球領先",
      "id": "2059",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "川湖(King Slide) 伺服器滑軌是 Nvidia/超微與各 ODM 指定供應商，全球地位高；富世達6805 做折疊機軸承。"
  },
  {
    "cat": "被動 / 連接 / 散熱 / 電源 / 機構",
    "sub": "機殼",
    "lead": "tw",
    "twRank": "◆",
    "tags": [
      "機殼"
    ],
    "tw": {
      "name": "勤誠 / 可成 / 鴻準",
      "biz": "伺服器/AI 機殼",
      "id": "8210 / 2474",
      "lead": true
    },
    "us": null,
    "jp": null,
    "cn": {
      "name": "比亞迪電子 / 長盈精密",
      "biz": "手機金屬機殼",
      "tic": "002594"
    },
    "rel": "勤誠(Chenbro) 專攻伺服器/AI 機殼受惠資料中心；可成、鴻準做金屬機殼。"
  },
  {
    "cat": "通訊 / 網通 / 光通訊",
    "sub": "網通交換器（白牌）",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "白牌交換器"
    ],
    "leadText": "🇹🇼 台灣(智邦白牌)",
    "tw": {
      "name": "智邦",
      "biz": "白牌交換器 ODM 全球#1",
      "id": "2345",
      "lead": true
    },
    "us": {
      "name": "思科 / Arista",
      "biz": "交換器品牌龍頭",
      "tic": "CSCO / ANET"
    },
    "jp": null,
    "kr": null,
    "cn": {
      "name": "華為 / 中興",
      "biz": "受地緣限制",
      "tic": "未上市"
    },
    "rel": "智邦(Accton) 替 Microsoft/Meta/Google 代工白牌交換器，AI 800G 為動能；晶片用博通/Nvidia。品牌端思科/Arista。"
  },
  {
    "cat": "通訊 / 網通 / 光通訊",
    "sub": "光通訊模組",
    "lead": "other",
    "twRank": "○",
    "tags": [
      "光通訊模組"
    ],
    "leadText": "🇨🇳 中國(旭創)",
    "tw": {
      "name": "華星光 / 眾達",
      "biz": "光收發模組",
      "id": "4979 / 4977"
    },
    "us": {
      "name": "Coherent / Lumentum",
      "biz": "光元件/模組",
      "tic": "COHR / LITE"
    },
    "jp": null,
    "kr": null,
    "cn": {
      "name": "中際旭創 Innolight",
      "biz": "800G/1.6T 模組#1",
      "tic": "300308.SZ",
      "lead": true
    },
    "rel": "模組龍頭為中國旭創/Eoptolink（綁 Nvidia）、美 Coherent；台廠華星光/眾達規模小，搭 CPO 題材。"
  },
  {
    "cat": "通訊 / 網通 / 光通訊",
    "sub": "光元件 / 雷射磊晶",
    "lead": "us",
    "twRank": "◆",
    "tags": [
      "光元件磊晶"
    ],
    "tw": {
      "name": "聯亞 / 全新 / 聯鈞",
      "biz": "InP/GaAs 雷射磊晶晶粒",
      "id": "3081 / 2455"
    },
    "us": {
      "name": "Coherent / Lumentum",
      "biz": "EML 雷射龍頭",
      "tic": "COHR / LITE",
      "lead": true
    },
    "jp": {
      "name": "住友電工 / 三菱電機",
      "biz": "EML 雷射",
      "tic": "5802 / 6503"
    },
    "kr": null,
    "rel": "EML 雷射是 1.6T 卡關料（美日壟斷）；聯亞做 InP 磊晶/雷射晶粒，是模組廠上游，全新做 GaAs 光通訊磊晶。"
  },
  {
    "cat": "通訊 / 網通 / 光通訊",
    "sub": "矽光子 / CPO",
    "lead": "us",
    "twRank": "○",
    "tags": [
      "矽光子",
      "共封裝光學"
    ],
    "tw": {
      "name": "台積電 / 聯亞 / 智邦",
      "biz": "矽光子製程/CPO 組裝",
      "id": "2330 / 2345"
    },
    "us": {
      "name": "博通 / Marvell / Nvidia",
      "biz": "CPO 交換器主導",
      "tic": "AVGO / MRVL",
      "lead": true
    },
    "jp": null,
    "kr": null,
    "rel": "CPO 把光引擎封進交換器 ASIC，主導權在博通/Nvidia；台積做矽光子製程平台，上詮3363 做 fiber array。"
  },
  {
    "cat": "通訊 / 網通 / 光通訊",
    "sub": "聲學元件",
    "lead": "other",
    "twRank": "○",
    "tags": [
      "聲學元件"
    ],
    "leadText": "🇨🇳 中國(歌爾/立訊)",
    "tw": {
      "name": "美律",
      "biz": "耳機/麥克風 ODM",
      "id": "2439"
    },
    "us": {
      "name": "Knowles",
      "biz": "MEMS 麥克風",
      "tic": "KN"
    },
    "jp": null,
    "kr": null,
    "cn": {
      "name": "歌爾 / 立訊",
      "biz": "AirPods 主力",
      "tic": "002241 / 002475",
      "lead": true
    },
    "rel": "AirPods 由中國歌爾/立訊主導；美律做耳機/麥克風 ODM，屬區域利基。"
  },
  {
    "cat": "通訊 / 網通 / 光通訊",
    "sub": "衛星通訊（低軌）",
    "lead": "us",
    "twRank": "○",
    "tags": [
      "衛星通訊"
    ],
    "tw": {
      "name": "昇達科 / 啟碁",
      "biz": "微波/衛星地面站元件",
      "id": "3491 / 6285"
    },
    "us": {
      "name": "SpaceX Starlink",
      "biz": "低軌衛星龍頭",
      "tic": "未上市",
      "lead": true
    },
    "jp": null,
    "kr": null,
    "rel": "低軌衛星由 SpaceX 主導；台廠昇達科做微波/衛星地面站元件，屬供應鏈利基。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "面板 LCD/OLED",
    "lead": "other",
    "twRank": "○",
    "tags": [
      "面板"
    ],
    "leadText": "🇨🇳 中國(京東方)",
    "tw": {
      "name": "友達 / 群創",
      "biz": "轉利基：車用/工控/Micro LED",
      "id": "2409 / 3481"
    },
    "us": null,
    "jp": {
      "name": "JDI / Sharp",
      "biz": "中小尺寸",
      "tic": "6740 / 6753"
    },
    "kr": {
      "name": "三星顯示 / LG Display",
      "biz": "OLED 龍頭",
      "tic": "034220.KS"
    },
    "cn": {
      "name": "京東方 BOE / 華星",
      "biz": "LCD 全球#1",
      "tic": "000725.SZ",
      "lead": true
    },
    "rel": "大尺寸 LCD 由中國 BOE 主導、OLED 由韓廠領先；台廠友達/群創轉攻車載、Mini-LED 等利基。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "光學鏡頭",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "光學鏡頭"
    ],
    "tw": {
      "name": "大立光 / 玉晶光",
      "biz": "高階手機鏡頭價值全球#1",
      "id": "3008 / 3406",
      "lead": true
    },
    "us": null,
    "jp": {
      "name": "Konica Minolta",
      "biz": "鏡頭",
      "tic": "4902.T"
    },
    "kr": null,
    "cn": {
      "name": "舜宇光學",
      "biz": "出貨量全球#1",
      "tic": "2382.HK"
    },
    "rel": "大立光高階手機鏡頭價值/良率全球第一，主供蘋果；中國舜宇出貨量最大，車用/AI 眼鏡為新動能。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "LED",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "發光二極體"
    ],
    "tw": {
      "name": "富采 / 億光",
      "biz": "Mini/Micro LED 利基",
      "id": "3714 / 2393"
    },
    "us": null,
    "jp": {
      "name": "日亞 Nichia",
      "biz": "白光 LED 專利龍頭",
      "tic": "未上市",
      "lead": true
    },
    "kr": {
      "name": "三星 LED",
      "biz": "LED 元件",
      "tic": "005930"
    },
    "cn": {
      "name": "三安光電",
      "biz": "晶片量產龍頭",
      "tic": "600703.SS"
    },
    "rel": "通用 LED 由日亞、三安主導；台廠富采(晶電+隆達)轉攻 Mini/Micro LED 顯示差異化，億光做封裝。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "電子紙",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "電子紙"
    ],
    "leadText": "🇹🇼 台灣(元太，近壟斷)",
    "tw": {
      "name": "元太",
      "biz": "電子紙全球近壟斷",
      "id": "8069",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "元太(E Ink) 併購 Hydis/SiPix 技術，客戶 Amazon Kindle + 電子貨架標籤，幾乎無全球對手，隱形冠軍。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "觸控貼合",
    "lead": "tw",
    "twRank": "◆",
    "tags": [
      "觸控面板"
    ],
    "tw": {
      "name": "TPK-KY / 業成",
      "biz": "Apple 觸控/貼合",
      "id": "3673 / 6456",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "cn": {
      "name": "歐菲光",
      "biz": "觸控模組",
      "tic": "002456.SZ"
    },
    "rel": "TPK、GIS(業成) 供 Apple 觸控與全貼合；對手中國歐菲光。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "太陽能",
    "lead": "other",
    "twRank": "○",
    "tags": [],
    "leadText": "🇨🇳 中國(隆基/通威)",
    "tw": {
      "name": "元晶 / 聯合再生",
      "biz": "電池片/模組，內需",
      "id": "6443 / 3576"
    },
    "us": {
      "name": "First Solar",
      "biz": "薄膜模組",
      "tic": "FSLR"
    },
    "jp": null,
    "kr": {
      "name": "韓華 Qcells",
      "biz": "模組",
      "tic": "(韓華)"
    },
    "cn": {
      "name": "隆基 / 通威 / 晶科",
      "biz": "全球壟斷",
      "tic": "601012.SS",
      "lead": true
    },
    "rel": "全球由中國隆基/通威/晶科壟斷；台廠元晶/聯合再生規模小，主攻內需與美國反傾銷轉單。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "影像感測 CIS",
    "lead": "jp",
    "twRank": "○",
    "tags": [
      "影像感測"
    ],
    "tw": {
      "name": "同欣電 / 精材",
      "biz": "CIS 封測",
      "id": "6271 / 3374"
    },
    "us": {
      "name": "OmniVision(豪威)",
      "biz": "手機 CIS#3",
      "tic": "603501.SS"
    },
    "jp": {
      "name": "索尼 Sony",
      "biz": "CMOS 影像感測#1",
      "tic": "6758.T",
      "lead": true
    },
    "kr": {
      "name": "三星 LSI",
      "biz": "CIS#2",
      "tic": "005930"
    },
    "rel": "CMOS 影像感測由索尼領先供蘋果；台廠多在 CIS 封測(同欣電/精材)與驅動 IC，未做高階感測設計。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "偏光板 / 光學膜",
    "lead": "jp",
    "twRank": "○",
    "tags": [],
    "tw": {
      "name": "明基材",
      "biz": "偏光板",
      "id": "8215"
    },
    "us": null,
    "jp": {
      "name": "日東電工 / 住友化學",
      "biz": "偏光板龍頭",
      "tic": "6988 / 4005",
      "lead": true
    },
    "kr": {
      "name": "LG 化學",
      "biz": "偏光板",
      "tic": "051910.KS"
    },
    "rel": "偏光板由日東電工、住友化學、LG 化學主導；台廠明基材屬利基。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "背光模組",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "背光模組"
    ],
    "tw": {
      "name": "瑞儀 / 中光電",
      "biz": "背光模組全球領先，供蘋果",
      "id": "6176 / 5371",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "瑞儀背光模組全球領先，供蘋果 iPad/NB，結合 Mini-LED 背光趨勢；中光電、達運跟進。"
  },
  {
    "cat": "光電 / 面板 / 光學",
    "sub": "光學檢測設備",
    "lead": "us",
    "twRank": "○",
    "tags": [],
    "tw": {
      "name": "牧德",
      "biz": "PCB AOI 光學檢測",
      "id": "3563"
    },
    "us": {
      "name": "科磊 KLA",
      "biz": "檢測龍頭",
      "tic": "KLAC",
      "lead": true
    },
    "jp": null,
    "kr": null,
    "il": {
      "name": "Camtek / Orbotech",
      "biz": "PCB/半導體檢測",
      "tic": "CAMT"
    },
    "rel": "半導體/PCB 光學檢測由美 KLA、以色列 Camtek/Orbotech 主導；牧德做 PCB AOI 利基。"
  },
  {
    "cat": "系統 / 品牌 / 組裝 / 通路",
    "sub": "伺服器 / AI 組裝 ODM",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "伺服器組裝"
    ],
    "tw": {
      "name": "鴻海 / 廣達 / 緯穎 / 緯創",
      "biz": "全球 AI 伺服器 ODM 壟斷",
      "id": "2317 / 2382 / 6669",
      "lead": true
    },
    "us": {
      "name": "美超微 / Dell / HPE",
      "biz": "伺服器品牌",
      "tic": "SMCI / DELL / HPE"
    },
    "jp": null,
    "kr": null,
    "cn": {
      "name": "浪潮 Inspur",
      "biz": "伺服器",
      "tic": "000977.SZ"
    },
    "rel": "全球 AI 伺服器幾乎由台廠 ODM 組裝，鴻海做 GB200 機櫃整合；美超微等品牌仍採台廠代工。向上連動電源/散熱/PCB/CCL/連接器。"
  },
  {
    "cat": "系統 / 品牌 / 組裝 / 通路",
    "sub": "NB 代工",
    "lead": "tw",
    "twRank": "★",
    "tags": [],
    "tw": {
      "name": "仁寶 / 廣達 / 緯創 / 鴻海",
      "biz": "全球約九成筆電",
      "id": "2324 / 2382",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "台灣代工全球約九成筆電，客戶 HP/Dell/Apple/Lenovo；為 PC 供應鏈系統整合下游。"
  },
  {
    "cat": "系統 / 品牌 / 組裝 / 通路",
    "sub": "品牌 PC",
    "lead": "other",
    "twRank": "◆",
    "tags": [],
    "leadText": "🇨🇳 中國(聯想)",
    "tw": {
      "name": "華碩 / 宏碁",
      "biz": "全球 PC 品牌前五~六",
      "id": "2357 / 2353"
    },
    "us": {
      "name": "HP / Dell / Apple",
      "biz": "PC 品牌龍頭",
      "tic": "HPQ / DELL / AAPL"
    },
    "jp": null,
    "kr": null,
    "cn": {
      "name": "聯想 Lenovo",
      "biz": "PC 品牌全球#1",
      "tic": "0992.HK",
      "lead": true
    },
    "rel": "PC 品牌龍頭為聯想、HP/Dell/Apple；華碩、宏碁居中段，宏達電2498 轉 VR/XR 利基。"
  },
  {
    "cat": "系統 / 品牌 / 組裝 / 通路",
    "sub": "主機板 / 顯卡",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "主機板"
    ],
    "tw": {
      "name": "華碩 / 技嘉 / 微星",
      "biz": "主機板/顯卡全球主導",
      "id": "2357 / 2376 / 2377",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "主機板/顯卡由華碩/技嘉/微星全球主導，GPU 晶片來自 Nvidia/AMD（上游），技嘉另切 AI 伺服器。"
  },
  {
    "cat": "系統 / 品牌 / 組裝 / 通路",
    "sub": "工業電腦 IPC",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "工業電腦"
    ],
    "tw": {
      "name": "研華",
      "biz": "工業電腦全球#1",
      "id": "2395",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "研華(Advantech) 全球 IPC 龍頭；凌華6166、樺漢6414、神基3005 跟進，邊緣 AI 受惠。"
  },
  {
    "cat": "系統 / 品牌 / 組裝 / 通路",
    "sub": "電子通路",
    "lead": "us",
    "twRank": "◆",
    "tags": [],
    "tw": {
      "name": "大聯大 / 文曄",
      "biz": "亞太最大半導體通路",
      "id": "3702 / 3036"
    },
    "us": {
      "name": "Arrow / Avnet",
      "biz": "全球通路龍頭",
      "tic": "ARW / AVT",
      "lead": true
    },
    "jp": null,
    "kr": null,
    "rel": "全球通路龍頭美 Arrow、Avnet；大聯大、文曄為亞太最大，代理 Nvidia/聯發科，文曄併 Future 後躍居全球前列。"
  },
  {
    "cat": "系統 / 品牌 / 組裝 / 通路",
    "sub": "EMS / 組裝",
    "lead": "tw",
    "twRank": "★",
    "tags": [
      "伺服器組裝"
    ],
    "tw": {
      "name": "鴻海 / 和碩",
      "biz": "全球最大 EMS",
      "id": "2317 / 4938",
      "lead": true
    },
    "us": {
      "name": "Jabil / Flex",
      "biz": "美系 EMS",
      "tic": "JBL / FLEX"
    },
    "jp": null,
    "kr": null,
    "cn": {
      "name": "立訊 / 比亞迪電子",
      "biz": "EMS/組裝",
      "tic": "002475"
    },
    "rel": "鴻海全球 EMS 第一，和碩/廣達跟進；iPhone 組裝由鴻海主導，與美 Jabil/Flex、中立訊在伺服器/車用競爭。"
  },
  {
    "cat": "工業 / 重電 / 自動化",
    "sub": "重電 / 變壓器",
    "lead": "other",
    "twRank": "◆",
    "tags": [
      "重電變壓器"
    ],
    "leadText": "🇪🇺 歐洲(ABB/西門子)",
    "tw": {
      "name": "華城 / 士電 / 中興電",
      "biz": "外銷美國電網/資料中心",
      "id": "1519 / 1503 / 1513"
    },
    "us": {
      "name": "GE Vernova / Eaton",
      "biz": "電力設備",
      "tic": "GEV / ETN"
    },
    "jp": {
      "name": "日立能源 / 三菱電機",
      "biz": "重電系統",
      "tic": "6503.T"
    },
    "kr": {
      "name": "HD 現代電氣 / 曉星",
      "biz": "變壓器外銷主力",
      "tic": "267260.KS"
    },
    "rel": "全球龍頭歐商 ABB/西門子能源；AI 資料中心用電+美國電網更新帶動變壓器缺貨，華城/士電外銷美國與韓 HD 現代競爭。"
  },
  {
    "cat": "工業 / 重電 / 自動化",
    "sub": "線性傳動",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "線性傳動"
    ],
    "tw": {
      "name": "上銀",
      "biz": "線性滑軌全球前段",
      "id": "2049"
    },
    "us": null,
    "jp": {
      "name": "THK / NSK",
      "biz": "線性傳動全球#1",
      "tic": "6481 / 6471",
      "lead": true
    },
    "kr": null,
    "rel": "線性滑軌/滾珠螺桿由日商 THK 領先；上銀全球第二/三，供工具機、半導體設備、機器人；人形機器人為長線題材。"
  },
  {
    "cat": "工業 / 重電 / 自動化",
    "sub": "工具機",
    "lead": "jp",
    "twRank": "○",
    "tags": [
      "工具機"
    ],
    "tw": {
      "name": "東台 / 程泰 / 亞崴",
      "biz": "中價位 CNC",
      "id": "4526 / 1583"
    },
    "us": {
      "name": "Haas",
      "biz": "CNC",
      "tic": "未上市"
    },
    "jp": {
      "name": "山崎馬扎克 / DMG森精機",
      "biz": "工具機全球龍頭",
      "tic": "6141.T",
      "lead": true
    },
    "kr": {
      "name": "DN Solutions",
      "biz": "CNC",
      "tic": "(斗山系)"
    },
    "rel": "全球龍頭日 Mazak/DMG森精機、德 Trumpf；台廠中價位市場具競爭力，CNC 控制器龍頭為日 FANUC。"
  },
  {
    "cat": "工業 / 重電 / 自動化",
    "sub": "氣動元件",
    "lead": "jp",
    "twRank": "◆",
    "tags": [
      "氣動元件"
    ],
    "tw": {
      "name": "亞德客-KY",
      "biz": "中國市占#1、亞洲龍頭",
      "id": "1590"
    },
    "us": null,
    "jp": {
      "name": "SMC",
      "biz": "氣動元件全球#1",
      "tic": "6273.T",
      "lead": true
    },
    "kr": null,
    "rel": "全球龍頭日商 SMC（與德 Festo）；亞德客(AirTAC) 中國市占第一，下游自動化/半導體設備。"
  },
  {
    "cat": "工業 / 重電 / 自動化",
    "sub": "機器視覺",
    "lead": "us",
    "twRank": "○",
    "tags": [
      "機器視覺"
    ],
    "tw": {
      "name": "所羅門",
      "biz": "3D AI 視覺/機器人",
      "id": "2359"
    },
    "us": {
      "name": "Cognex",
      "biz": "機器視覺龍頭",
      "tic": "CGNX",
      "lead": true
    },
    "jp": {
      "name": "Keyence",
      "biz": "感測/視覺",
      "tic": "6861.T"
    },
    "kr": null,
    "rel": "全球龍頭美 Cognex、日 Keyence；所羅門為 Nvidia 機器人視覺生態夥伴，屬利基。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "製鞋代工",
    "lead": "tw",
    "twRank": "★",
    "tags": [],
    "tw": {
      "name": "寶成 / 豐泰",
      "biz": "運動鞋代工全球#1",
      "id": "9904 / 9910",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "寶成全球運動鞋代工#1、豐泰為 Nike 最大代工；品牌端 Nike/adidas，製造基地在越南/印尼。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "自行車",
    "lead": "tw",
    "twRank": "★",
    "tags": [],
    "tw": {
      "name": "巨大 / 美利達",
      "biz": "全球自行車品牌前二",
      "id": "9921 / 9914",
      "lead": true
    },
    "us": {
      "name": "Trek",
      "biz": "高階品牌",
      "tic": "未上市"
    },
    "jp": {
      "name": "禧瑪諾 Shimano",
      "biz": "變速系統壟斷",
      "tic": "7309.T"
    },
    "kr": null,
    "rel": "巨大(捷安特)、美利達全球整車前二；關鍵變速由日 Shimano 近乎壟斷，整車與零件互為上下游。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "窗簾 / 居家",
    "lead": "tw",
    "twRank": "★",
    "tags": [],
    "tw": {
      "name": "億豐",
      "biz": "窗簾/百葉窗全球#1",
      "id": "8464",
      "lead": true
    },
    "us": {
      "name": "Hunter Douglas",
      "biz": "窗簾品牌",
      "tic": "未上市"
    },
    "jp": null,
    "kr": null,
    "rel": "億豐(Nien Made) 窗簾/百葉窗全球第一，供 Home Depot/Lowe's。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "機能紡織",
    "lead": "tw",
    "twRank": "◆",
    "tags": [],
    "tw": {
      "name": "儒鴻 / 聚陽",
      "biz": "機能性服飾 ODM 領先",
      "id": "1476 / 1477"
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "儒鴻、聚陽機能性服飾 ODM 領先，客戶 Nike/Lululemon/Uniqlo；製造基地在東南亞。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "塑化",
    "lead": "other",
    "twRank": "◆",
    "tags": [
      "電子材料",
      "高階銅箔"
    ],
    "leadText": "🇺🇸 美/歐(Dow/BASF)",
    "tw": {
      "name": "台塑四寶",
      "biz": "石化一條龍",
      "id": "1301 / 1303 / 1326"
    },
    "us": {
      "name": "Dow / ExxonMobil",
      "biz": "化工巨頭",
      "tic": "DOW"
    },
    "jp": {
      "name": "三菱化學",
      "biz": "綜合化學",
      "tic": "4188.T"
    },
    "kr": {
      "name": "LG 化學",
      "biz": "石化/電池材料",
      "tic": "051910.KS"
    },
    "cn": {
      "name": "寶武 / 恒力",
      "biz": "產能龐大",
      "tic": "—"
    },
    "rel": "全球龍頭美 Dow、德 BASF；台塑四寶為台灣最大石化集團，南亞1303 另跨玻纖/銅箔電子材料，景氣受中國產能與油價影響。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "貨櫃航運",
    "lead": "other",
    "twRank": "◆",
    "tags": [],
    "leadText": "🇪🇺 歐洲(Maersk/MSC)",
    "tw": {
      "name": "長榮 / 陽明 / 萬海",
      "biz": "全球前七大貨櫃",
      "id": "2603 / 2609 / 2615"
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "全球龍頭丹 Maersk、瑞 MSC、法 CMA CGM；長榮為全球前七大貨櫃航商。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "健身器材",
    "lead": "tw",
    "twRank": "◆",
    "tags": [],
    "leadText": "🇹🇼 台灣(喬山)",
    "tw": {
      "name": "喬山",
      "biz": "健身器材全球前三",
      "id": "1736",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "喬山(Johnson Health) 健身器材全球前段，自有品牌+代工。"
  },
  {
    "cat": "傳產 / 其他",
    "sub": "汽車 AM 維修件",
    "lead": "tw",
    "twRank": "◆",
    "tags": [],
    "tw": {
      "name": "東陽 / 帝寶",
      "biz": "北美 AM 維修件領先",
      "id": "1319 / 6605",
      "lead": true
    },
    "us": null,
    "jp": null,
    "kr": null,
    "rel": "東陽、帝寶北美售後維修件(AM)領先；OE 端由國際 Tier-1 主導，和泰車2207 為 Toyota 代理。"
  }
]
};
