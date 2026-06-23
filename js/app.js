/* =========================================================================
 *  FINMETRICS 前端分析層（共用邏輯）
 *  資料來源：window.SEED_DATA（由 etl/build_data.py 產生）/ 更新時即時抓 FinMind
 *  所有 QoQ / YoY / 交叉訊號 / heatmap / 排序皆在此計算（單一邏輯來源）
 *  本檔案被 index.html / index-glass.html / index-minimal.html 共用，
 *  僅樣式（CSS）不同，DOM 結構與 class/id 必須一致。
 * ========================================================================= */

const FINMIND = 'https://api.finmindtrade.com/api/v4/data';
const BALANCE_FIELDS = {
  ar: 'AccountsReceivableNet', inventory: 'Inventories', contract_liab: 'CurrentContractLiabilities',
  total_assets: 'TotalAssets', total_liab: 'Liabilities', equity: 'Equity',
  cash: 'CashAndCashEquivalents', current_assets: 'CurrentAssets', current_liab: 'CurrentLiabilities',
  ap: 'AccountsPayable', st_borrow: 'ShorttermBorrowings', noncurrent_liab: 'NoncurrentLiabilities',
  ppe: 'PropertyPlantAndEquipment'
};
const INCOME_FIELDS  = {
  revenue: 'Revenue', cogs: 'CostOfGoodsSold', gross: 'GrossProfit', op_exp: 'OperatingExpenses',
  op_income: 'OperatingIncome', nonop: 'TotalNonoperatingIncomeAndExpense',
  pre_tax: 'PreTaxIncome', net: 'IncomeAfterTaxes', eps: 'EPS'
};
const CASHFLOW_FIELDS = {
  op_cf: 'CashFlowsFromOperatingActivities',
  inv_cf: 'CashProvidedByInvestingActivities',
  fin_cf: 'CashFlowsProvidedFromFinancingActivities',
  capex: 'PropertyAndPlantAndEquipment'
};

const METRIC_LABELS = {
  ar: '應收帳款', inventory: '存貨', contract_liab: '合約負債',
  total_assets: '總資產', total_liab: '總負債', equity: '股東權益',
  cash: '現金及約當現金', current_assets: '流動資產', current_liab: '流動負債',
  ap: '應付帳款', st_borrow: '短期借款', noncurrent_liab: '非流動負債', ppe: '不動產廠房設備',
  revenue: '季營收', cogs: '營業成本', gross: '營業毛利', op_exp: '營業費用',
  op_income: '營業利益', nonop: '營業外收支',
  pre_tax: '稅前淨利', net: '稅後淨利', eps: 'EPS',
  op_cf: '營業現金流', inv_cf: '投資現金流', fin_cf: '籌資現金流',
  capex: '資本支出', fcf: '自由現金流',
  month_rev: '月營收'
};
// 五大指標 heatmap 顯示順序
const HEAT_METRICS = ['ar', 'inventory', 'contract_liab', 'revenue', 'net'];
const HEAT_SHORT = { ar: '應收', inventory: '存貨', contract_liab: '合約', revenue: '營收', net: '淨利' };

let DATA = window.SEED_DATA || { stocks: [], config: {} };
let TH = Object.assign({ strong: 0.5, notable: 0.3, watch: 0.15, small_base: 100000000 }, (DATA.config || {}).thresholds || {});

const state = {
  group: 'theme',
  metric: 'revenue',
  sort: 'yoy',
  search: '',
  warnOnly: false,
  strongOnly: false,
  expanded: new Set(),
};

/* ---------------- 工具 ---------------- */
const $ = (s) => document.querySelector(s);
const isNum = (v) => typeof v === 'number' && isFinite(v);

