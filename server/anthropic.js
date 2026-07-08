// Anthropic (Claude) klienti — /admin AI kontent generatori uchun.
//
// DCOS system prompt'ni (server/prompts/dcos.md) yuklaydi va uni har chaqiruvda
// system sifatida yuboradi (prompt caching bilan — 68KB promptni qayta hisoblamaslik
// uchun). Strukturaviy chiqish "tool use" orqali olinadi: model bizning DB
// maydonlariga aniq mos JSON qaytaradi.
//
// Tashqi paket YO'Q — Node'ning global fetch'idan foydalanadi (Node 20+, bu loyihada
// better-sqlite3 ^12 talab qiladi). ANTHROPIC_API_KEY bo'lmasa — jimgina o'chadi.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DCOS_PATH = path.join(__dirname, "prompts", "dcos.md");

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-5";
const MAX_TOKENS = 16000;
const TIMEOUT_MS = 180000; // 3 daqiqa — uzun maqola generatsiyasi sekin bo'lishi mumkin

// DCOS system prompt'ni bir marta o'qib keshlaymiz.
let _systemPrompt = null;
function loadSystemPrompt() {
  if (_systemPrompt !== null) return _systemPrompt;
  try {
    _systemPrompt = fs.readFileSync(DCOS_PATH, "utf8");
  } catch (err) {
    console.warn("⚠️ DCOS system prompt topilmadi (prompts/dcos.md):", err.message);
    _systemPrompt = "You are the Senior Financial Content Strategist of DigitalCFO.uz. Write professional, SEO-optimized financial articles in Uzbek (Latin).";
  }
  return _systemPrompt;
}

export function aiEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Tiptap editor + server sanitizatsiyasi qo'llab-quvvatlaydigan HTML teglari.
// Model AYNAN shu to'plamdan foydalanishi kerak — aks holda content yo'qoladi.
const ALLOWED_HTML = "<h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a href>, <blockquote>, <table>, <thead>, <tbody>, <tr>, <th>, <td>";

// Strukturaviy chiqish uchun tool sxemasi — bevosita CMS maydonlariga mos keladi.
const ARTICLE_TOOL = {
  name: "create_article",
  description:
    "Tayyor blog maqolasini DigitalCFO CMS uchun tuzilgan maydonlarda qaytaradi. " +
    "Barcha matn o'zbek tilida (lotin). Faqat shu tool orqali javob ber.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Maqola sarlavhasi (H1). Aniq, ~60 belgigacha." },
      slug: { type: "string", description: "URL slug: kichik harf, lotin, chiziqcha bilan. Masalan: pul-oqimi-tahlili" },
      excerpt: { type: "string", description: "1–2 jumlalik qisqa tavsif (ro'yxatda ko'rinadi)." },
      content: {
        type: "string",
        description:
          "Maqolaning to'liq matni HTML formatida. FAQAT shu teglar: " + ALLOWED_HTML + ". " +
          "H1 ISHLATMA (sarlavha alohida). Struktura: kirish, ta'rif, nega muhim, tushuntirish, " +
          "amaliy misol (real raqamlar), qadam-baqadam, taqqoslash jadvali, keng tarqalgan xatolar, " +
          "eng yaxshi amaliyotlar, xulosa. Har paragraf ≤4 jumla. Kamida 1500 so'z.",
      },
      category: { type: "string", description: "Bitta kategoriya nomi (masalan: Pul oqimi, Likvidlik, IFRS, CFO)." },
      tags: { type: "array", items: { type: "string" }, description: "3–7 ta teg." },
      seo_title: { type: "string", description: "SEO sarlavha, ≤60 belgi, fokus kalit so'z bilan." },
      seo_description: { type: "string", description: "Meta tavsif, 140–160 belgi, fokus kalit so'z bilan." },
      focus_keyword: { type: "string", description: "Asosiy (fokus) kalit so'z." },
      cover_alt: { type: "string", description: "Muqova rasmi uchun ALT matn (≤125 belgi), SEO'ga mos." },
      cover_caption: { type: "string", description: "Muqova rasmi uchun qisqa izoh (caption)." },
      faqs: {
        type: "array",
        description: "5–8 ta savol-javob (Google People Also Ask uslubida). Har javob 40–80 so'z.",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
          },
          required: ["question", "answer"],
        },
      },
      featured_image_prompt: {
        type: "string",
        description:
          "Muqova rasmi uchun ingliz tilidagi generatsiya prompti (professional, korporativ, " +
          "moliyaviy, ko'k palitra, 16:9, matnsiz). CMS'ga saqlanmaydi — foydalanuvchiga tavsiya.",
      },
    },
    required: ["title", "slug", "excerpt", "content", "seo_title", "seo_description", "focus_keyword", "faqs"],
  },
};

