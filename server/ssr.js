// Server-side render (SEO) — DB'dagi maqolalarni to'liq HTML sifatida beradi.
// Build'dagi index.html shablonini olib, unga to'g'ri <title>, meta, canonical,
// Open Graph va JSON-LD hamda #root ichiga matnni joylaydi. Robotlar JS'siz ham
// to'liq maqolani ko'radi; React yuklanganda #root'ni almashtiradi.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, "..", "client", "dist", "index.html");
export const SITE_URL = (process.env.SITE_URL || "https://digitalcfo.uz").replace(/\/$/, "");

let _tpl = null;
function template() {
  if (_tpl === null) _tpl = fs.readFileSync(TEMPLATE_PATH, "utf8");
  return _tpl;
}
export function hasTemplate() {
  return fs.existsSync(TEMPLATE_PATH);
}

// Birlashtirilgan (kannibalizatsiya) maqolalar: eski slug -> qoladigan slug.
// Ikki maqola bir xil so'rovga ("moliyaviy tahlil nima") raqobatlashardi —
// Google ikkalasini ham pastga tushiradi. Eski URL 301 bilan yo'naltiriladi
// va sitemap'dan chiqariladi (301'li URL sitemap'da turmasligi kerak).
export const MERGED_SLUGS = {
  "moliyaviy-tahlil-nima": "moliyaviy-tahlil-nima-asosiy-tushunchalar",
};

// Landing sahifaning til variantlari (maqolalar faqat o'zbekchada).
export const HOME_PATHS = { uz: "/", ru: "/ru" };

const escAttr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escHtml = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

const MONTHS_UZ = ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"];
function formatDateUz(iso) {
  const d = new Date(iso);
  return `${d.getUTCDate()}-${MONTHS_UZ[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}
export function timeAgoUz(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "bugun";
  if (days === 1) return "kecha";
  if (days < 7) return `${days} kun oldin`;
  if (days < 30) return `${Math.floor(days / 7)} hafta oldin`;
  if (days < 365) return `${Math.floor(days / 30)} oy oldin`;
  return `${Math.floor(days / 365)} yil oldin`;
}

// Kategoriya ikonka foni (client bilan bir xil palitra).
const COLORS = {
  blue: ["#3b82f6", "#2563eb"], sky: ["#06b6d4", "#3b82f6"], red: ["#ef4444", "#f97316"],
  green: ["#10b981", "#14b8a6"], violet: ["#6366f1", "#8b5cf6"], amber: ["#f59e0b", "#ef4444"],
  teal: ["#14b8a6", "#0ea5e9"], slate: ["#64748b", "#334155"],
};
function coverStyle(color) {
  const [from, to] = COLORS[color] || COLORS.blue;
  return `background:linear-gradient(135deg,${from},${to})`;
}

const ORG = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: "Digital CFO",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/og-image.svg`,
};
const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Digital CFO",
  inLanguage: "uz",
  publisher: { "@id": `${SITE_URL}/#org` },
};

