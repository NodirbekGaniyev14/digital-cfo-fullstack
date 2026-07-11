// Avtopilot — DCOS Faza 2: rejalashtirilgan avtomatik maqola generatsiyasi.
//
// Xavfsizlik tamoyillari:
//  • Standart holatda O'CHIQ (settings.autopilot_enabled='0') — kutilmagan xarajat yo'q.
//  • Ishlashi uchun ANTHROPIC_API_KEY ham kerak (aiEnabled).
//  • Standart rejim 'draft' — maqola qoralama sifatida yaratiladi, inson chop etadi.
//  • Mavzu manbai: boshqariladigan navbat (autopilot_topics). Navbat bo'sh bo'lsa — jim o'tadi.
//  • Kategoriya rotatsiyasi: ketma-ket bir xil kategoriya yozilmaydi (imkon qadar).
//
// Rejalashtirish mavjud patternga mos: setInterval + Toshkent vaqti + kunlik slot guard
// (settings.autopilot_last_run) — PM2 restartlarida ham barqaror.

import { Articles, AutopilotTopics, AutopilotRuns, Settings, cleanHtml, uniqueSlug } from "./db.js";
import { aiEnabled, generateArticle, generateSocialPackage, scoreArticle } from "./anthropic.js";
import { autoPostArticleTelegram, telegramReady } from "./publisher.js";

const QGATE_MAX_RETRIES = 2; // sifat past bo'lsa ko'pi bilan shuncha marta qayta yoziladi

// Kunlik nashr slotlari (Toshkent, UTC+5) — DCOS Part 8.
export const SLOTS = ["08:00", "12:25", "17:00", "20:30"];
const SLOT_WINDOW_MIN = 15; // slot vaqtidan keyingi 15 daqiqa ichida ishga tushadi
const VALID_MODES = ["draft", "scheduled", "published"];

// Onboarding uchun boshlang'ich mavzular (ixtiyoriy — admin tugma bilan yuklaydi).
export const STARTER_TOPICS = [
  { topic: "Pul oqimi (cash flow) nima va nega muhim", keyword: "pul oqimi", category: "Pul oqimi", length: "standard" },
  { topic: "Buxgalteriya balansini qanday o'qish kerak", keyword: "buxgalteriya balansi", category: "Moliyaviy hisobot", length: "standard" },
  { topic: "Likvidlik koeffitsientlari va ularni izohlash", keyword: "likvidlik", category: "Likvidlik", length: "standard" },
  { topic: "Aylanma kapitalni boshqarish asoslari", keyword: "aylanma kapital", category: "Aylanma kapital", length: "standard" },
  { topic: "Byudjetlashtirish: kichik biznes uchun amaliy qo'llanma", keyword: "byudjet", category: "Byudjet", length: "standard" },
  { topic: "EBITDA nima va qanday hisoblanadi", keyword: "EBITDA", category: "Moliyaviy tahlil", length: "standard" },
  { topic: "Virtual CFO xizmati biznesga qanday foyda keltiradi", keyword: "virtual CFO", category: "CFO", length: "standard" },
  { topic: "Rentabellik ko'rsatkichlari (ROI, ROE, ROA)", keyword: "rentabellik", category: "Rentabellik", length: "standard" },
  { topic: "Moliyaviy prognozlashtirish qanday tuziladi", keyword: "prognoz", category: "Prognozlash", length: "standard" },
  { topic: "Xarajatlarni optimallashtirish strategiyalari", keyword: "xarajatlar", category: "Xarajat boshqaruvi", length: "standard" },
];

// --- Toshkent vaqti (o'zga-serverdan qat'i nazar to'g'ri) ---
function tashkentNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const num = (t) => Number(parts.find((p) => p.type === t)?.value || 0);
  const hour = num("hour") % 24; // 24:00 → 0
  const minute = num("minute");
  const date = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" }); // YYYY-MM-DD
  return { date, minutes: hour * 60 + minute };
}

export function autopilotEnabled() {
  return Settings.get("autopilot_enabled", "0") === "1" && aiEnabled();
}
function getMode() {
  const m = Settings.get("autopilot_mode", "draft");
  return VALID_MODES.includes(m) ? m : "draft";
}

// Keyingi slot vaqtini ko'rsatish uchun (status paneli).
function nextSlotLabel() {
  const { minutes } = tashkentNow();
  for (const slot of SLOTS) {
    const [h, m] = slot.split(":").map(Number);
    if (h * 60 + m > minutes) return slot;
  }
  return `${SLOTS[0]} (ertaga)`;
}

// Kategoriya rotatsiyasi bilan navbatdan mavzu tanlaydi.
function pickTopic() {
  const pend = AutopilotTopics.pending();
  if (!pend.length) return null;
  const last = (AutopilotRuns.lastCategory() || "").toLowerCase();
  if (last) {
    const diff = pend.find((t) => (t.category || "").toLowerCase() !== last);
    if (diff) return diff;
  }
  return pend[0];
}

