// Build-time prerender — SEO uchun eng muhim qadam.
//
// `vite build` client'ni SPA sifatida quradi (bo'sh #root). Qidiruv robotlari
// JavaScript'ni har doim ham to'liq render qilmaydi, shuning uchun bu skript
// har bir maqola va ro'yxat sahifasi uchun TO'LIQ matnli static HTML yaratadi:
//   dist/article/<slug>.html   va   dist/maqolalar.html
// Har fayl ichida: to'g'ri <title>, meta description, canonical, Open Graph,
// JSON-LD (BlogPosting/FAQ/Breadcrumb) va #root ichida maqola matni bo'ladi.
// React yuklanganda #root'ni o'zining interaktiv versiyasi bilan almashtiradi —
// robot esa matnni JS'siz ham ko'radi.
//
// Server (server/index.js) bu fayllarni `express.static(..., {extensions:['html']})`
// orqali toza URL bilan beradi: /maqolalar, /article/<slug>.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLES, SITE_URL, formatDateUz, timeAgoUz } from "../src/data/articles.js";
import { articleJsonLd, articlesListJsonLd } from "../src/lib/schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");
const TEMPLATE = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

// --- Yordamchilar -----------------------------------------------------------
const escAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const jsonLd = (obj) =>
  JSON.stringify(obj).replace(/</g, "\\u003c"); // </script> himoyasi

function replaceOnce(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`prerender: shablonda topilmadi — ${label}`);
  }
  return html.replace(regex, () => replacement);
}

// Sitewide JSON-LD (maqola sahifalarida bosh sahifa FAQ'i o'rniga faqat shu).
const BASE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Digital CFO",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/og-image.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Digital CFO",
      inLanguage: "uz",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
};

// Bitta sahifa HTML'ini shablondan yasaydi.
function buildPage({ title, description, canonical, ogType, pageJsonLd, rootHtml }) {
  let html = TEMPLATE;
  const fullTitle = title.includes("Digital CFO") ? title : `${title} — Digital CFO`;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`, "title");
  html = replaceOnce(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escAttr(description)}" />`,
    "description"
  );
  html = replaceOnce(
    html,
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${canonical}" />`,
    "canonical"
  );
  html = replaceOnce(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`, "og:url");
  html = replaceOnce(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escAttr(fullTitle)}" />`, "og:title");
  html = replaceOnce(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escAttr(description)}" />`,
    "og:description"
  );
  html = replaceOnce(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${ogType}" />`, "og:type");
  html = replaceOnce(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escAttr(fullTitle)}" />`, "twitter:title");
  html = replaceOnce(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${escAttr(description)}" />`,
    "twitter:description"
  );

  // Bosh sahifaning to'liq JSON-LD grafini (FAQ bilan) sahifaga mos grafga almashtiramiz.
  html = replaceOnce(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${jsonLd(BASE_GRAPH)}</script>\n    <script type="application/ld+json" id="ld-page">${jsonLd(pageJsonLd)}</script>`,
    "ld+json"
  );

  // #root ichiga matnni joylaymiz (robotlar JS'siz ko'radi).
  html = replaceOnce(html, /<div id="root">\s*<\/div>/, `<div id="root">${rootHtml}</div>`, "#root");
  return html;
}

// Umumiy sarlavha/pastki qism (JS'siz foydalanuvchi uchun ham navigatsiya bo'lsin).
const SHELL_HEADER = `<header style="max-width:820px;margin:0 auto;padding:20px 24px"><a href="/" style="font-weight:800;font-size:20px;color:#0f172a;text-decoration:none">Digital <span style="color:#3b82f6">CFO</span></a></header>`;
const SHELL_FOOTER = `<footer style="max-width:820px;margin:24px auto;padding:24px;color:#64748b;font-size:14px"><a href="/" style="color:#3b82f6">Bosh sahifa</a> · <a href="/maqolalar" style="color:#3b82f6">Barcha maqolalar</a></footer>`;

// --- Maqola sahifalari ------------------------------------------------------
const articleDir = path.join(DIST, "article");
fs.mkdirSync(articleDir, { recursive: true });

for (const a of ARTICLES) {
  const canonical = `${SITE_URL}/article/${a.slug}`;
  const faqHtml = (a.faq || [])
    .map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`)
    .join("");
  const rootHtml = `${SHELL_HEADER}<main style="max-width:760px;margin:0 auto;padding:0 24px 40px"><nav style="font-size:13px;color:#64748b;margin-bottom:14px"><a href="/" style="color:#64748b">Bosh sahifa</a> › <a href="/maqolalar" style="color:#64748b">Maqolalar</a> › ${a.category}</nav><article class="article-prose"><h1 style="font-size:34px;font-weight:800;line-height:1.2;color:#0f172a;margin:0 0 10px">${a.title}</h1><p style="color:#64748b;font-size:14px;margin:0 0 24px">${formatDateUz(a.datePublished)} · ${a.readingMinutes} daqiqa o'qish</p>${a.body}<section><h2>Ko'p so'raladigan savollar</h2>${faqHtml}</section></article></main>${SHELL_FOOTER}`;

  const html = buildPage({
    title: a.title,
    description: a.description,
    canonical,
    ogType: "article",
    pageJsonLd: articleJsonLd(a),
    rootHtml,
  });
  fs.writeFileSync(path.join(articleDir, `${a.slug}.html`), html);
}

