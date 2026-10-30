const codes = Object.keys(CURRENCIES);
const opts = codes.map((c) => `<option value="${c}">${c} — ${CURRENCIES[c]}</option>`).join("");
$("from").innerHTML = opts; $("to").innerHTML = opts;
$("from").value = "BRL"; $("to").value = "USD";
let timer;

// Aceita "1.000,50" (pt-BR), "1000.50", "1000,5" e "1.000" (mil).
function parseAmount(raw) {
  let s = raw.trim().replace(/\s/g, "");
  if (!/^[\d.,]+$/.test(s)) return NaN;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, "");
  else if (/^\d{1,3}\.\d{3}$/.test(s)) s = s.replace(".", "");
  return Number(s);
}
const decimalsFor = (code) => (code === "BTC" ? 8 : 2);

async function convert() {
  const out = $("result");
  const amount = parseAmount($("amount").value);
  if ($("amount").value.trim() === "" || !Number.isFinite(amount) || amount < 0) {
    out.innerHTML = "<small>Digite um valor numérico válido (maior ou igual a zero).</small>"; return;
  }
  const from = $("from").value, to = $("to").value;
  if (from === to) { out.innerHTML = `<strong>${fmtNum(amount, decimalsFor(to))} ${to}</strong><small>As moedas são iguais.</small>`; return; }
  out.innerHTML = "<small>Convertendo…</small>";
  try {
    const { rate, date } = await getRate(from, to);
    out.innerHTML = `<strong>${fmtNum(amount * rate, decimalsFor(to))} ${to}</strong>
      <small>1 ${from} = ${fmtNum(rate, rate < 0.001 ? 10 : 6)} ${to} · cotação de compra (AwesomeAPI) de ${fmtStamp(date)}</small>`;
  } catch (e) { out.innerHTML = `<p class="error">${ERR}</p>`; }
}
const schedule = () => { clearTimeout(timer); timer = setTimeout(convert, 300); };
["amount", "from", "to"].forEach((id) => $(id).addEventListener("input", schedule));
$("swap").addEventListener("click", () => { const f = $("from").value; $("from").value = $("to").value; $("to").value = f; convert(); });
convert();
