// 01_CONTENT_CALENDAR.md dagi 300 mavzuni avtopilot navbatiga (autopilot_topics) yuklaydi.
// DCF tartibida qo'shadi -> position 1..300 -> to'g'ri nashr ketma-ketligi.
//
// Ishlatish:
//   node server/scripts/import-calendar.mjs --dry-run      # tekshirish (yozmaydi)
//   node server/scripts/import-calendar.mjs                # navbatga qo'shadi (dublikatlar o'tkaziladi)
//   node server/scripts/import-calendar.mjs --replace      # eski navbatni tozalab, qaytadan yuklaydi
//   node server/scripts/import-calendar.mjs --limit=20     # faqat dastlabki 20 tasi (test uchun)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CALENDAR = path.join(__dirname, "..", "..", "01_CONTENT_CALENDAR.md");

const db = (await import("../db.js")).default;
const { AutopilotTopics } = await import("../db.js");

// --- Argumentlar ---
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const replace = args.includes("--replace");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : null;

// --- Kalendarni parse qilish ---
function parseCalendar(md) {
  const blocks = md.split(/\n#### DCF-/).slice(1); // har maqola bloki
  const out = [];
  for (const b of blocks) {
    const firstLine = b.split("\n")[0]; // "001 · 08:00 · Sarlavha"
    const parts = firstLine.split(" · ");
    const num = (parts[0] || "").trim();
    const title = parts.slice(2).join(" · ").trim();
    const category = (b.match(/\*\*Primary Category:\*\*\s*(.+)/) || [])[1]?.trim() || "";
    const keyword = (b.match(/\*\*Primary Keyword:\*\*\s*(.+)/) || [])[1]?.trim() || "";
    const ps = (b.match(/\*\*Pillar \/ Supporting:\*\*\s*(.+)/) || [])[1]?.trim() || "";
    const length = /pillar/i.test(ps) ? "pillar" : "standard";
    if (/^\d{3}$/.test(num) && title && keyword) {
      out.push({ id: "DCF-" + num, title, keyword, category, length });
    }
  }
  return out;
}

if (!fs.existsSync(CALENDAR)) {
  console.error("✗ 01_CONTENT_CALENDAR.md topilmadi:", CALENDAR);
} else {
  let plan = parseCalendar(fs.readFileSync(CALENDAR, "utf8"));
  if (limit) plan = plan.slice(0, limit);
  console.log(`Kalendardan o'qildi: ${plan.length} maqola`);

  if (dry) {
    console.log("DRY-RUN (yozilmaydi). Namuna:");
    plan.slice(0, 3).forEach((p) => console.log(`  ${p.id} | ${p.category} | ${p.length} | ${p.keyword} | ${p.title}`));
    const pil = plan.filter((p) => p.length === "pillar").length;
    console.log(`  … jami ${plan.length} (${pil} pillar, ${plan.length - pil} standart)`);
  } else {
    if (replace) {
      const n = db.prepare("DELETE FROM autopilot_topics").run().changes;
      console.log(`Eski navbat tozalandi: ${n} ta o'chirildi`);
    }
    const existing = new Set(AutopilotTopics.list().map((t) => t.topic.toLowerCase()));
    let added = 0, skipped = 0;
    for (const p of plan) {
      if (existing.has(p.title.toLowerCase())) { skipped++; continue; }
      AutopilotTopics.add({ topic: p.title, keyword: p.keyword, category: p.category, length: p.length });
      existing.add(p.title.toLowerCase());
      added++;
    }
    console.log(`✅ Qo'shildi: ${added} | O'tkazildi (dublikat): ${skipped} | Navbat jami: ${AutopilotTopics.list().length}`);
  }
}