function pctChange(cur, prev) {
  if (!isNum(cur) || !isNum(prev) || prev === 0) return null;
  return cur / prev - 1;
}
function fmtMoney(v) {
  if (!isNum(v)) return '—';
  const a = Math.abs(v);
  if (a >= 1e8) return (v / 1e8).toFixed(1) + '億';
  if (a >= 1e4) return Math.round(v / 1e4).toLocaleString() + '萬';
  return v.toLocaleString();
}
function fmtPct(x) {
  if (!isNum(x)) return '—';
  return (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + '%';
}
function fmtEps(v) { return isNum(v) ? v.toFixed(2) : '—'; }

// 取某季指標陣列的最新一期分析
function metricSeries(stock, key) {
  let arr, periods;
  if (key === 'month_rev') {
    arr = stock.month_rev ? stock.month_rev.values : [];
    periods = stock.month_rev ? stock.month_rev.months : [];
    return analyzeSeries(arr, periods, 12); // 月：YoY 比 12 期前
  }
  let src;
  if (key in BALANCE_FIELDS) src = stock.balance;
  else if (key in CASHFLOW_FIELDS || key === 'fcf') src = stock.cashflow;
  else src = stock.income;
  arr = src ? src[key] : null;
  periods = stock.quarters || [];
  return analyzeSeries(arr || [], periods, 4); // 季：YoY 比 4 期前
}

function analyzeSeries(arr, periods, yoyLag) {
  let i = -1;
  for (let k = arr.length - 1; k >= 0; k--) { if (isNum(arr[k])) { i = k; break; } }
  if (i < 0) return { latest: null, period: null, qoq: null, yoy: null, arr, periods };
  const qoq = i >= 1 ? pctChange(arr[i], arr[i - 1]) : null;
  const yoy = i >= yoyLag ? pctChange(arr[i], arr[i - yoyLag]) : null;
  return { latest: arr[i], period: periods[i] || null, qoq, yoy, idx: i, arr, periods };
}

// 變動等級：回傳 {lvl:0-3, dir:'up'|'dn', cls}
function levelOf(yoy, base) {
  if (!isNum(yoy)) return { lvl: -1, cls: 'empty' };
  // 基期過小：降權（避免雜訊洗版）
  const a = Math.abs(yoy);
  let lvl = 0;
  if (a >= TH.strong) lvl = 3; else if (a >= TH.notable) lvl = 2; else if (a >= TH.watch) lvl = 1;
  if (isNum(base) && Math.abs(base) < TH.small_base && lvl > 1) lvl = 1; // 小基期降級
  const dir = yoy >= 0 ? 'up' : 'dn';
  return { lvl, dir, cls: lvl === 0 ? 'lv-0' : `lv-${dir}${lvl}` };
}

/* ---------------- 交叉訊號（plan §5.3） ---------------- */
function computeSignals(stock) {
  const rev = metricSeries(stock, 'revenue');
  const inv = metricSeries(stock, 'inventory');
  const ar = metricSeries(stock, 'ar');
  const cl = metricSeries(stock, 'contract_liab');
  const sig = [];
  if (isNum(cl.yoy) && cl.yoy >= TH.notable && (!isNum(cl.latest) || Math.abs(cl.latest) >= TH.small_base)) {
    sig.push({ t: '合約負債暴增', c: 'good', sev: 2, hint: '在手訂單/預收增加，營收領先指標' });
  }
  if (isNum(inv.yoy) && inv.yoy >= TH.watch) {
    if (isNum(rev.yoy) && rev.yoy <= 0) sig.push({ t: '存貨↑營收↓', c: 'warn', sev: 3, hint: '可能滯銷或需求轉弱' });
    else if (isNum(rev.yoy) && rev.yoy >= TH.watch) sig.push({ t: '備貨迎需求', c: 'info', sev: 1, hint: '存貨與營收同步增，中性偏正' });
  }
  if (isNum(ar.yoy) && isNum(rev.yoy) && ar.yoy > rev.yoy + 0.10 && ar.yoy >= TH.watch) {
    sig.push({ t: '應收>營收增速', c: 'warn', sev: 2, hint: '收款品質惡化或塞貨疑慮' });
  }
  return sig;
}

function severityScore(stock) {
  const sigs = computeSignals(stock);
  return sigs.reduce((m, s) => Math.max(m, s.sev), 0);
}

/* ---------------- Sparkline ---------------- */
function sparkline(arr, dir) {
  const vals = arr.slice(-8).map((v) => (isNum(v) ? v : null));
  const real = vals.filter(isNum);
  if (real.length < 2) return '<span class="muted">—</span>';
  const min = Math.min(...real), max = Math.max(...real);
  const w = 78, h = 22, pad = 2;
  const span = max - min || 1;
  const n = vals.length;
  const pts = [];
  vals.forEach((v, k) => {
    if (!isNum(v)) return;
    const x = pad + (w - 2 * pad) * (k / (n - 1));
    const y = h - pad - (h - 2 * pad) * ((v - min) / span);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  });
  const up = real[real.length - 1] >= real[0];
  const col = up ? 'var(--spark-up)' : 'var(--spark-dn)';
  const last = pts[pts.length - 1].split(',');
  return `<svg class="spark" width="${w}" height="${h}">
    <polyline points="${pts.join(' ')}" fill="none" stroke="${col}" stroke-width="1.5" opacity="0.9"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="2.2" fill="${col}"/>
  </svg>`;
}

/* ---------------- 渲染 ---------------- */
function focusLabel() { return METRIC_LABELS[state.metric] || state.metric; }

function buildRows(stocks) {
  return stocks.map((s) => {
    const f = metricSeries(s, state.metric);
    const sigs = computeSignals(s);
    return { stock: s, f, sigs, sev: sigs.reduce((m, x) => Math.max(m, x.sev), 0) };
  });
}

function sortRows(rows) {
  const key = state.sort;
  rows.sort((a, b) => {
    let va, vb;
    if (key === 'value') { va = a.f.latest; vb = b.f.latest; }
    else if (key === 'qoq') { va = a.f.qoq; vb = b.f.qoq; }
    else if (key === 'severity') { va = a.sev; vb = b.sev; }
    else { va = a.f.yoy; vb = b.f.yoy; }
    va = isNum(va) ? va : -Infinity; vb = isNum(vb) ? vb : -Infinity;
    return vb - va;
  });
  return rows;
}

function passFilters(r) {
  if (state.search) {
    const q = state.search.toLowerCase();
    if (!(r.stock.id.toLowerCase().includes(q) || (r.stock.name || '').toLowerCase().includes(q))) return false;
  }
  if (state.warnOnly && !r.sigs.some((s) => s.c === 'warn')) return false;
  if (state.strongOnly) {
    const lv = levelOf(r.f.yoy, r.f.latest);
    if (lv.lvl < 3) return false;
  }
  return true;
}

function heatCells(stock) {
  return '<span class="heat">' + HEAT_METRICS.map((m) => {
    const an = metricSeries(stock, m);
    if (!isNum(an.yoy)) return `<span class="cell empty" title="${HEAT_SHORT[m]}：無資料">${HEAT_SHORT[m]}</span>`;
    const lv = levelOf(an.yoy, an.latest);
    return `<span class="cell ${lv.cls}" title="${HEAT_SHORT[m]} YoY ${fmtPct(an.yoy)}（${an.period || ''}）">${fmtPct(an.yoy).replace('%','')}</span>`;
  }).join('') + '</span>';
}

function rowHtml(r) {
  const s = r.stock, f = r.f;
  const lv = levelOf(f.yoy, f.latest);
  const strong = lv.lvl >= 3 ? ' row-strong' : '';
  const valStr = state.metric === 'eps' ? fmtEps(f.latest) : fmtMoney(f.latest);
  const tags = r.sigs.map((g) => `<span class="tag ${g.c}" title="${g.hint}">${g.t}</span>`).join('');
  const sparkArr = metricSeries(s, state.metric).arr || [];
  return `<tr data-id="${s.id}" class="${strong}">
    <td class="l sid">${s.id}</td>
    <td class="l sname">${s.name || ''}<div class="muted" style="font-size:10px">${s.theme || ''}</div></td>
    <td>${valStr}<div class="muted" style="font-size:10px">${f.period || ''}</div></td>
    <td class="pct ${isNum(f.qoq) ? (f.qoq >= 0 ? 'up' : 'dn') : 'muted'}">${fmtPct(f.qoq)}</td>
    <td class="pct ${isNum(f.yoy) ? (f.yoy >= 0 ? 'up' : 'dn') : 'muted'}">${fmtPct(f.yoy)}</td>
    <td>${sparkline(sparkArr, lv.dir)}</td>
    <td>${heatCells(s)}</td>
    <td><div class="tags">${tags || '<span class="muted">—</span>'}</div></td>
  </tr>`;
}

function pctSpan(x) {
  if (!isNum(x)) return '<span>—</span>';
  return `<span class="${x >= 0 ? 'up' : 'dn'}">${fmtPct(x)}</span>`;
}

function miniBlock(stock, m, count) {
  const an = metricSeries(stock, m);
  const n = count || 8;
  const periods = an.periods.slice(-n);
  const vals = an.arr.slice(-n);
  if (!vals.some(isNum)) return '';
  const qoqLabel = (m === 'month_rev') ? 'MoM' : 'QoQ';
  const rows = periods.map((p, k) => {
    const v = vals[k];
    return `<tr><td class="per">${p}</td><td>${m === 'eps' ? fmtEps(v) : fmtMoney(v)}</td></tr>`;
  }).join('');
  return `<div class="mini"><h4>${METRIC_LABELS[m]}<span class="kq">YoY ${pctSpan(an.yoy)} ｜ ${qoqLabel} ${pctSpan(an.qoq)}</span></h4>
    <table>${rows}</table></div>`;
}

function detailHtml(stock) {
  const groups = [
    ['綜合損益', ['revenue', 'cogs', 'gross', 'op_exp', 'op_income', 'nonop', 'pre_tax', 'net', 'eps', 'month_rev']],
    ['資產負債', ['ar', 'inventory', 'contract_liab', 'ap', 'cash', 'current_assets', 'current_liab', 'st_borrow', 'noncurrent_liab', 'ppe', 'total_assets', 'total_liab', 'equity']],
    ['現金流量（單季）', ['op_cf', 'inv_cf', 'fin_cf', 'capex', 'fcf']],
  ];
  let html = '';
  groups.forEach(([title, metrics]) => {
    const blocks = metrics.map((m) => miniBlock(stock, m, m === 'month_rev' ? 12 : 8)).filter(Boolean).join('');
    if (blocks) html += `<div class="detail-group"><div class="dg-title">${title}</div><div class="detail-inner">${blocks}</div></div>`;
  });
  return html;
}

function tableHtml(rows) {
  const cols = [
    ['l', '', '代號'], ['l', '', '名稱'],
    ['', 'value', focusLabel()], ['', 'qoq', 'QoQ'], ['', 'yoy', 'YoY'],
    ['', '', '趨勢'], ['', '', '五指標 YoY'], ['', '', '訊號'],
  ];
  const head = cols.map(([cls, key, label]) => {
    const active = (key === 'value' && state.sort === 'value') || (key && key === state.sort);
    return `<th ${key ? `data-sort="${key === 'value' ? 'value' : key}"` : ''}>${label}${active ? ' <span class="arrow">▼</span>' : ''}</th>`;
  }).join('');
  const widths = ['7%', '15%', '13%', '9%', '9%', '12%', '23%', '12%'];
  const colgroup = '<colgroup>' + widths.map((w) => `<col style="width:${w}">`).join('') + '</colgroup>';
  let body = '';
  rows.forEach((r) => {
    body += rowHtml(r);
    if (state.expanded.has(r.stock.id)) {
      body += `<tr class="detail"><td colspan="8">${detailHtml(r.stock)}</td></tr>`;
    }
  });
  return `<div class="tablewrap"><table>${colgroup}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function render() {
  const content = $('#content');
  const stocks = DATA.stocks || [];
  if (!stocks.length) { content.innerHTML = '<div class="empty-state">尚無資料，請點右上角「更新即時資料」。</div>'; return; }

  let html = '';
  if (state.group === 'global') {
    let rows = buildRows(stocks).filter(passFilters);
    rows = sortRows(rows).slice(0, 25);
    html += `<div class="group"><div class="group-head"><h2>全市場 // ${focusLabel()} 變動 TOP ${rows.length}</h2><div class="bar"></div><span class="count">${rows.length} 檔</span></div>${tableHtml(rows)}</div>`;
  } else {
    const keyName = state.group === 'theme' ? 'theme' : 'industry';
    const groups = {};
    stocks.forEach((s) => { const k = s[keyName] || '其他'; (groups[k] = groups[k] || []).push(s); });
    const names = Object.keys(groups).sort();
    names.forEach((name) => {
      let rows = buildRows(groups[name]).filter(passFilters);
      if (!rows.length) return;
      rows = sortRows(rows);
      html += `<div class="group"><div class="group-head"><h2>${name}</h2><div class="bar"></div><span class="count">${rows.length} 檔</span></div>${tableHtml(rows)}</div>`;
    });
    if (!html) html = '<div class="empty-state">沒有符合篩選條件的個股。</div>';
  }
  content.innerHTML = html;
  bindTableEvents();
}

