const CARD_CODES = ["USD", "EUR", "GBP", "BTC"];
let mainChart;

async function loadCards() {
  const el = $("cards");
  try {
    const last = await getLatest(CARD_CODES);
    el.innerHTML = "";
    let newest = null;
    CARD_CODES.forEach((code) => {
      const c = last[code];
      if (!c) return;
      newest = !newest || c.date > newest ? c.date : newest;
      const card = document.createElement("article");
      card.className = "card currency-card";
      card.innerHTML = `
        <div class="top"><span>${code}/BRL</span><span>${c.name}</span></div>
        <div class="price">${fmtBRL(c.price)}</div>
        <div class="change ${dir(c.pct)}">${c.pct >= 0 ? "▲" : "▼"} ${fmtBRL(Math.abs(c.change))} (${fmtPct(c.pct)})</div>
        <div class="spark"><canvas></canvas></div>
        <div class="updated">Compra · ${fmtStamp(c.date)}</div>`;
      el.appendChild(card);
      getHistory(code, 20).then((h) => new Chart(card.querySelector("canvas"), {
        type: "line",
        data: { labels: h.map((p) => fmtDay(p.date)), datasets: [{ data: h.map((p) => p.value),
          borderColor: c.pct >= 0 ? "#16C784" : "#EA5455", borderWidth: 2, pointRadius: 0, tension: 0.35 }] },
        options: { responsive: true, maintainAspectRatio: false, animation: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } } },
      })).catch(() => {});
    });
    $("rows").innerHTML = CARD_CODES.filter((c) => last[c]).map((code) => `
      <tr><td>${last[code].name}</td><td>${code}</td>
      <td class="num">${fmtBRL(last[code].price)}</td>
      <td class="num ${dir(last[code].pct)}">${fmtPct(last[code].pct)}</td></tr>`).join("");
    $("statusText").textContent = "Atualizado em " + fmtStamp(newest) + " · AwesomeAPI";
  } catch (e) {
    showError(el, ERR);
    $("statusText").textContent = "Cotações indisponíveis";
  }
}

async function setPeriod(days) {
  $("chartMsg").textContent = "Carregando…";
  try {
    const h = await getHistory("USD", days);
    mainChart.data.labels = h.map((p) => fmtDay(p.date));
    mainChart.data.datasets[0].data = h.map((p) => p.value);
    mainChart.update();
    $("chartMsg").textContent = "";
  } catch (e) { $("chartMsg").textContent = ERR; }
}

async function loadIndicators() {
  try {
    const selic = await getSeries(11, daysAgo(30));
    const s = selic[selic.length - 1];
    $("selicValue").textContent = fmtNum(s.value, 4) + "% a.d.";
    $("selicNote").textContent = `Selic efetiva diária em ${fmtFull(s.date)} (≈ ${fmtNum(annualize(s.value))}% a.a. estimado). Não é a meta do Copom.`;
  } catch (e) { $("selicNote").textContent = "Selic indisponível no momento."; }
  try {
    const ipca = await getSeries(433, monthsAgo(14));
    const i = ipca[ipca.length - 1];
    $("ipcaValue").textContent = fmtNum(i.value) + "%";
    $("ipcaNote").textContent = `IPCA mensal de ${i.date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })} · acumulado 12 meses: ${fmtNum(accumulate(ipca.slice(-12).map((p) => p.value)))}%`;
  } catch (e) { $("ipcaNote").textContent = "IPCA indisponível no momento."; }
}

mainChart = new Chart($("mainChart"), {
  type: "line",
  data: { labels: [], datasets: [{ label: "USD/BRL (compra)", data: [], borderColor: "#16C784",
    backgroundColor: "rgba(22,199,132,.12)", fill: true, borderWidth: 2, pointRadius: 0, tension: 0.3 }] },
  options: { ...lineOptions(fmtBRL), plugins: { legend: { display: false } } },
});
$("periods").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  document.querySelectorAll("#periods button").forEach((x) => x.classList.remove("active"));
  b.classList.add("active");
  setPeriod(+b.dataset.days);
});

loadCards(); setPeriod(30); loadIndicators();
lucide.createIcons();