function buildPage({ title, description, canonical, ogType, pageJsonLd, rootHtml, robots, image, lang, alternates }) {
  let html = template();
  // Brend allaqachon sarlavhada bo'lsa qayta qo'shmaymiz. Solishtirishda bo'sh
  // joy va registrni tashlaymiz: admin "… | DigitalCFO" deb yozsa ham
  // "… | DigitalCFO — Digital CFO" kabi ikkilanish SERP'ga chiqmasin.
  const norm = (s) => s.toLowerCase().replace(/\s+/g, "");
  const fullTitle = norm(title).includes("digitalcfo") ? title : `${title} — Digital CFO`;
  const rep = (re, val, label) => {
    if (!re.test(html)) throw new Error(`ssr: shablonda topilmadi — ${label}`);
    html = html.replace(re, () => val);
  };
  rep(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(fullTitle)}</title>`, "title");
  rep(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escAttr(description)}" />`, "description");
  // Qidiruv tizimi tasdiqlash teglari (.env orqali — build/commit kerak emas,
  // faqat `pm2 restart`). Yandex.Webmaster / Google Search Console "meta tag"
  // usulini tanlaganda content="..." qiymatini shu yerga qo'yish yetarli.
  const verifyTags = [
    process.env.YANDEX_VERIFICATION &&
      `\n    <meta name="yandex-verification" content="${escAttr(process.env.YANDEX_VERIFICATION)}" />`,
    process.env.GOOGLE_SITE_VERIFICATION &&
      `\n    <meta name="google-site-verification" content="${escAttr(process.env.GOOGLE_SITE_VERIFICATION)}" />`,
  ]
    .filter(Boolean)
    .join("");
  rep(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${robots || "index,follow"}" />${verifyTags}`, "robots");
  // hreflang — bir sahifaning til variantlari. Google qaysi tilni kimga
  // ko'rsatishni shundan biladi; x-default esa "boshqasi mos kelmasa" varianti.
  const altTags = (alternates || [])
    .map((a) => `\n    <link rel="alternate" hreflang="${a.lang}" href="${escAttr(a.href)}" />`)
    .join("");
  rep(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />${altTags}`, "canonical");
  if (lang && lang !== "uz") {
    html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
    html = html.replace(/<meta property="og:locale" content="[^"]*"/, `<meta property="og:locale" content="${lang === "ru" ? "ru_RU" : "en_US"}"`);
  }
  rep(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`, "og:url");
  rep(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escAttr(fullTitle)}" />`, "og:title");
  rep(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escAttr(description)}" />`, "og:description");
  rep(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${ogType}" />`, "og:type");
  if (image) {
    rep(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escAttr(image)}" />`, "og:image");
    rep(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${escAttr(image)}" />`, "twitter:image");
  }
  rep(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escAttr(fullTitle)}" />`, "twitter:title");
  rep(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${escAttr(description)}" />`, "twitter:description");
  rep(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${jsonLd({ "@context": "https://schema.org", "@graph": [ORG, WEBSITE] })}</script>\n    <script type="application/ld+json" id="ld-page">${jsonLd(pageJsonLd)}</script>`,
    "ld+json"
  );
  rep(/<div id="root">\s*<\/div>/, `<div id="root">${rootHtml}</div>`, "#root");
  return html;
}

const SHELL_HEADER = `<header style="max-width:820px;margin:0 auto;padding:20px 24px"><a href="/" style="font-weight:800;font-size:20px;color:#0f172a;text-decoration:none">Digital <span style="color:#3b82f6">CFO</span></a></header>`;
const SHELL_FOOTER = `<footer style="max-width:820px;margin:24px auto;padding:24px;color:#64748b;font-size:14px"><a href="/" style="color:#3b82f6">Bosh sahifa</a> · <a href="/blog" style="color:#3b82f6">Barcha maqolalar</a></footer>`;

// cover_image'ni mutlaq URL'ga aylantiradi (og:image / schema uchun).
function absUrl(u) {
  if (!u) return "";
  return u.startsWith("http") ? u : `${SITE_URL}${u}`;
}

// Maqola oxiri: botga CTA (kontent trafigi -> konversiya) + o'xshash maqolalar.
// React (Article.jsx) o'z versiyasini ko'rsatadi; bu blok robotlar va JS'siz
// foydalanuvchilar uchun — SSR ham xuddi shu yo'lni taklif qilsin.
const BOT_URL = "https://t.me/Moliyaviy_Tahlilchi_bot";

const CTA_COPY = {
  uz: {
    title: "Biznesingiz moliyaviy holatini 1 daqiqada tekshiring",
    text: "Balans (Shakl 1) va Moliyaviy natijalar (Shakl 2) faylini Telegram botga yuboring — 40+ KPI, risk diagnostikasi va amaliy tavsiyalar bilan tayyor PDF hisobot oling. Hozircha to'liq bepul.",
    btn: "Bepul tahlil qilish →",
  },
  ru: {
    title: "Проверьте финансовое состояние бизнеса за 1 минуту",
    text: "Отправьте Баланс (Форма 1) и Отчёт о финансовых результатах (Форма 2) в Telegram-бот — получите готовый PDF-отчёт с 40+ KPI, диагностикой рисков и практическими рекомендациями. Пока полностью бесплатно.",
    btn: "Бесплатный анализ →",
  },
};

function ctaBlock(lang = "uz") {
  const c = CTA_COPY[lang] || CTA_COPY.uz;
  return (
    `<aside style="margin:36px 0;padding:24px;border-radius:16px;background:linear-gradient(135deg,#eff6ff,#ecfdf5);border:1px solid #bfdbfe">` +
    `<p style="font-weight:800;font-size:18px;color:#0f172a;margin:0 0 8px">${c.title}</p>` +
    `<p style="color:#475569;margin:0 0 14px">${c.text}</p>` +
    `<a href="${BOT_URL}" style="display:inline-block;background:#1d4ed8;color:#fff;font-weight:700;padding:10px 22px;border-radius:12px;text-decoration:none">${c.btn}</a>` +
    `</aside>`
  );
}

function relatedBlock(related) {
  if (!related || !related.length) return "";
  const items = related
    .map(
      (r) =>
        `<li style="margin-bottom:12px"><a href="/blog/${r.slug}" style="font-weight:700;color:#0f172a;text-decoration:none">${escHtml(r.title)}</a><br><span style="color:#64748b;font-size:13px">${escHtml(r.category || "")}</span></li>`
    )
    .join("");
  return (
    `<section style="margin-top:8px;border-top:1px solid #e2e8f0;padding-top:20px">` +
    `<h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:0 0 14px">O'xshash maqolalar</h2>` +
    `<ul style="list-style:none;padding:0;margin:0">${items}</ul></section>`
  );
}

// Bitta maqola sahifasi HTML'i. related — shu kategoriyadan 3 tagacha maqola.
export function renderArticle(a, related = []) {
  const canonical = a.canonical_url || `${SITE_URL}/blog/${a.slug}`;
  const title = a.seo_title || a.title;
  const description = a.seo_description || a.excerpt || a.title;
  const robots = `${a.robots_index === 0 ? "noindex" : "index"},${a.robots_follow === 0 ? "nofollow" : "follow"}`;
  const image = absUrl(a.cover_image) || `${SITE_URL}/og-image.svg`;

  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${canonical}#article`,
      headline: a.title,
      description: a.excerpt || description,
      inLanguage: "uz",
      datePublished: a.published_at || a.created_at,
      dateModified: a.updated_at || a.created_at,
      author: { "@type": a.author && a.author !== "Digital CFO" ? "Person" : "Organization", name: a.author || "Digital CFO" },
      publisher: ORG,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      articleSection: a.category,
      image,
      wordCount: String(a.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Bosh sahifa", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Maqolalar", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: a.title, item: canonical },
      ],
    },
  ];
  // FAQ Schema (agar maqolaga FAQ biriktirilgan bo'lsa).
  if (Array.isArray(a.faqs) && a.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: a.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  const pageJsonLd = { "@context": "https://schema.org", "@graph": graph };

  const cover = a.cover_image
    ? `<img src="${escAttr(a.cover_image)}" alt="${escAttr(a.cover_alt || a.title)}" style="width:100%;max-height:280px;object-fit:cover;border-radius:16px;margin:0 0 24px" />`
    : `<div style="height:200px;border-radius:16px;margin:0 0 24px;${coverStyle(a.icon_color)}"></div>`;
  const rootHtml =
    `${SHELL_HEADER}<main style="max-width:760px;margin:0 auto;padding:0 24px 40px">` +
    `<nav style="font-size:13px;color:#64748b;margin-bottom:14px"><a href="/" style="color:#64748b">Bosh sahifa</a> › <a href="/blog" style="color:#64748b">Maqolalar</a> › ${escHtml(a.category)}</nav>` +
    `<article class="article-prose"><h1 style="font-size:34px;font-weight:800;line-height:1.2;color:#0f172a;margin:0 0 10px">${escHtml(a.title)}</h1>` +
    `<p style="color:#64748b;font-size:14px;margin:0 0 20px">${escHtml(a.author || "Digital CFO")} · ${formatDateUz(a.published_at || a.created_at)} · ${timeAgoUz(a.published_at || a.created_at)}</p>` +
    `${cover}${a.content}</article>${ctaBlock()}${relatedBlock(related)}</main>${SHELL_FOOTER}`;

  return buildPage({
    title, description, canonical, robots, image,
    ogType: "article",
    pageJsonLd,
    rootHtml,
  });
}

// /blog ro'yxat sahifasi HTML'i.
export function renderList(list) {
  const canonical = `${SITE_URL}/blog`;
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#page`,
        name: "Maqolalar — Digital CFO",
        description: "Moliyaviy tahlil, likvidlik, rentabellik va risk bo'yicha amaliy maqolalar.",
        inLanguage: "uz",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ItemList",
        itemListElement: list.map((a, i) => ({
          "@type": "ListItem", position: i + 1, url: `${SITE_URL}/blog/${a.slug}`, name: a.title,
        })),
      },
    ],
  };
  const items = list
    .map(
      (a) =>
        `<li style="margin-bottom:18px"><span style="color:#64748b;font-size:13px">${timeAgoUz(a.published_at || a.created_at)} · ${escHtml(a.category)}</span><br><a href="/blog/${a.slug}" style="font-size:19px;font-weight:700;color:#0f172a;text-decoration:none">${escHtml(a.title)}</a><p style="color:#475569;margin:6px 0 0">${escHtml(a.excerpt)}</p></li>`
    )
    .join("");
  const rootHtml =
    `${SHELL_HEADER}<main style="max-width:820px;margin:0 auto;padding:0 24px 40px">` +
    `<h1 style="font-size:36px;font-weight:800;color:#0f172a">Moliyaviy tahlil bo'yicha maqolalar</h1>` +
    `<p style="color:#475569;font-size:17px;margin:10px 0 28px">Likvidlik, rentabellik, moliyaviy barqarorlik va bankrotlik xavfi bo'yicha amaliy qo'llanmalar.</p>` +
    `<ul style="list-style:none;padding:0">${items}</ul></main>${SHELL_FOOTER}`;

  return buildPage({
    title: "Maqolalar — moliyaviy tahlil bo'yicha qo'llanmalar",
    description: "Moliyaviy tahlil, likvidlik, rentabellik, Altman Z-Score va 1C hisobotlari bo'yicha amaliy maqolalar — Digital CFO ekspertlaridan.",
    canonical,
    ogType: "website",
    pageJsonLd,
    rootHtml,
  });
}