function bindTableEvents() {
  document.querySelectorAll('thead th[data-sort]').forEach((th) => {
    th.onclick = () => { state.sort = th.dataset.sort; $('#sortSel').value = state.sort; render(); };
  });
  document.querySelectorAll('tbody tr[data-id]').forEach((tr) => {
    tr.onclick = () => {
      const id = tr.dataset.id;
      if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id);
      render();
    };
  });
  document.querySelectorAll('tbody .tags .tag').forEach((tag) => {
    tag.onclick = (e) => { e.stopPropagation(); openHelp(true); };
  });
}

function renderUpdated() {
  const box = $('#updatedBox');
  const t = DATA.updated_at;
  let disp = t;
  try { disp = new Date(t).toLocaleString('zh-TW', { hour12: false }); } catch (e) {}
  box.innerHTML = `資料來源 <b>${DATA.source || 'FinMind'}</b>｜最後更新<br><b>${disp || '—'}</b>`;
}

function openHelp(toSignals) {
  const m = $('#helpModal');
  m.classList.add('open');
  const sig = $('#sigHelp');
  if (toSignals && sig) {
    requestAnimationFrame(() => {
      sig.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sig.classList.remove('flash'); void sig.offsetWidth; sig.classList.add('flash');
    });
  } else {
    m.querySelector('.modal').scrollTop = 0;
  }
}

