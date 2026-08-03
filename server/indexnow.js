// IndexNow — maqola chop etilishi bilan qidiruv tizimlariga DARHOL xabar beradi.
//
// Nega muhim (GEO): ChatGPT Search javob berishdan oldin Bing indeksidan o'qiydi.
// Odatdagi kraul bir necha kun/hafta kutadi; IndexNow bilan URL bir necha
// daqiqada indeksга tushadi. api.indexnow.org bitta so'rovni barcha qatnashchi
// tizimlarga tarqatadi (Bing, Yandex, Seznam, Naver).
//
// Sozlash: server/.env ga INDEXNOW_KEY qo'shing (8-128 belgi, a-z A-Z 0-9 -).
// Kalit yo'q bo'lsa — jimgina o'chiq (publisher.js bilan bir xil xulq).
// Kalit fayli avtomatik beriladi: https://digitalcfo.uz/<KEY>.txt (index.js dagi route).

import { SITE_URL } from "./ssr.js";

const ENDPOINT = "https://api.indexnow.org/indexnow";

export function indexNowKey() {
  return (process.env.INDEXNOW_KEY || "").trim();
}

export function indexNowEnabled() {
  return Boolean(indexNowKey());
}

export function indexNowStatus() {
  const key = indexNowKey();
  return {
    enabled: Boolean(key),
    keyLocation: key ? `${SITE_URL}/${key}.txt` : null,
    endpoint: ENDPOINT,
    hint: "server/.env ga INDEXNOW_KEY qo'shing (8-128 belgi). Kalit fayli avtomatik beriladi.",
  };
}

/**
 * URL'lar ro'yxatini IndexNow'ga yuboradi.
 * HECH QACHON throw qilmaydi — chop etish oqimini buzmasligi shart.
 * @returns {Promise<{ok: boolean, status?: number, count: number, skipped?: string}>}
 */
export async function submitUrls(urls) {
  const key = indexNowKey();
  if (!key) return { ok: false, count: 0, skipped: "INDEXNOW_KEY yo'q" };

  const host = new URL(SITE_URL).host;
  // Faqat o'z domenimizdagi URL'lar (IndexNow begona hostni 422 bilan rad etadi).
  const urlList = [...new Set((urls || []).filter(Boolean))].filter((u) => {
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });
  if (!urlList.length) return { ok: false, count: 0, skipped: "URL yo'q" };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urlList.slice(0, 10000), // protokol chegarasi
      }),
    });
    // 200 = qabul qilindi, 202 = qabul qilindi (kalit tekshirilmoqda).
    const ok = res.status === 200 || res.status === 202;
    if (ok) {
      console.log(`🔎 IndexNow: ${urlList.length} ta URL yuborildi (${res.status})`);
    } else {
      // 403 = kalit noto'g'ri, 422 = URL/host mos emas, 429 = juda ko'p so'rov
      console.warn(`⚠️ IndexNow javobi: ${res.status} (${urlList.length} ta URL)`);
    }
    return { ok, status: res.status, count: urlList.length };
  } catch (err) {
    console.warn("⚠️ IndexNow yuborilmadi:", err.message);
    return { ok: false, count: 0, skipped: err.message };
  }
}

/**
 * Bitta maqola chop etilganda: maqola URL'i + ro'yxat sahifasi (u ham o'zgardi).
 */
export async function submitArticle(article) {
  if (!article?.slug) return { ok: false, count: 0, skipped: "slug yo'q" };
  return submitUrls([`${SITE_URL}/blog/${article.slug}`, `${SITE_URL}/blog`]);
}

/**
 * Bir nechta maqola bir vaqtda chop etilganda (scheduler) — bitta so'rovda.
 */
export async function submitArticles(list) {
  const slugs = (list || []).map((a) => a?.slug).filter(Boolean);
  if (!slugs.length) return { ok: false, count: 0, skipped: "maqola yo'q" };
  return submitUrls([...slugs.map((s) => `${SITE_URL}/blog/${s}`), `${SITE_URL}/blog`]);
}

/**
 * Barcha chop etilgan maqolalar + asosiy sahifalar — birinchi seeding uchun.
 */
export async function submitAll(publishedList) {
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/blog`,
    ...(publishedList || []).map((a) => `${SITE_URL}/blog/${a.slug}`),
  ];
  return submitUrls(urls);
}
