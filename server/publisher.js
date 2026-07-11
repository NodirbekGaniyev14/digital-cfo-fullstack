// Social publisher — DCOS Faza 3b: maqolaning social paketini tashqi platformalarga joylash.
//
// Arxitektura: har platforma "adapter" (key, label, enabled(), post()). Telegram adapteri
// to'liq ishlaydi (mavjud bot bilan). Boshqalari — stub: OAuth kaliti kelmaguncha enabled=false.
//
// Xavfsizlik: hech qanday kredensial kodda yo'q — hammasi .env dan. Adapter kaliti bo'lmasa
// jimgina o'chiq. Dublikat post oldini olinadi (SocialPosts.exists).

import { Articles, SocialPosts, Settings } from "./db.js";

const SITE = "https://digitalcfo.uz";

// --- Telegram adapteri (to'liq ishlaydi) ---
const telegram = {
  key: "telegram",
  label: "Telegram",
  hint: "TELEGRAM_BOT_TOKEN + TELEGRAM_CHANNEL_ID (bot kanalда admin bo'lishi kerak)",
  enabled: () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHANNEL_ID),
  async post(article, social) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHANNEL_ID;
    const body = String(social?.telegram || social?.excerpt || article.title || "").trim();
    const url = `${SITE}/blog/${article.slug}`;
    const tags = social?.hashtags?.instagram || social?.hashtags?.linkedin || [];
    const tagLine = Array.isArray(tags) && tags.length
      ? "\n\n" + tags.slice(0, 6).map((h) => (h.startsWith("#") ? h : "#" + h)).join(" ")
      : "";
    // parse_mode YO'Q — ixtiyoriy kontent Markdown entity xatosini bermasin.
    const text = `${body}\n\n👉 ${url}${tagLine}`.slice(0, 4000);
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) throw new Error(data?.description || `Telegram xatosi (${res.status})`);
    return { message_id: data.result?.message_id };
  },
};

// --- OAuth talab qiluvchi platformalar (stub — kredensiallar kelgach ulanadi) ---
function stub(key, label, hint) {
  return {
    key,
    label,
    hint,
    enabled: () => false,
    async post() {
      throw new Error(`${label} hali ulanmagan (${hint})`);
    },
  };
}

const ADAPTERS = [
  telegram,
  stub("linkedin", "LinkedIn", "OAuth app + w_member_social token"),
  stub("facebook", "Facebook", "Meta app + Page access token"),
  stub("instagram", "Instagram", "Meta app + IG business token"),
  stub("x", "X (Twitter)", "API v2 (pullik tier) + OAuth"),
  stub("threads", "Threads", "Meta Threads API + OAuth"),
  stub("youtube", "YouTube", "Google OAuth + YouTube Data API"),
];
const BY_KEY = Object.fromEntries(ADAPTERS.map((a) => [a.key, a]));

export function publisherStatus() {
  return {
    adapters: ADAPTERS.map((a) => ({ key: a.key, label: a.label, enabled: a.enabled(), hint: a.hint })),
    anyEnabled: ADAPTERS.some((a) => a.enabled()),
  };
}

export function telegramReady() {
  return telegram.enabled();
}

/**
 * Telegram avto-post — BEPUL oddiy rejim (AI chaqirilmaydi, xarajat 0).
 * Maqola chop etilganda kanalga sarlavha + qisqacha + havola yuboriladi.
 * Toggle: settings.autopilot_telegram ('0' standart — o'chiq).
 * Dublikat oldini olinadi (SocialPosts.exists) — qo'lda joylangan bo'lsa ham qayta yubormaydi.
 * Hech qachon throw qilmaydi — chaqiruvchini buzmaydi.
 */
export async function autoPostArticleTelegram(article) {
  try {
    if (Settings.get("autopilot_telegram", "0") !== "1") return { status: "off" };
    if (!telegram.enabled()) return { status: "skipped", message: "Telegram sozlanmagan" };
    if (!article || article.status !== "published") return { status: "skipped", message: "published emas" };
    if (SocialPosts.exists(article.id, "telegram")) return { status: "skipped", message: "allaqachon joylangan" };

    // Oddiy matn — maqolada allaqachon bor ma'lumotdan (adapter havolani o'zi qo'shadi).
    const simple = {
      telegram: [`📊 ${article.title}`, String(article.excerpt || "").trim()].filter(Boolean).join("\n\n"),
    };
    const r = await telegram.post(article, simple);
    SocialPosts.log({ article_id: article.id, platform: "telegram", status: "ok", message: JSON.stringify(r || {}) });
    console.log("📣 Telegram avto-post (bepul):", article.slug);
    return { status: "ok" };
  } catch (err) {
    try {
      SocialPosts.log({ article_id: article?.id, platform: "telegram", status: "error", message: err.message });
    } catch {}
    console.warn("⚠️ Telegram avto-post xatosi:", err.message);
    return { status: "error", message: err.message };
  }
}

/**
 * Maqolaning social paketini platformalarga joylaydi.
 * @param {number} articleId
 * @param {{platforms?: string[], force?: boolean}} opts platforms yo'q bo'lsa — barcha yoqilganlar.
 */
export async function publishArticleSocial(articleId, { platforms = null, force = false } = {}) {
  const article = Articles.getById(articleId);
  if (!article) throw new Error("Maqola topilmadi");
  const social = Articles.getSocial(articleId);
  if (!social) throw new Error("Avval social paket yarating");

  const chosen = platforms && platforms.length
    ? platforms.map((k) => BY_KEY[k]).filter(Boolean)
    : ADAPTERS;
  const targets = chosen.filter((a) => a.enabled());
  if (!targets.length) return { results: [], message: "Hech qaysi platforma yoqilmagan" };

  const results = [];
  for (const a of targets) {
    if (!force && SocialPosts.exists(articleId, a.key)) {
      results.push({ platform: a.key, status: "skipped", message: "allaqachon joylangan" });
      continue;
    }
    try {
      const r = await a.post(article, social);
      SocialPosts.log({ article_id: articleId, platform: a.key, status: "ok", message: JSON.stringify(r || {}) });
      results.push({ platform: a.key, status: "ok" });
    } catch (err) {
      SocialPosts.log({ article_id: articleId, platform: a.key, status: "error", message: err.message });
      results.push({ platform: a.key, status: "error", message: err.message });
      console.warn(`⚠️ Social post xatosi (${a.key}):`, err.message);
    }
  }
  return { results };
}