/* ---------------- 即時更新（純前端抓 FinMind） ---------------- */
function toast(msg, keep) {
  const el = $('#toast');
  el.textContent = msg; el.style.display = 'block';
  if (!keep) { clearTimeout(el._t); el._t = setTimeout(() => (el.style.display = 'none'), 2600); }
}

function isRateLimit(e) { return e && /RATE_LIMIT/.test(e.message || ''); }

async function fmFetch(dataset, dataId, startDate, token) {
  const u = new URL(FINMIND);
  u.searchParams.set('dataset', dataset);
  u.searchParams.set('data_id', dataId);
  u.searchParams.set('start_date', startDate);
  if (token) u.searchParams.set('token', token);
  const r = await fetch(u.toString());
  if (r.status === 402 || r.status === 429) throw new Error('RATE_LIMIT');
  if (!r.ok) throw new Error(dataset + ' HTTP ' + r.status);
  const j = await r.json();
  if (j && typeof j.msg === 'string' && /limit/i.test(j.msg)) throw new Error('RATE_LIMIT');
  return j.data || [];
}

// 一次抓全市場基本資料，建 id -> {name, industry}
async function fetchInfoMapLive(token) {
  const u = new URL(FINMIND);
  u.searchParams.set('dataset', 'TaiwanStockInfo');
  if (token) u.searchParams.set('token', token);
  const r = await fetch(u.toString());
  if (r.status === 402 || r.status === 429) throw new Error('RATE_LIMIT');
  const j = await r.json();
  const map = {};
  (j.data || []).forEach((x) => { if (x.stock_id && !map[x.stock_id]) map[x.stock_id] = { name: x.stock_name, industry: x.industry_category }; });
  return map;
}

