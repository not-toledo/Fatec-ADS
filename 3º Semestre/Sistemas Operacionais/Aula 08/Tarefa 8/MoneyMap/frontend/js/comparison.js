const COLORS = { USD: "#16C784", EUR: "#4C8DFF", GBP: "#F5A524", JPY: "#B26BFF" };
const CMP = Object.keys(COLORS);
$("checks").innerHTML = CMP.map((c, i) => `<label><input type="checkbox" value="${c}" ${i < 2 ? "checked" : ""}> ${c}</label>`).join("");
let days = 90;
const chart = new Chart($("chart"), { type: "line", data: { labels: [], datasets: [] }, options: lineOptions((v) => fmtNum(v, 1)) });
const key = (d) => d.toISOString().slice(0, 10);

async function load() {
  const sel = [...document.querySelectorAll("#checks input:checked")].map((i) => i.value);
  if (sel.length < 2 || sel.length > 3) { $("msg").textContent = "Selecione duas ou três moedas."; return; }
  $("msg").textContent = "Carregando…";
  try {
    const data = await Promise.all(sel.map((c) => getHistory(c, days)));
    const maps = data.map((h) => new Map(h.map((p) => [key(p.date), p.value])));
    const dates = [...maps[0].keys()].filter((d) => maps.every((m) => m.has(d))).sort(); // datas comuns
    if (!dates.length) { $("msg").textContent = "Sem datas em comum para as moedas escolhidas."; return; }
    chart.data.labels = dates.map((d) => fmtFull(new Date(d + "T12:00:00")));
    chart.data.datasets = sel.map((c, i) => {
      const base = maps[i].get(dates[0]);
      return { label: c, data: dates.map((d) => (maps[i].get(d) / base) * 100), borderColor: COLORS[c],
        borderWidth: 2, pointRadius: 0, tension: 0.3 };
    });
    chart.update();
    $("rows").innerHTML = sel.map((c, i) => {
      const a = maps[i].get(dates[0]), b = maps[i].get(dates[dates.length - 1]), p = ((b - a) / a) * 100;
      return `<tr><td>${c}</td><td class="num">${fmtBRL(a)}</td><td class="num">${fmtBRL(b)}</td><td class="num ${dir(p)}">${fmtPct(p)}</td></tr>`;
    }).join("");
    $("msg").textContent = `Séries normalizadas (início = 100) · ${chart.data.labels[0]} a ${chart.data.labels[dates.length - 1]} · AwesomeAPI`;
  } catch (e) { $("msg").textContent = ERR; }
}
$("checks").addEventListener("change", load);
$("periods").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll("#periods button").forEach((x) => x.classList.remove("active"));
  b.classList.add("active"); days = +b.dataset.days; load();
});
load();