// Maqola uzunligi bo'yicha ko'rsatma.
function lengthHint(length) {
  if (length === "pillar") return "Bu PILLAR (asos) maqola — chuqur va keng, 3500–4500 so'z.";
  if (length === "short") return "Ixcham maqola — 1200–1800 so'z, lekin baribir to'liq va qiymatli.";
  return "Standart maqola — 2000–2800 so'z.";
}

// Claude Messages API'ni tool bilan chaqiradi va tool_use chiqishini qaytaradi.
// generateArticle va generateSocialPackage shu helperдан foydalanadi.
async function _callTool({ tool, userText, maxTokens = MAX_TOKENS }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY sozlanmagan");
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  const body = {
    model,
    max_tokens: maxTokens,
    // System — DCOS prompt (prompt caching bilan; har chaqiruvda bir xil bo'lgani uchun keshlanadi).
    system: [{ type: "text", text: loadSystemPrompt(), cache_control: { type: "ephemeral" } }],
    tools: [tool],
    tool_choice: { type: "tool", name: tool.name },
    messages: [{ role: "user", content: userText }],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw new Error("AI javob bermadi (timeout). Qayta urinib ko'ring.");
    throw new Error("AI serveriga ulanib bo'lmadi: " + err.message);
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error?.message || `Anthropic API xatosi (${res.status})`);
  }
  const block = Array.isArray(data?.content)
    ? data.content.find((b) => b.type === "tool_use" && b.name === tool.name)
    : null;
  if (!block || !block.input) throw new Error("AI kutilgan formatda javob qaytarmadi");
  return block.input;
}

/**
 * DCOS qoidalari asosida bitta maqola generatsiya qiladi.
 * @returns {Promise<object>} create_article tool chiqishi (CMS maydonlari).
 */
export async function generateArticle({ topic, keyword = "", category = "", length = "standard", notes = "" } = {}) {
  if (!topic || !topic.trim()) throw new Error("Mavzu (topic) majburiy");
  const task = [
    `MAVZU: ${topic}`,
    keyword ? `ASOSIY KALIT SO'Z: ${keyword}` : "",
    category ? `KATEGORIYA: ${category}` : "",
    notes ? `QO'SHIMCHA KO'RSATMALAR: ${notes}` : "",
    "",
    lengthHint(length),
    "",
    "Yuqoridagi DCOS tizim qoidalariga to'liq amal qilib, shu mavzuda DigitalCFO.uz uchun",
    "bitta yuqori sifatli, SEO'ga optimallashtirilgan maqola yoz. Butun matn o'zbek tilida (lotin).",
    "Faqat `create_article` tool orqali javob qaytar — boshqa hech qanday matn yozma.",
    `content maydonida FAQAT quyidagi HTML teglaridan foydalan: ${ALLOWED_HTML}.`,
  ]
    .filter(Boolean)
    .join("\n");
  return _callTool({ tool: ARTICLE_TOOL, userText: task, maxTokens: MAX_TOKENS });
}

