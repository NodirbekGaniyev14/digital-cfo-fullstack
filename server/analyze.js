// Moliyaviy fayl tahlili — yuklangan .xlsx/.xls/.csv dan ko'rsatkichlarni
// aniqlaydi va asosiy KPI'larni hisoblaydi. Yorliqlar o'zbek / rus / ingliz
// tillarida tanib olinadi (heuristik, balans + foyda-zarar hisoboti uchun).
import XLSX from "xlsx";

// Har bir metrik uchun yorliq kalit so'zlari (normalizatsiya qilingan holatda).
// Tartib MUHIM: aniqroq/joriy ko'rsatkichlar umumiylardan oldin keladi.
const METRICS = [
  ["currentAssets", ["joriy aktivlar", "aylanma aktivlar", "current assets", "oborotnye aktivy", "оборотные активы", "текущие активы"]],
  ["currentLiabilities", ["joriy majburiyatlar", "qisqa muddatli majburiyatlar", "current liabilities", "краткосрочные обязательства", "текущие обязательства"]],
  ["inventory", ["tovar-moddiy zaxiralar", "moddiy zaxiralar", "zaxiralar", "inventory", "inventories", "запасы"]],
  ["grossProfit", ["yalpi foyda", "yalpi daromad", "gross profit", "валовая прибыль"]],
  ["totalLiabilities", ["jami majburiyatlar", "majburiyatlar jami", "total liabilities", "итого обязательства", "всего обязательств"]],
  ["totalAssets", ["jami aktivlar", "aktivlar jami", "balans jami", "jami balans", "total assets", "итого активы", "всего активов", "баланс актив"]],
  ["equity", ["xususiy kapital", "oz kapitali", "o'z kapitali", "jami kapital", "kapital va zaxiralar", "equity", "total equity", "собственный капитал", "итого капитал", "капитал и резервы"]],
  ["revenue", ["mahsulot sotishdan tushgan", "sotuvdan tushgan", "sof tushum", "tushum", "net revenue", "net sales", "revenue", "sales", "чистая выручка", "выручка", "доход от реализации"]],
  ["netProfit", ["hisobot davrining sof foydasi", "sof foyda", "net profit", "net income", "чистая прибыль", "чистый доход"]],
];

const normalize = (s) =>
  String(s)
    .toLowerCase()
    .replace(/['`’]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Katak qiymatini songa aylantirish (bo'sh joy/ajratgich/vergulli kasrlar bilan).
function toNumber(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  let s = v.replace(/[\s ]/g, "").replace(/,/g, ".");
  // ortiqcha nuqtalarni (minglik ajratgich) olib tashlash: 1.234.567 -> 1234567
  const parts = s.split(".");
  if (parts.length > 2) s = parts.slice(0, -1).join("") + "." + parts.at(-1);
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

export function analyzeFile(filePath) {
  const wb = XLSX.readFile(filePath, { cellDates: false });
  const found = {};
  const sheetNames = wb.SheetNames;

  for (const name of sheetNames) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], {
      header: 1,
      raw: true,
      defval: null,
    });
    for (const row of rows) {
      if (!Array.isArray(row)) continue;
      const label = normalize(row.filter((c) => typeof c === "string").join(" "));
      if (!label) continue;
      // Qatorning eng o'ngdagi soni — odatda joriy davr qiymati.
      const nums = row.map(toNumber).filter((n) => n != null);
      const value = nums.length ? nums[nums.length - 1] : null;
      if (value == null) continue;

      for (const [key, keywords] of METRICS) {
        if (found[key] != null) continue;
        if (keywords.some((k) => label.includes(k))) {
          found[key] = value;
          break;
        }
      }
    }
  }

  const kpis = computeKpis(found);
  const computed = kpis.filter((k) => k.value != null);
  const pts = { good: 92, warn: 65, bad: 35 };
  const healthScore = computed.length
    ? Math.round(
        computed.reduce((s, k) => s + pts[k.tone], 0) / computed.length
      )
    : null;

  const warnings = [];
  if (!Object.keys(found).length)
    warnings.push(
      "Faylda moliyaviy ko'rsatkichlar avtomatik aniqlanmadi. Yorliqlar standart bo'lishiga ishonch hosil qiling (masalan: 'Jami aktivlar', 'Sof foyda')."
    );
  else if (!computed.length)
    warnings.push(
      "Ko'rsatkichlar topildi, lekin KPI hisoblash uchun yetarli emas (masalan, aktivlar va majburiyatlar juftligi kerak)."
    );

  return { sheets: sheetNames, detected: found, kpis, healthScore, warnings };
}