function stockHasData(s) {
  if (!s || !s.quarters || !s.quarters.length) return false;
  const inc = (s.income && s.income.revenue) || [];
  return inc.some(isNum);
}
function qLabelVal(label) { if (!label) return -1; const [y, q] = label.split('Q'); return parseInt(y, 10) * 4 + parseInt(q, 10); }
// 依財報公布期限，推算「目前應該已有」的最新季別值
function expectedQuarterVal(d) {
  const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
  const after = (mm, dd) => (m > mm || (m === mm && day >= dd));
  if (after(11, 14)) return y * 4 + 3;     // Q3 截止 11/14
  if (after(8, 14)) return y * 4 + 2;       // Q2 截止 8/14
  if (after(5, 15)) return y * 4 + 1;       // Q1 截止 5/15
  if (after(3, 31)) return (y - 1) * 4 + 4; // 前一年 Q4 截止 3/31
  return (y - 1) * 4 + 3;
}

function qLabelFix(d) { const [y, m] = d.split('-'); return `${y}Q${Math.floor((parseInt(m, 10) - 1) / 3) + 1}`; }

function pivotQuarterly(rows, fields, quarters) {
  const byQ = {};
  rows.forEach((x) => {
    const t = x.type;
    if (!Object.values(fields).includes(t)) return;
    const ql = qLabelFix(x.date);
    (byQ[ql] = byQ[ql] || {})[t] = x.value;
  });
  const out = {};
  for (const key in fields) out[key] = quarters.map((q) => (byQ[q] && byQ[q][fields[key]] != null ? byQ[q][fields[key]] : null));
  return out;
}

