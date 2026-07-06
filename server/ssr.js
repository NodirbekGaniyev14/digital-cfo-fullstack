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

function buildPage({ title, description, canonical, ogType, pageJsonLd, rootHtml, robots, image }) {
  let html = template();
  const fullTitle = title.includes("Digital CFO") ? title : `${title} — Digital CFO`;
  const rep = (re, val, label) => {
    if (!re.test(html)) throw new Error(`ssr: shablonda topilmadi — ${label}`);
    html = html.replace(re, () => val);
  };
  rep(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(fullTitle)}</title>`, "title");
  rep(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escAttr(description)}" />`, "description");
  rep(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${robots || "index,follow"}" />`, "robots");
  rep(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`, "canonical");
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

// Bitta maqola sahifasi HTML'i.
export function renderArticle(a) {
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
    `${cover}${a.content}</article></main>${SHELL_FOOTER}`;

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

// Dinamik sitemap.xml (DB'dagi published maqolalar bilan).
export function buildSitemap(list) {
  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${SITE_URL}/blog`, changefreq: "weekly", priority: "0.9" },
    { loc: `${SITE_URL}/maxfiylik.html`, changefreq: "yearly", priority: "0.3" },
    { loc: `${SITE_URL}/shartlar.html`, changefreq: "yearly", priority: "0.3" },
  ];
  const articleUrls = list.map((a) => ({
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
