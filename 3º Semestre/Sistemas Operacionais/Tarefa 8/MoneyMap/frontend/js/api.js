// Camada de acesso às APIs (AwesomeAPI e Banco Central) + utilitários compartilhados.
const AWESOME = "https://economia.awesomeapi.com.br/json";
const BCB = "https://api.bcb.gov.br/dados/serie/bcdata.sgs";
const CURRENCIES = {
  BRL: "Real brasileiro", USD: "Dólar americano", EUR: "Euro",
  GBP: "Libra esterlina", JPY: "Iene japonês", ARS: "Peso argentino", BTC: "Bitcoin",
};

const $ = (id) => document.getElementById(id);
const fmtBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtNum = (v, d = 2) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtPct = (v, d = 2) => (v > 0 ? "+" : "") + fmtNum(v, d) + "%";
const fmtDay = (d) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
const fmtFull = (d) => d.toLocaleDateString("pt-BR");
const fmtStamp = (d) => d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
const dir = (v) => (v >= 0 ? "up" : "down");

// fetch com timeout e cache curto em sessionStorage (evita excesso de requisições).
async function getJSON(url, ttl = 60000) {
  const key = "mm:" + url;
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || "null");
    if (hit && Date.now() - hit.t < ttl) return hit.d;
  } catch (_) {}
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (_) {}
    return data;
  } finally { clearTimeout(timer); }
}

// ---- AwesomeAPI (valores de COMPRA/bid, não tempo real garantido) ----
async function getLatest(codes) {
  const pairs = codes.map((c) => c + "-BRL").join(",");
  const raw = await getJSON(`${AWESOME}/last/${pairs}`);
  const out = {};
  codes.forEach((c) => {
    const r = raw[c + "BRL"];
    if (!r) return;
    out[c] = { code: c, name: CURRENCIES[c] || r.name, price: +r.bid, change: +r.varBid,
      pct: +r.pctChange, date: new Date(r.create_date.replace(" ", "T")) };
  });
  return out;
}

async function getHistory(code, days) {
  const raw = await getJSON(`${AWESOME}/daily/${code}-BRL/${days}`, 300000);
  return raw.map((r) => ({ date: new Date(+r.timestamp * 1000), value: +r.bid })).reverse();
}

// Taxa entre duas moedas, usando o BRL como ponte (ex.: USD→EUR = USD-BRL / EUR-BRL).
async function getRate(from, to) {
  if (from === to) return { rate: 1, date: new Date() };
  const codes = [from, to].filter((c) => c !== "BRL");
  const l = await getLatest(codes);
  const f = from === "BRL" ? 1 : l[from]?.price;
  const t = to === "BRL" ? 1 : l[to]?.price;
  if (!f || !t) throw new Error("Cotação indisponível");
  return { rate: f / t, date: (l[from] || l[to]).date };
}

// ---- Banco Central (SGS) ----
const bcbDate = (d) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
async function getSeries(code, start, end = new Date()) {
  const url = `${BCB}.${code}/dados?formato=json&dataInicial=${bcbDate(start)}&dataFinal=${bcbDate(end)}`;
  const raw = await getJSON(url, 3600000);
  return raw.map((r) => {
    const [d, m, y] = r.data.split("/");
    return { date: new Date(+y, +m - 1, +d), value: +r.valor };
  });
}
const monthsAgo = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); return d; };
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
// IPCA acumulado: produto dos fatores mensais.
const accumulate = (vals) => (vals.reduce((a, v) => a * (1 + v / 100), 1) - 1) * 100;
// Selic efetiva diária (% a.d.) → anualizada estimada (252 dias úteis).
const annualize = (daily) => ((1 + daily / 100) ** 252 - 1) * 100;

// ---- Gráficos ----
function lineOptions(yFmt = fmtNum) {
  return { responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false },
    plugins: { legend: { labels: { color: "#8fa0b8" } } },
    scales: { x: { ticks: { color: "#8fa0b8", maxTicksLimit: 8 }, grid: { display: false } },
      y: { ticks: { color: "#8fa0b8", callback: (v) => yFmt(v) }, grid: { color: "#263449" } } } };
}
const showError = (el, msg) => { el.innerHTML = `<p class="error">${msg}</p>`; };
const ERR = "Não foi possível carregar os dados agora. Verifique sua conexão e tente novamente.";
