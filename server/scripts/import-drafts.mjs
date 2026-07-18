// content/articles/*.mjs dagi tayyor maqolalarni bazaga QORALAMA (draft) qilib yuklaydi.
// API kalitisiz kontent to'ldirish yo'li: maqolalar qo'lda yozilgan, bu skript ularni
// admin panelга draft sifatida qo'yadi — inson ko'rib chop etadi.
//
// Ishlatish:
//   node server/scripts/import-drafts.mjs --dry-run   # tekshirish (yozmaydi)
//   node server/scripts/import-drafts.mjs             # draft qilib yuklaydi (dublikat o'tkaziladi)
//
// Dublikat: shu sarlavhali maqola allaqachon bo'lsa — o'tkazib yuboradi.
// Mos keluvchi avtopilot mavzusi (title bo'yicha) bo'lsa — 'done' qilib belgilaydi
// (API kaliti kelганda avtopilot uni qayta yozmaydi).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "..", "..", "content", "articles");

const { Articles, AutopilotTopics, cleanHtml, uniqueSlug } = await import("../db.js");

const args = process.argv.slice(2);
const dry = args.includes("--dry-run");

if (!fs.existsSync(DIR)) {
  console.error("❌ Papka topilmadi:", DIR);
  process.exit(1);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mjs")).sort();
if (!files.length) {
  console.log("Maqola fayllari yo'q:", DIR);
  process.exit(0);
}

let added = 0, skipped = 0, failed = 0;

// Avtopilot navbatidagi mavzuni title bo'yicha 'done' qiladi (bo'lsa).
function markTopicDone(title, articleId) {
  try {
    const t = AutopilotTopics.list().find(
      (x) => x.status === "pending" && x.topic.trim().toLowerCase() === title.trim().toLowerCase()
    );
    if (t) AutopilotTopics.markDone(t.id, articleId);
  } catch { /* ixtiyoriy — muhim emas */ }
}

for (const file of files) {
  let a;
  try {
    a = (await import(pathToFileURL(path.join(DIR, file)).href)).default;
  } catch (e) {
    console.warn(`⚠️  ${file}: o'qib bo'lmadi — ${e.message}`);
    failed++;
    continue;
  }
  if (!a?.title || !a?.content) {
    console.warn(`⚠️  ${file}: title yoki content yo'q — o'tkazildi`);
    failed++;
    continue;
  }

  if (Articles.titleExists(a.title)) {
    console.log(`⏭️  Dublikat: "${a.title}"`);
    skipped++;
    continue;
  }

  if (dry) {
    const words = String(a.content).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    console.log(`✅ [dry] "${a.title}" — ~${words} so'z, ${(a.faqs || []).length} FAQ`);
    added++;
    continue;
  }

  try {
    const created = Articles.insert({
      title: String(a.title).slice(0, 200),
      slug: uniqueSlug(a.slug || a.title),
      excerpt: String(a.excerpt || "").slice(0, 400),
      content: cleanHtml(a.content),          // MUHIM: insert sanitize qilmaydi
      category: String(a.category || "").slice(0, 80),
      author: "Digital CFO",
      status: "draft",
      published_at: null,
      seo_title: String(a.seo_title || "").slice(0, 200),
      seo_description: String(a.seo_description || "").slice(0, 320),
      focus_keyword: String(a.focus_keyword || "").slice(0, 120),
      cover_alt: String(a.cover_alt || "").slice(0, 300),
      cover_caption: String(a.cover_caption || "").slice(0, 300),
      tags: Array.isArray(a.tags) ? a.tags.map((t) => String(t).slice(0, 40)).filter(Boolean) : [],
      faqs: Array.isArray(a.faqs)
        ? a.faqs
            .map((f) => ({ question: String(f.question || "").slice(0, 300), answer: cleanHtml(f.answer || "") }))
            .filter((f) => f.question)
        : [],
    });
    markTopicDone(a.title, created.id);
    console.log(`✅ Qoralama: "${created.title}" (/${created.slug})`);
    added++;
  } catch (e) {
    console.warn(`⚠️  ${file}: yuklab bo'lmadi — ${e.message}`);
    failed++;
  }
}

console.log("\n" + "─".repeat(50));
console.log(`📝 Qo'shildi: ${added} | ⏭️ O'tkazildi: ${skipped} | ⚠️ Xato: ${failed}`);
console.log(dry ? "(dry-run — hech narsa yozilmadi)" : "Admin panel → Maqolalar → qoralamalar tayyor.");