// Bosh sahifa SSR — Google JS'siz ham to'liq marketing matnini ko'rsin.
// (Avval #root bo'sh edi: robot 0 so'z ko'rardi.) Matn client i18n (uz) bilan
// mazmunan bir xil; React yuklangach #root'ni interaktiv versiya bilan almashtiradi.
// Bosh sahifa matni tillar bo'yicha. Maqolalar faqat o'zbekcha, shuning uchun
// ruscha versiya faqat landing (/ru) — hreflang orqali o'zbekchaga bog'langan.
const HOME_COPY = {
  uz: {
    title: "Moliyaviy tahlil onlayn — balans va 1C hisoboti | Digital CFO",
    description:
      "Balans (Shakl 1) va Moliyaviy natijalar (Shakl 2) faylini yuklang — likvidlik, rentabellik va 40+ KPI bo'yicha tayyor PDF tahlilni 1 daqiqada oling. Bepul.",
    h1: "AI yordamida moliyaviy tahlil va CFO darajasidagi hisobot",
    lead: "Balans (Shakl 1) va Moliyaviy natijalar (Shakl 2) faylingizni yuboring — Digital CFO ularni chuqur tahlil qilib, 40+ KPI, risk diagnostikasi va amaliy tavsiyalar bilan tayyor PDF hisobotni bir daqiqada qaytaradi.",
    h2how: "Qanday ishlaydi",
    how: [
      "<b>Faylni yuklang</b> — Excel (.xlsx/.xls) moliyaviy faylingizni yuboring.",
      "<b>Validatsiya</b> — tizim ma'lumotlarni avtomatik tekshiradi va tozalaydi.",
      "<b>KPI hisoblash</b> — barcha asosiy moliyaviy ko'rsatkichlar hisoblanadi.",
      "<b>AI tahlil</b> — kuchli AI holatni baholab, tavsiyalar tayyorlaydi.",
      "<b>PDF hisobot</b> — professional hisobotni yuklab olasiz.",
    ],
    h2what: "Nimalarni tahlil qilamiz",
    what: [
      "<b>Likvidlik va to'lov qobiliyati</b> — joriy, tezkor va mutlaq likvidlik, ishchi kapital.",
      "<b>Moliyaviy barqarorlik</b> — avtonomiya, qarz yuki, manyovrlik koeffitsientlari.",
      "<b>Rentabellik</b> — ROA, ROE, sof va yalpi foyda marjalari.",
      "<b>Ishbilarmonlik faolligi</b> — aktivlar, zaxiralar, debitorlik aylanuvchanligi, pul aylanish sikli.",
      "<b>O'sish dinamikasi</b> — tushum, foyda va kapital o'zgarishi.",
    ],
    h2report: "Hisobotda nimalar bor",
    report: [
      "Boshqaruv xulosasi (Executive Summary)",
      "Asosiy KPI ko'rsatkichlari jadvali",
      "Likvidlik va to'lov qobiliyati tahlili",
      "Rentabellik va foyda dinamikasi",
      "Risk diagnostikasi va baholash",
      "AI tavsiyalari va xulosalar",
    ],
    h2price: "Narx",
    price: "Hozirda barcha tahlillar <b>to'liq bepul</b>. Pullik tariflar joriy etilganda oldindan e'lon qilamiz.",
    h2faq: "Ko'p so'raladigan savollar",
    blogLink: "Moliyaviy tahlil bo'yicha maqolalar →",
    faqs: [
      { q: "Qaysi fayl formatlari qabul qilinadi?", a: "Tizim .xlsx va .xls formatdagi moliyaviy fayllarni qabul qiladi. Fayl avtomatik tekshiriladi va validatsiyadan o'tkaziladi." },
      { q: "Tahlil qancha vaqt oladi?", a: "Tahlilni atigi 1 daqiqada yetkazamiz — faylni yuborishingiz bilan hisobot tayyor bo'ladi." },
      { q: "Xizmat pullikmi?", a: "Hozirda barcha tahlillar to'liq bepul. Pullik tariflar joriy etilganda saytda va botda oldindan e'lon qilamiz." },
      { q: "Tahlil ishonchliligi qanchalik?", a: "Har bir hisobot tajribali mutaxassis nazoratidan o'tadi va natijalar benchmark ko'rsatkichlar bilan solishtirib tekshiriladi." },
      { q: "Hisobotni yuklab olsa bo'ladimi?", a: "Ha, har bir tahlil yakunida professional PDF hisobotni bir tugma bilan yuklab olishingiz mumkin." },
      { q: "Ma'lumotlarim xavfsizmi?", a: "Ma'lumotlaringiz himoyalangan (HTTPS) ulanish orqali uzatiladi, faqat tahlil maqsadida ishlatiladi va uchinchi shaxslarga berilmaydi." },
    ],
  },
  ru: {
    title: "Финансовый анализ онлайн — баланс и отчёты 1С | Digital CFO",
    description:
      "Загрузите Баланс (Форма 1) и Отчёт о финансовых результатах (Форма 2) — получите готовый PDF-анализ по ликвидности, рентабельности и 40+ KPI за 1 минуту. Бесплатно.",
    h1: "Финансовый анализ с помощью AI и отчёт уровня CFO",
    lead: "Отправьте файлы Баланса (Форма 1) и Отчёта о финансовых результатах (Форма 2) — Digital CFO проведёт глубокий анализ и вернёт готовый PDF-отчёт с 40+ KPI, диагностикой рисков и практическими рекомендациями за одну минуту.",
    h2how: "Как это работает",
    how: [
      "<b>Загрузите файл</b> — отправьте финансовый файл Excel (.xlsx/.xls).",
      "<b>Валидация</b> — система автоматически проверяет и очищает данные.",
      "<b>Расчёт KPI</b> — рассчитываются все основные финансовые показатели.",
      "<b>AI-анализ</b> — искусственный интеллект оценивает состояние и готовит рекомендации.",
      "<b>PDF-отчёт</b> — вы скачиваете профессиональный отчёт.",
    ],
    h2what: "Что мы анализируем",
    what: [
      "<b>Ликвидность и платёжеспособность</b> — текущая, быстрая и абсолютная ликвидность, оборотный капитал.",
      "<b>Финансовая устойчивость</b> — коэффициенты автономии, долговой нагрузки, манёвренности.",
      "<b>Рентабельность</b> — ROA, ROE, чистая и валовая маржа прибыли.",
      "<b>Деловая активность</b> — оборачиваемость активов, запасов, дебиторской задолженности, денежный цикл.",
      "<b>Динамика роста</b> — изменение выручки, прибыли и капитала.",
    ],
    h2report: "Что входит в отчёт",
    report: [
      "Управленческое резюме (Executive Summary)",
      "Таблица основных KPI",
      "Анализ ликвидности и платёжеспособности",
      "Рентабельность и динамика прибыли",
      "Диагностика и оценка рисков",
      "AI-рекомендации и выводы",
    ],
    h2price: "Стоимость",
    price: "Сейчас все анализы <b>полностью бесплатны</b>. О введении платных тарифов сообщим заранее.",
    h2faq: "Часто задаваемые вопросы",
    blogLink: "Статьи о финансовом анализе (на узбекском) →",
    faqs: [
      { q: "Какие форматы файлов принимаются?", a: "Система принимает финансовые файлы в форматах .xlsx и .xls. Файл автоматически проверяется и проходит валидацию." },
      { q: "Сколько времени занимает анализ?", a: "Анализ занимает всего 1 минуту — отчёт готов сразу после отправки файла." },
      { q: "Услуга платная?", a: "Сейчас все анализы полностью бесплатны. О введении платных тарифов мы заранее сообщим на сайте и в боте." },
      { q: "Насколько надёжен анализ?", a: "Каждый отчёт проходит контроль опытного специалиста, а результаты сверяются с бенчмарками." },
      { q: "Можно ли скачать отчёт?", a: "Да, в конце каждого анализа профессиональный PDF-отчёт скачивается одной кнопкой." },
      { q: "Мои данные в безопасности?", a: "Данные передаются по защищённому соединению (HTTPS), используются только для анализа и не передаются третьим лицам." },
    ],
  },
};