function clampScore(v, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(50, Math.min(100, Math.round(n)));
}

// Mavzudan maqola generatsiya qiladi. Q-gate yoqilgan bo'lsa: baholaydi va past
// bo'lsa qayta yozadi (eng yaxshi versiyani saqlaydi). Baholay olmasa — bloklamaydi.
async function generateForTopic(topic, { qgate, qmin }) {
  const gen = () =>
    generateArticle({ topic: topic.topic, keyword: topic.keyword, category: topic.category, length: topic.length });

  if (!qgate) return { article: await gen(), score: null };

  let best = null;
  let bestScore = -1;
  for (let attempt = 0; attempt <= QGATE_MAX_RETRIES; attempt++) {
    const article = await gen();
    let total;
    try {
      const ct = String(article.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);
      total = (await scoreArticle({ title: article.title, contentText: ct, keyword: topic.keyword })).total;
    } catch (err) {
      console.warn("⚠️ Q-gate baholash xatosi (versiya qabul qilindi):", err.message);
      return { article, score: null };
    }
    if (total > bestScore) { best = article; bestScore = total; }
    if (total >= qmin) break;
    console.log(`🔁 Sifat past (${total}/100 < ${qmin}) — qayta yozilyapti…`);
  }
  return { article: best, score: bestScore };
}

// Bitta maqola generatsiya qiladi va bazaga (draft/scheduled/published) qo'yadi.
// Xatolar log'ga yoziladi; hech qachon tashqariga throw qilmaydi.
export async function runOnce({ slot = "", manual = false } = {}) {
  if (!aiEnabled()) {
    const message = "ANTHROPIC_API_KEY yo'q — AI o'chirilgan";
    AutopilotRuns.log({ slot, status: "skipped", message });
    return { status: "skipped", message };
  }
  const topic = pickTopic();
  if (!topic) {
    const message = "Navbat bo'sh — pending mavzu yo'q";
    AutopilotRuns.log({ slot, status: "skipped", message });
    return { status: "skipped", message };
  }

  const mode = getMode();
  const qgate = Settings.get("autopilot_qgate", "0") === "1";
  const qmin = clampScore(Settings.get("autopilot_qgate_min", "70"), 90);
  try {
    const gen = await generateForTopic(topic, { qgate, qmin });
    const a = gen.article;
    const qscore = gen.score; // null yoki 0–100

    // Dedup: shu sarlavhali maqola allaqachon bormi?
    if (a?.title && Articles.titleExists(a.title)) {
      const message = `Dublikat sarlavha: "${a.title}"`;
      AutopilotTopics.markFailed(topic.id, message);
      AutopilotRuns.log({ slot, topic_id: topic.id, status: "skipped", message });
      return { status: "skipped", message, topic };
    }

    // Sifat past + 'published' rejim → xavfsizlik uchun draft'ga tushiramiz.
    let effMode = mode;
    if (qgate && qscore !== null && qscore < qmin && mode === "published") effMode = "draft";
    const nowIso = new Date().toISOString();
    const published_at = effMode === "draft" ? null : nowIso;

    const faqs = Array.isArray(a.faqs)
      ? a.faqs
          .map((f) => ({ question: String(f.question || "").slice(0, 300), answer: cleanHtml(f.answer || "") }))
          .filter((f) => f.question)
          .slice(0, 30)
      : [];
    const tags = Array.isArray(a.tags) ? a.tags.map((t) => String(t || "").slice(0, 40)).filter(Boolean) : [];

    const created = Articles.insert({
      title: String(a.title || topic.topic).slice(0, 200),
      slug: uniqueSlug(a.slug || a.title || topic.topic),
      excerpt: String(a.excerpt || "").slice(0, 400),
      content: cleanHtml(a.content || ""),      // MUHIM: insert sanitize qilmaydi
      category: String(a.category || topic.category || "").slice(0, 80),
      author: "Digital CFO",
      status: effMode,
      published_at,
      seo_title: String(a.seo_title || "").slice(0, 200),
      seo_description: String(a.seo_description || "").slice(0, 320),
      focus_keyword: String(a.focus_keyword || topic.keyword || "").slice(0, 120),
      cover_alt: String(a.cover_alt || "").slice(0, 300),
      cover_caption: String(a.cover_caption || "").slice(0, 300),
      tags,
      faqs,
    });

    if (qscore !== null) Articles.setQuality(created.id, qscore);
    AutopilotTopics.markDone(topic.id, created.id);
    const scoreTxt = qscore !== null ? `, sifat ${qscore}/100` : "";
    const message = `"${created.title}" (${effMode}${scoreTxt})`;
    AutopilotRuns.log({ slot, topic_id: topic.id, article_id: created.id, status: "ok", message });
    console.log(`🤖 Avtopilot maqola yaratdi: ${message}`);

    // Telegram avto-post (bepul rejim) — faqat darhol jonli chiqqanda; hech qachon throw qilmaydi.
    if (effMode === "published") await autoPostArticleTelegram(created);

    // Ixtiyoriy: social paketni ham yaratamiz (best-effort — maqolani buzmaydi).
    if (Settings.get("autopilot_social", "0") === "1") {
      try {
        const contentText = String(created.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000);
        const social = await generateSocialPackage({
          title: created.title,
          excerpt: created.excerpt,
          keyword: created.focus_keyword,
          url: `https://digitalcfo.uz/blog/${created.slug}`,
          contentText,
        });
        Articles.setSocial(created.id, social);
        console.log("📣 Avtopilot social paket yaratdi:", created.slug);
      } catch (err) {
        console.warn("⚠️ Avtopilot social xatosi (maqola saqlangan):", err.message);
      }
    }

    return { status: "ok", message, article: created, topic, imagePrompt: a.featured_image_prompt || "" };
  } catch (err) {
    const message = err.message || "Generatsiya xatosi";
    AutopilotTopics.markFailed(topic.id, message);
    AutopilotRuns.log({ slot, topic_id: topic.id, status: "error", message });
    console.warn("⚠️ Avtopilot xatosi:", message);
    return { status: "error", message, topic };
  }
}