// --- Social paket (DCOS Part 7 — Faza 3) --------------------------------------
const SOCIAL_TOOL = {
  name: "create_social_package",
  description:
    "Bitta maqola uchun barcha platformalar bo'yicha social media paketini qaytaradi. " +
    "Barcha matn o'zbek tilida (lotin), har platforma o'z uslubida. Faqat shu tool orqali javob ber.",
  input_schema: {
    type: "object",
    properties: {
      linkedin_post: { type: "string", description: "LinkedIn posti (800–1500 belgi): hook, biznes muammo, moliyaviy insight, amaliy maslahat, CTA." },
      linkedin_carousel: { type: "array", items: { type: "string" }, description: "10 slayd matni (har biri ≤30 so'z): 1-sarlavha, 2–8 ta'lim, 9-xulosa, 10-CTA." },
      telegram: { type: "string", description: "Telegram posti (150–400 so'z): hook, xulosa, asosiy tezislar, CTA." },
      facebook: { type: "string", description: "Facebook posti (300–600 belgi): sodda, ta'limiy, 1 savol + 1 xulosa + 1 CTA." },
      instagram_caption: { type: "string", description: "Instagram caption (≤2200 belgi), qisqa paragraflar." },
      instagram_carousel: { type: "array", items: { type: "string" }, description: "≤10 slayd, har biri bitta g'oya, minimal matn." },
      threads: { type: "string", description: "Threads posti (≤500 belgi), suhbat uslubida." },
      x_thread: { type: "array", items: { type: "string" }, description: "X (Twitter) thread: ≤10 tvit, har biri ≤280 belgi. 1-hook, oxirgi-CTA." },
      youtube_community: { type: "string", description: "YouTube community posti — bitta jalb qiluvchi savol + qisqa xulosa." },
      email: {
        type: "object",
        properties: { subject: { type: "string" }, preview: { type: "string" }, body: { type: "string" } },
        required: ["subject", "body"],
        description: "Email newsletter (body 300–500 so'z).",
      },
      reels_script: { type: "string", description: "30–60s vertikal video ssenariysi: hook, muammo, yechim, CTA." },
      shorts_script: { type: "string", description: "45–60s YouTube Shorts ssenariysi: savol, tushuntirish, misol, CTA." },
      podcast: {
        type: "object",
        properties: { title: { type: "string" }, points: { type: "array", items: { type: "string" } }, duration: { type: "string" } },
        description: "Podkast epizodi g'oyasi.",
      },
      hashtags: {
        type: "object",
        properties: {
          linkedin: { type: "array", items: { type: "string" } },
          instagram: { type: "array", items: { type: "string" } },
          x: { type: "array", items: { type: "string" } },
          facebook: { type: "array", items: { type: "string" } },
        },
        description: "Platforma bo'yicha hashtaglar.",
      },
    },
    required: ["linkedin_post", "telegram", "facebook", "instagram_caption", "x_thread", "reels_script"],
  },
};

/**
 * Berilgan maqola uchun DCOS Part 7 asosida social media paketini generatsiya qiladi.
 * @returns {Promise<object>} create_social_package tool chiqishi.
 */
export async function generateSocialPackage({ title, excerpt = "", keyword = "", url = "", contentText = "" } = {}) {
  if (!title || !title.trim()) throw new Error("Maqola sarlavhasi majburiy");
  const task = [
    "Quyidagi DigitalCFO.uz maqolasi uchun DCOS Part 7 (Social Distribution) qoidalariga",
    "to'liq amal qilib, BARCHA platformalar bo'yicha social media paketini yarat.",
    "Matnlar o'zbek tilida (lotin), har platforma o'z uslubida, dublikatsiz.",
    "Faqat `create_social_package` tool orqali javob qaytar.",
    "",
    `SARLAVHA: ${title}`,
    keyword ? `KALIT SO'Z: ${keyword}` : "",
    url ? `MAQOLA HAVOLASI: ${url}` : "",
    excerpt ? `QISQA TAVSIF: ${excerpt}` : "",
    "",
    "MAQOLA MATNI (kontekst uchun, qisqartirilgan):",
    contentText || excerpt || title,
  ]
    .filter(Boolean)
    .join("\n");
  return _callTool({ tool: SOCIAL_TOOL, userText: task, maxTokens: 8000 });
}