export function renderHome(lang = "uz") {
  const c = HOME_COPY[lang] || HOME_COPY.uz;
  const canonical = `${SITE_URL}${HOME_PATHS[lang] || "/"}`;
  // index.html'dagi FAQ bilan BIR XIL savol-javoblar (tuzatilgan, halol versiya).
  const faqs = c.faqs;
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const h2 = (t) => `<h2 style="font-size:24px;font-weight:800;color:#0f172a;margin:34px 0 12px">${t}</h2>`;
  const p = (t) => `<p style="color:#475569;line-height:1.65;margin:0 0 10px">${t}</p>`;
  const ul = (items) =>
    `<ul style="color:#475569;line-height:1.7;padding-left:20px;margin:0 0 10px">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

  const rootHtml =
    `${SHELL_HEADER}<main style="max-width:760px;margin:0 auto;padding:0 24px 40px">` +
    `<h1 style="font-size:34px;font-weight:800;line-height:1.2;color:#0f172a;margin:0 0 12px">${c.h1}</h1>` +
    p(c.lead) +
    ctaBlock(lang) +
    h2(c.h2how) + ul(c.how) +
    h2(c.h2what) + ul(c.what) +
    h2(c.h2report) + ul(c.report) +
    h2(c.h2price) + p(c.price) +
    h2(c.h2faq) +
    faqs
      .map(
        (f) =>
          `<h3 style="font-size:17px;font-weight:700;color:#0f172a;margin:18px 0 6px">${f.q}</h3><p style="color:#475569;line-height:1.6;margin:0">${f.a}</p>`
      )
      .join("") +
    `<p style="margin-top:30px"><a href="/blog" style="color:#3b82f6;font-weight:700">${c.blogLink}</a></p>` +
    `</main>${SHELL_FOOTER}`;

  // Title/description marketing shioridan emas, real qidiruv so'rovlaridan
  // qurilgan: "moliyaviy tahlil", "balans tahlili", "1C hisoboti".
  return buildPage({
    title: c.title,
    description: c.description,
    canonical,
    ogType: "website",
    pageJsonLd,
    rootHtml,
    lang,
    alternates: HOME_ALTERNATES,
  });
}

// Bosh sahifaning til variantlari — har ikkala sahifada bir xil ro'yxat
// bo'lishi shart (hreflang o'zaro ("reciprocal") bo'lmasa Google e'tiborsiz
// qoldiradi). x-default — tili mos kelmagan foydalanuvchi uchun.
const HOME_ALTERNATES = [
  { lang: "uz", href: `${SITE_URL}/` },
  { lang: "ru", href: `${SITE_URL}/ru` },
  { lang: "x-default", href: `${SITE_URL}/` },
];

// Dinamik sitemap.xml (DB'dagi published maqolalar bilan).
export function buildSitemap(list) {
  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${SITE_URL}/ru`, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/blog`, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/maxfiylik.html`, changefreq: "yearly", priority: "0.3" },
    { loc: `${SITE_URL}/shartlar.html`, changefreq: "yearly", priority: "0.3" },
  ];
  // 301 bilan yo'naltirilgan (birlashtirilgan) slug'lar sitemap'da turmasin.
  const articleUrls = list
    .filter((a) => !MERGED_SLUGS[a.slug])
    .map((a) => ({
      loc: `${SITE_URL}/blog/${a.slug}`,
      lastmod: (a.updated_at || a.created_at || "").slice(0, 10),
      changefreq: "monthly",
      priority: "0.8",
    }));
  const body = [...staticUrls, ...articleUrls]
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${u.loc}</loc>${lastmod}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
