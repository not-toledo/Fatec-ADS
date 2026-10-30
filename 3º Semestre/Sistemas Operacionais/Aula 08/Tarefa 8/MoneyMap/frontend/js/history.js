const HIST = ["USD", "EUR", "GBP", "JPY", "ARS", "BTC"];
$("currency").innerHTML = HIST.map((c) => `<option value="${c}">${c} — ${CURRENCIES[c]}</option>`).join("");
let days = 30;
const chart = new Chart($("chart"), { type: "line",
  data: { labels: [], datasets: [{ label: "", data: [], borderColor: "#16C784", backgroundColor: "rgba(22,199,132,.12)",
    fill: true, borderWidth: 2, pointRadius: 0, tension: 0.3 }] },
  options: { ...lineOptions(fmtBRL), plugins: { legend: { display: false } } } });

async function load() {
  const code = $("currency").value;
  $("msg").textContent = "Carregando…";
  try {
    const h = await getHistory(code, days);
    if (!h.length) { $("stats").innerHTML = ""; $("msg").textContent = "Sem dados para este período."; return; }
    const v = h.map((p) => p.value);
    const first = v[0], last = v[v.length - 1], pct = ((last - first) / first) * 100;
    $("stats").innerHTML = [
      ["Inicial", fmtBRL(first)], ["Final", fmtBRL(last)], ["Maior", fmtBRL(Math.max(...v))],
      ["Menor", fmtBRL(Math.min(...v))], ["Variação", `<span class="${dir(pct)}">${fmtPct(pct)}</span>`],
    ].map(([l, x]) => `<div class="stat"><span>${l}</span><strong>${x}</strong></div>`).join("");
    chart.data.labels = h.map((p) => fmtFull(p.date));
    chart.data.datasets[0].data = v;
    chart.update();
    $("msg").textContent = `${fmtFull(h[0].date)} a ${fmtFull(h[h.length - 1].date)} · cotação de compra (AwesomeAPI)`;
  } catch (e) { $("msg").textContent = ERR; }
}
$("currency").addEventListener("change", load);
$("periods").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll("#periods button").forEach((x) => x.classList.remove("active"));
  b.classList.add("active"); days = +b.dataset.days; load();
});
load();