function deCumulate(cum, quarters) {
  // 年度累計還原為單季：Q1=累計；Q2~Q4=本期−上期
  return quarters.map((q, i) => {
    const qn = parseInt(q.split('Q')[1], 10);
    const v = cum[i];
    if (v == null) return null;
    if (qn === 1) return v;
    if (i >= 1 && cum[i - 1] != null) return v - cum[i - 1];
    return null;
  });
}

function buildMonthRev(mr) {
  const mrMap = {};
  mr.forEach((x) => { const k = (x.revenue_year && x.revenue_month) ? `${x.revenue_year}-${String(x.revenue_month).padStart(2, '0')}` : x.date.slice(0, 7); mrMap[k] = x.revenue; });
  const months = Object.keys(mrMap).sort().slice(-26);
  return { months, values: months.map((m) => mrMap[m]) };
}

// 全抓：四表 + 月營收（基本資料用共用 infoMap，不逐檔抓）
async function buildStockLive(cfg, token, infoMap) {
  const qStart = new Date(Date.now() - 365 * 4 * 86400000).toISOString().slice(0, 10);
  const mStart = new Date(Date.now() - 31 * 26 * 86400000).toISOString().slice(0, 10);
  const [bs, fs, cf, mr] = await Promise.all([
    fmFetch('TaiwanStockBalanceSheet', cfg.id, qStart, token),
    fmFetch('TaiwanStockFinancialStatements', cfg.id, qStart, token),
    fmFetch('TaiwanStockCashFlowsStatement', cfg.id, qStart, token),
    fmFetch('TaiwanStockMonthRevenue', cfg.id, mStart, token),
  ]);
  const meta = (infoMap && infoMap[cfg.id]) || {};
  const industry = meta.industry || '未分類';
  const name = cfg.name || meta.name || cfg.id;
  const qb = (DATA.config.quarters_back || 9) + 4;
  const qset = new Set();
  bs.concat(fs).concat(cf).forEach((x) => qset.add(qLabelFix(x.date)));
  const quarters = Array.from(qset).sort().slice(-qb);
  const balance = pivotQuarterly(bs, BALANCE_FIELDS, quarters);
  const income = pivotQuarterly(fs, INCOME_FIELDS, quarters);
  const cfCum = pivotQuarterly(cf, CASHFLOW_FIELDS, quarters);
  const cashflow = {};
  for (const k in CASHFLOW_FIELDS) cashflow[k] = deCumulate(cfCum[k], quarters);
  cashflow.fcf = cashflow.op_cf.map((o, i) => {
    const c = cashflow.capex[i];
    return (o != null && c != null) ? o + c : null;
  });
  return {
    id: cfg.id, name, industry, theme: cfg.theme || '其他',
    has_contract_liab: balance.contract_liab.some((v) => v != null),
    quarters, balance, income, cashflow,
    month_rev: buildMonthRev(mr),
  };
}

// 只更新月營收（季資料沿用既有），1 次請求
async function refreshMonthOnly(existing, cfg, token) {
  const mStart = new Date(Date.now() - 31 * 26 * 86400000).toISOString().slice(0, 10);
  const mr = await fmFetch('TaiwanStockMonthRevenue', cfg.id, mStart, token);
  return Object.assign({}, existing, { theme: cfg.theme || existing.theme, month_rev: buildMonthRev(mr) });
}