// --- Sifat bahosi (DCOS Part 9 — Quality Gate) --------------------------------
const SCORE_KEYS = [
  "content_quality", "seo", "originality", "readability", "financial_accuracy",
  "eeat", "business_value", "internal_linking", "social_assets", "brand_voice",
];
const SCORE_TOOL = {
  name: "score_article",
  description:
    "Maqolani DCOS Part 9 sifat mezonlari bo'yicha qat'iy baholaydi. Har mezon 0–10 (butun son). " +
    "Faqat shu tool orqali javob ber.",
  input_schema: {
    type: "object",
    properties: {
      content_quality: { type: "integer", description: "Kontent sifati (0–10)" },
      seo: { type: "integer", description: "SEO (0–10)" },
      originality: { type: "integer", description: "Original­lik (0–10)" },
      readability: { type: "integer", description: "O'qish qulayligi (0–10)" },
      financial_accuracy: { type: "integer", description: "Moliyaviy aniqlik (0–10)" },
      eeat: { type: "integer", description: "EEAT (0–10)" },
      business_value: { type: "integer", description: "Biznes qiymati (0–10)" },
      internal_linking: { type: "integer", description: "Ichki bog'lanish SALOHIYATI (0–10): matn tegishli moliyaviy mavzularga tabiiy havola qo'yishga qanchalik mos tuzilgan. Havolalar hali qo'yilmagan bo'lsa ham, tuzilishni bahola — yo'qligi uchun jazolama." },
      social_assets: { type: "integer", description: "Social ulashish SALOHIYATI (0–10): kontent qanchalik ulashishга arziydi/moslashuvchan (hook, ro'yxatlar, iqtiboslar, sarlavhalar). Social postlar hali biriktirilmagan bo'lsa ham, potentsialни bahola." },
      brand_voice: { type: "integer", description: "Brend ovozi (0–10)" },
      summary: { type: "string", description: "Qisqa umumiy baho (1–2 jumla, o'zbekcha)." },
      weaknesses: { type: "array", items: { type: "string" }, description: "Zaif tomonlar (bo'lsa)." },
    },
    required: SCORE_KEYS,
  },
};

/**
 * Maqolani baholaydi. total = 10 mezon yig'indisi (0–100).
 * @returns {Promise<{scores:object,total:number,summary:string,weaknesses:string[]}>}
 */
export async function scoreArticle({ title, contentText = "", keyword = "" } = {}) {
  if (!title || !title.trim()) throw new Error("Maqola sarlavhasi majburiy");
  const task = [
    "Quyidagi DigitalCFO.uz maqolasini DCOS Part 9 sifat mezonlari bo'yicha QAT'IY bahola.",
    "Har mezon 0–10 (butun son). Ortiqcha yumshoq baho berma. Faqat `score_article` tool orqali javob qaytar.",
    "",
    "MUHIM: `internal_linking` va `social_assets` mezonlarini SALOHIYAT bo'yicha bahola —",
    "ichki havolalar va social postlar keyingi bosqichlarda qo'shiladi. Ular hozircha",
    "yo'qligi uchun jazolama; matnning shu qadamlarга qanchalik mosligini o'lchang.",
    "",
    `SARLAVHA: ${title}`,
    keyword ? `KALIT SO'Z: ${keyword}` : "",
    "",
    "MAQOLA MATNI:",
    contentText || title,
  ]
    .filter(Boolean)
    .join("\n");
  const r = await _callTool({ tool: SCORE_TOOL, userText: task, maxTokens: 1500 });
  const scores = {};
  let total = 0;
  for (const k of SCORE_KEYS) {
    const v = Math.max(0, Math.min(10, Math.round(Number(r[k]) || 0)));
    scores[k] = v;
    total += v;
  }
  return { scores, total, summary: r.summary || "", weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses : [] };
}