function band(value, goodMin, warnMin) {
  // yuqori = yaxshi
  if (value >= goodMin) return "good";
  if (value >= warnMin) return "warn";
  return "bad";
}
function bandLow(value, goodMax, warnMax) {
  // past = yaxshi
  if (value <= goodMax) return "good";
  if (value <= warnMax) return "warn";
  return "bad";
}

function computeKpis(f) {
  const out = [];
  const add = (key, label, value, unit, tone, note) =>
    out.push({ key, label, value, unit, tone, note });

  const div = (a, b) => (a != null && b != null && b !== 0 ? a / b : null);

  // Likvidlik
  const cr = div(f.currentAssets, f.currentLiabilities);
  if (cr != null)
    add("currentRatio", "Joriy likvidlik (Current Ratio)", round2(cr), "", band(cr, 1.5, 1), noteLiq(cr));

  const qr =
    f.currentAssets != null && f.inventory != null && f.currentLiabilities
      ? (f.currentAssets - f.inventory) / f.currentLiabilities
      : null;
  if (qr != null)
    add("quickRatio", "Tezkor likvidlik (Quick Ratio)", round2(qr), "", band(qr, 1, 0.7),
      qr >= 1 ? "Zaxirasiz ham majburiyatlarni qoplay oladi." : "Tezkor aktivlar yetarli emas bo'lishi mumkin.");

  // To'lov qobiliyati
  const dr = div(f.totalLiabilities, f.totalAssets);
  if (dr != null)
    add("debtRatio", "Qarz darajasi (Debt Ratio)", round2(dr), "", bandLow(dr, 0.5, 0.7),
      dr <= 0.5 ? "Qarz yuki past va xavfsiz." : dr <= 0.7 ? "Qarz darajasi o'rtacha." : "Qarz yuki yuqori — diqqat talab qiladi.");

  const er = div(f.equity, f.totalAssets);
  if (er != null)
    add("equityRatio", "Kapital ulushi (Equity Ratio)", pct(er), "%", band(er, 0.4, 0.25),
      er >= 0.4 ? "Moliyaviy mustaqillik yuqori." : "Kapital ulushi pastroq.");

  // Rentabellik
  const npm = div(f.netProfit, f.revenue);
  if (npm != null)
    add("netMargin", "Sof foyda marjasi", pct(npm), "%", band(npm, 0.1, 0.03),
      npm >= 0.1 ? "Rentabellik yaxshi darajada." : npm >= 0.03 ? "Rentabellik o'rtacha." : "Foyda marjasi past.");

  const gm = div(f.grossProfit, f.revenue);
  if (gm != null)
    add("grossMargin", "Yalpi foyda marjasi", pct(gm), "%", band(gm, 0.25, 0.1), "Mahsulot/xizmat rentabelligi.");

  const roa = div(f.netProfit, f.totalAssets);
  if (roa != null)
    add("roa", "Aktivlar rentabelligi (ROA)", pct(roa), "%", band(roa, 0.05, 0.02), "Aktivlardan foyda samaradorligi.");

  const roe = div(f.netProfit, f.equity);
  if (roe != null)
    add("roe", "Kapital rentabelligi (ROE)", pct(roe), "%", band(roe, 0.12, 0.05), "Egalar kapitalidan daromad.");

  return out;
}

const round2 = (n) => Math.round(n * 100) / 100;
const pct = (n) => Math.round(n * 1000) / 10; // foizda, 1 kasr
function noteLiq(cr) {
  if (cr >= 1.5) return "Joriy likvidlik me'yordan yuqori.";
  if (cr >= 1) return "Likvidlik chegaraviy darajada.";
  return "Joriy majburiyatlarni qoplash qiyin bo'lishi mumkin.";
}