async function refreshData() {
  const btn = $('#refreshBtn');
  const token = $('#tokenBox').value.trim();
  const list = (DATA.config && DATA.config.stocks) ? DATA.config.stocks : (DATA.stocks || []).map((s) => ({ id: s.id, name: s.name, theme: s.theme }));
  if (!list.length) { toast('無追蹤清單可更新'); return; }
  btn.disabled = true;
  const oldById = {};
  (DATA.stocks || []).forEach((s) => { oldById[s.id] = s; });

  // 智慧分類：缺資料/落後最新財報季 -> 全抓；其餘 -> 只更新月營收
  const expVal = expectedQuarterVal(new Date());
  const fullList = [], monthList = [];
  list.forEach((c) => {
    const ex = oldById[c.id];
    if (!stockHasData(ex)) { fullList.push(c); return; }
    const lp = metricSeries(ex, 'revenue').period;
    if (qLabelVal(lp) < expVal) fullList.push(c);
    else monthList.push(c);
  });

  const newById = Object.assign({}, oldById);
  let okCount = 0, done = 0, limited = false;
  const total = fullList.length + monthList.length;
  try {
    const infoMap = fullList.length ? await fetchInfoMapLive(token) : {};
    for (const c of fullList) {
      done++;
      toast(`全抓 ${done}/${total}　${c.id} ${c.name || ''}（缺/新財報）`, true);
      try { newById[c.id] = await buildStockLive(c, token, infoMap); okCount++; }
      catch (e) { if (isRateLimit(e)) { limited = true; break; } console.warn('skip', c.id, e); }
      await new Promise((r) => setTimeout(r, 120));
    }
    if (!limited) for (const c of monthList) {
      done++;
      toast(`更新月營收 ${done}/${total}　${c.id} ${c.name || ''}`, true);
      try { newById[c.id] = await refreshMonthOnly(oldById[c.id], c, token); okCount++; }
      catch (e) { if (isRateLimit(e)) { limited = true; break; } console.warn('skip', c.id, e); }
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!okCount && limited) throw new Error('觸發 FinMind 額度（600 次/小時），請稍後再試或改用 ETL');
    DATA = { updated_at: new Date().toISOString(), source: 'FinMind (即時)', config: DATA.config, stocks: list.map((c) => newById[c.id]).filter(Boolean) };
    renderUpdated();
    render();
    const t = new Date().toLocaleTimeString('zh-TW', { hour12: false });
    let msg = `更新完成：成功 ${okCount}/${total} 檔（需全抓 ${fullList.length}、月營收 ${monthList.length}）@ ${t}`;
    if (limited) msg += `；已達額度，剩餘沿用舊值，稍後再按可續抓`;
    toast(msg);
  } catch (e) {
    toast('更新失敗：' + e.message);
  } finally {
    btn.disabled = false;
  }
}

/* ---------------- 控制項綁定 ---------------- */
function bindControls() {
  $('#groupSeg').querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      $('#groupSeg').querySelectorAll('button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active'); state.group = b.dataset.g; render();
    };
  });
  $('#metricSel').onchange = (e) => { state.metric = e.target.value; render(); };
  $('#sortSel').onchange = (e) => { state.sort = e.target.value; render(); };
  $('#searchBox').oninput = (e) => { state.search = e.target.value.trim(); render(); };
  $('#warnChip').onclick = (e) => { state.warnOnly = !state.warnOnly; e.target.classList.toggle('on'); render(); };
  $('#strongChip').onclick = (e) => { state.strongOnly = !state.strongOnly; e.target.classList.toggle('on'); render(); };
  $('#refreshBtn').onclick = refreshData;
  $('#helpBtn').onclick = () => openHelp(false);
  $('#helpClose').onclick = () => $('#helpModal').classList.remove('open');
  $('#helpModal').onclick = (e) => { if (e.target.id === 'helpModal') $('#helpModal').classList.remove('open'); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('#helpModal').classList.remove('open'); });
}

/* ---------------- 啟動 ---------------- */
function init() {
  if (!window.SEED_DATA) {
    $('#content').innerHTML = '<div class="empty-state">找不到 data/data.js。<br>請先執行 <code>python etl/build_data.py</code> 產生資料，或點右上角「更新即時資料」直接抓取。</div>';
  }
  if (window.FINMIND_TOKEN) $('#tokenBox').value = window.FINMIND_TOKEN; // 自動帶入本機 token
  const exId = new URLSearchParams(location.search).get('expand');
  if (exId) { state.expanded.add(exId); state.search = exId; }
  if (location.search.includes('sig')) openHelp(true);
  else if (location.search.includes('help')) openHelp(false);
  bindControls();
  renderUpdated();
  render();
}
init();