// Bir vaqtda faqat bitta generatsiya (manual + slot to'qnashmasin).
let _running = false;
export async function runGuarded(opts = {}) {
  if (_running) return { status: "skipped", message: "Boshqa generatsiya davom etyapti" };
  _running = true;
  try {
    return await runOnce(opts);
  } finally {
    _running = false;
  }
}

// Admin status paneli uchun.
export function autopilotStatus() {
  return {
    aiEnabled: aiEnabled(),
    enabled: Settings.get("autopilot_enabled", "0") === "1",
    active: autopilotEnabled(), // enabled && aiEnabled — haqiqatan ishlaydimi
    mode: getMode(),
    social: Settings.get("autopilot_social", "0") === "1",
    telegram: Settings.get("autopilot_telegram", "0") === "1",
    telegramReady: telegramReady(),
    qgate: Settings.get("autopilot_qgate", "0") === "1",
    qgateMin: clampScore(Settings.get("autopilot_qgate_min", "70"), 90),
    slots: SLOTS,
    timezone: "Asia/Tashkent",
    nextSlot: nextSlotLabel(),
    running: _running,
    lastRun: Settings.get("autopilot_last_run", ""),
    queue: AutopilotTopics.counts(),
    runs: AutopilotRuns.list(15),
  };
}

// Sozlamalarni o'rnatish (validatsiya bilan).
export function setAutopilotSettings({ enabled, mode, social, qgate, qgateMin, telegram }) {
  if (enabled !== undefined) Settings.set("autopilot_enabled", enabled ? "1" : "0");
  if (mode !== undefined && VALID_MODES.includes(mode)) Settings.set("autopilot_mode", mode);
  if (social !== undefined) Settings.set("autopilot_social", social ? "1" : "0");
  if (telegram !== undefined) Settings.set("autopilot_telegram", telegram ? "1" : "0");
  if (qgate !== undefined) Settings.set("autopilot_qgate", qgate ? "1" : "0");
  if (qgateMin !== undefined) Settings.set("autopilot_qgate_min", String(clampScore(qgateMin, 90)));
  return autopilotStatus();
}

// Boshlang'ich mavzularni navbatga yuklaydi (faqat yo'qlarini).
export function seedStarterTopics() {
  const existing = new Set(AutopilotTopics.list().map((t) => t.topic.toLowerCase()));
  let added = 0;
  for (const t of STARTER_TOPICS) {
    if (!existing.has(t.topic.toLowerCase())) {
      AutopilotTopics.add(t);
      added++;
    }
  }
  return added;
}

// Scheduler — har daqiqada slotlarni tekshiradi.
export function startAutopilot() {
  const tick = async () => {
    try {
      if (!autopilotEnabled()) return;
      const { date, minutes } = tashkentNow();
      for (const slot of SLOTS) {
        const [h, m] = slot.split(":").map(Number);
        const start = h * 60 + m;
        if (minutes >= start && minutes < start + SLOT_WINDOW_MIN) {
          const key = `${date} ${slot}`;
          if (Settings.get("autopilot_last_run", "") !== key) {
            // Guard'ni ishga tushirishdan OLDIN yozamiz — takroriy chaqiruvni oldini oladi.
            Settings.set("autopilot_last_run", key);
            await runGuarded({ slot });
          }
          break;
        }
      }
    } catch (err) {
      console.warn("⚠️ Avtopilot scheduler xatosi:", err.message);
    }
  };
  setInterval(tick, 60 * 1000);
  console.log("🚀 Avtopilot scheduler tayyor (yoqilganda slotlarda ishlaydi)");
}