// --- /maqolalar ro'yxat sahifasi --------------------------------------------
const listItems = ARTICLES.map(
  (a) =>
    `<li style="margin-bottom:18px"><span style="color:#64748b;font-size:13px">${timeAgoUz(a.datePublished)} · ${a.category}</span><br><a href="/article/${a.slug}" style="font-size:19px;font-weight:700;color:#0f172a;text-decoration:none">${a.title}</a><p style="color:#475569;margin:6px 0 0">${a.excerpt}</p></li>`
).join("");
const listRoot = `${SHELL_HEADER}<main style="max-width:820px;margin:0 auto;padding:0 24px 40px"><h1 style="font-size:36px;font-weight:800;color:#0f172a">Moliyaviy tahlil bo'yicha maqolalar</h1><p style="color:#475569;font-size:17px;margin:10px 0 28px">Likvidlik, rentabellik, moliyaviy barqarorlik va bankrotlik xavfi bo'yicha amaliy qo'llanmalar — oddiy tilda, formulalar va misollar bilan.</p><ul style="list-style:none;padding:0">${listItems}</ul></main>${SHELL_FOOTER}`;

const listHtml = buildPage({
  title: "Maqolalar — moliyaviy tahlil bo'yicha qo'llanmalar",
  description:
    "Moliyaviy tahlil, likvidlik, rentabellik, Altman Z-Score va 1C hisobotlari bo'yicha amaliy maqolalar — Digital CFO ekspertlaridan.",
  canonical: `${SITE_URL}/maqolalar`,
  ogType: "website",
  pageJsonLd: articlesListJsonLd(ARTICLES),
  rootHtml: listRoot,
});
fs.writeFileSync(path.join(DIST, "maqolalar.html"), listHtml);

// --- sitemap.xml ------------------------------------------------------------
const staticUrls = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${SITE_URL}/maqolalar`, changefreq: "weekly", priority: "0.9" },
  { loc: `${SITE_URL}/maxfiylik.html`, changefreq: "yearly", priority: "0.3" },
  { loc: `${SITE_URL}/shartlar.html`, changefreq: "yearly", priority: "0.3" },
];
const articleUrls = ARTICLES.map((a) => ({
  loc: `${SITE_URL}/article/${a.slug}`,
  lastmod: a.dateModified || a.datePublished,
  changefreq: "monthly",
  priority: "0.8",
}));
const urlsXml = [...staticUrls, ...articleUrls]
  .map((u) => {
    const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${u.loc}</loc>${lastmod}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
  })
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);

console.log(
  `✅ Prerender tayyor: ${ARTICLES.length} ta maqola + /maqolalar + sitemap.xml`
);
