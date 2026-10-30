(async () => {
  try {
    const ipca = await getSeries(433, monthsAgo(25));
    const last = ipca[ipca.length - 1];
    $("ipcaM").textContent = fmtNum(last.value) + "%";
    $("ipcaMn").textContent = last.date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    $("ipca12").textContent = fmtNum(accumulate(ipca.slice(-12).map((p) => p.value))) + "%";
    $("ipca12n").textContent = "Produto dos 12 últimos IPCAs mensais";
    const d = ipca.slice(-24);
    new Chart($("ipcaChart"), { type: "bar", data: { labels: d.map((p) => p.date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })),
      datasets: [{ label: "IPCA mensal (%)", data: d.map((p) => p.value), backgroundColor: "#16C784" }] },
      options: lineOptions((v) => fmtNum(v) + "%") });
  } catch (e) { $("ipcaMn").textContent = ERR; }
  try {
    const selic = await getSeries(11, daysAgo(90));
    const last = selic[selic.length - 1];
    $("selicD").textContent = fmtNum(last.value, 4) + "% a.d.";
    $("selicDn").textContent = `${fmtFull(last.date)} · ≈ ${fmtNum(annualize(last.value))}% a.a. (estimado, 252 dias úteis)`;
    new Chart($("selicChart"), { type: "line", data: { labels: selic.map((p) => fmtFull(p.date)),
      datasets: [{ label: "Selic efetiva (% a.d.)", data: selic.map((p) => p.value), borderColor: "#4C8DFF", borderWidth: 2, pointRadius: 0 }] },
      options: lineOptions((v) => fmtNum(v, 4) + "%") });
  } catch (e) { $("selicDn").textContent = ERR; }
})();
