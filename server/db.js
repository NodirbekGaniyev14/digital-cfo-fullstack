// Maqolalar ma'lumotlar bazasi (SQLite, better-sqlite3).
// Bitta faylli DB — server/data/articles.db. WAL rejimi bilan tez va ishonchli.
// Admin panel shu jadval ustida CRUD qiladi; public API faqat `published`ni beradi.

import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import sanitizeHtml from "sanitize-html";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "articles.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    excerpt     TEXT DEFAULT '',
    content     TEXT DEFAULT '',
    category    TEXT DEFAULT '',
    icon        TEXT DEFAULT 'book',
    icon_color  TEXT DEFAULT 'blue',
    cover_image TEXT DEFAULT '',
    author      TEXT DEFAULT 'Digital CFO',
    status      TEXT NOT NULL DEFAULT 'draft',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
  CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
`);

// --- Schema v2 migratsiyasi (idempotent) — mavjud DB'ni buzmasdan kengaytiradi ---
function _cols(table) {
  return new Set(db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name));
}
function _addCol(table, name, ddl) {
  if (!_cols(table).has(name)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
}
// articles — yangi ustunlar (SEO, featured image, publish, hisoblagichlar)
_addCol("articles", "seo_title", "seo_title TEXT DEFAULT ''");
_addCol("articles", "seo_description", "seo_description TEXT DEFAULT ''");
_addCol("articles", "focus_keyword", "focus_keyword TEXT DEFAULT ''");
_addCol("articles", "canonical_url", "canonical_url TEXT DEFAULT ''");
_addCol("articles", "robots_index", "robots_index INTEGER DEFAULT 1");
_addCol("articles", "robots_follow", "robots_follow INTEGER DEFAULT 1");
_addCol("articles", "cover_alt", "cover_alt TEXT DEFAULT ''");
_addCol("articles", "cover_caption", "cover_caption TEXT DEFAULT ''");
_addCol("articles", "author_id", "author_id INTEGER");
_addCol("articles", "category_id", "category_id INTEGER");
_addCol("articles", "views", "views INTEGER DEFAULT 0");
_addCol("articles", "is_featured", "is_featured INTEGER DEFAULT 0");
_addCol("articles", "published_at", "published_at TEXT");
_addCol("articles", "reading_minutes", "reading_minutes INTEGER DEFAULT 0");

// Yangi jadvallar: mualliflar, kategoriyalar, teglar (M2M), FAQ
db.exec(`
  CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
    avatar TEXT DEFAULT '', bio TEXT DEFAULT '', created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS article_tags (
    article_id INTEGER NOT NULL, tag_id INTEGER NOT NULL,
    PRIMARY KEY (article_id, tag_id)
  );
  CREATE TABLE IF NOT EXISTS article_faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL, question TEXT NOT NULL,
    answer TEXT DEFAULT '', position INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    source TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_faqs_article ON article_faqs(article_id);
  CREATE INDEX IF NOT EXISTS idx_atags_article ON article_tags(article_id);
`);

// --- HTML tozalash (stored-XSS himoyasi) — admin matni bazaga yozilishdan oldin ---
const SANITIZE_OPTS = {
  // TipTap chiqishini qo'llab-quvvatlaydi: sarlavhalar, jadval, kod, video embed.
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img", "h1", "h2", "figure", "figcaption", "iframe",
    "u", "s", "sup", "sub", "mark", "hr", "span",
  ]),
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan"],
    code: ["class"],
    span: ["class"],
    "*": ["class", "style"],
  },
  // Faqat inline style'da xavfsiz xossalar (CSS injection'ni cheklaydi).
  allowedStyles: {
    "*": {
      "text-align": [/^left$|^right$|^center$|^justify$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Video embed faqat ishonchli platformalardan.
  allowedIframeHostnames: [
    "www.youtube.com", "youtube.com", "www.youtube-nocookie.com",
    "player.vimeo.com",
  ],
  transformTags: {
    // Tashqi havolalarga xavfsizlik atributlari.
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") attribs.rel = "noopener noreferrer";
      return { tagName, attribs };
    },
  },
};
export function cleanHtml(html) {
  return sanitizeHtml(String(html || ""), SANITIZE_OPTS);
}

// --- Slug yasash (kirill/lotin/bo'shliq → toza URL) ---
const TR = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"j",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",
  н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"x",ц:"ts",ч:"ch",ш:"sh",щ:"sh",
  ъ:"",ы:"i",ь:"",э:"e",ю:"yu",я:"ya",
};
export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[а-яё]/g, (c) => TR[c] ?? "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "maqola";
}

// Slug band bo'lsa -2, -3 ... qo'shib unikal qiladi.
export function uniqueSlug(base, excludeId = null) {
  let slug = slugify(base);
  const exists = db.prepare("SELECT id FROM articles WHERE slug = ? AND id != ?");
  let i = 1;
  let candidate = slug;
  while (exists.get(candidate, excludeId ?? -1)) {
    i += 1;
    candidate = `${slug}-${i}`;
  }
  return candidate;
}

// --- So'rovlar ---
const LIST_COLS =
  "id, title, slug, excerpt, category, icon, icon_color, cover_image, author, status, " +
  "views, is_featured, reading_minutes, published_at, created_at, updated_at";

export const Articles = {
  // Public: faqat chop etilganlar, eng yangisi tepada (+ teg slug'lari).
  listPublished: () =>
    db.prepare(
      `SELECT ${LIST_COLS},
         (SELECT group_concat(t.slug) FROM tags t JOIN article_tags at ON at.tag_id=t.id WHERE at.article_id=articles.id) AS tag_slugs
       FROM articles WHERE status='published' ORDER BY datetime(created_at) DESC`
    ).all().map((r) => ({ ...r, tag_slugs: r.tag_slugs ? r.tag_slugs.split(",") : [] })),
  getPublishedBySlug: (slug) =>
    db.prepare("SELECT * FROM articles WHERE slug=? AND status='published'").get(slug),

  // Admin: hammasi (draft + published).
  listAll: () =>
    db.prepare(`SELECT ${LIST_COLS} FROM articles ORDER BY datetime(created_at) DESC`).all(),
  getById: (id) => db.prepare("SELECT * FROM articles WHERE id=?").get(id),
  getBySlug: (slug) => db.prepare("SELECT * FROM articles WHERE slug=?").get(slug),

  // Maqolaga biriktirilgan FAQ'lar (tartib bilan).
  getFaqs: (articleId) =>
    db.prepare("SELECT question, answer FROM article_faqs WHERE article_id=? ORDER BY position, id").all(articleId),

  insert: (a) => {
    const now = new Date().toISOString();
    const author = Authors.upsertByName(a.author, { avatar: a.author_avatar, bio: a.author_bio });
    const p = _articleParams(a, now);
    p.author = author.name;
    const info = db
      .prepare(
        `INSERT INTO articles (${ALL_COLS.join(", ")}, created_at, updated_at)
         VALUES (${ALL_COLS.map((c) => "@" + c).join(", ")}, @created_at, @updated_at)`
      )
      .run({ ...p, created_at: a.created_at || now, updated_at: now });
    const id = info.lastInsertRowid;
    db.prepare("UPDATE articles SET author_id=? WHERE id=?").run(author.id, id);
    if (Array.isArray(a.faqs)) Articles.setFaqs(id, a.faqs);
    if (a.tags !== undefined) Tags.setForArticle(id, a.tags);
    return Articles.hydrate(Articles.getById(id));
  },

  update: (id, a) => {
    const now = new Date().toISOString();
    const author = Authors.upsertByName(a.author, { avatar: a.author_avatar, bio: a.author_bio });
    const p = _articleParams(a, now);
    p.author = author.name;
    db.prepare(
      `UPDATE articles SET ${ALL_COLS.map((c) => `${c}=@${c}`).join(", ")}, author_id=@author_id, updated_at=@updated_at WHERE id=@id`
    ).run({ ...p, id, author_id: author.id, updated_at: now });
    if (Array.isArray(a.faqs)) Articles.setFaqs(id, a.faqs);
    if (a.tags !== undefined) Tags.setForArticle(id, a.tags);
    return Articles.hydrate(Articles.getById(id));
  },

  // Maqolaga bog'liq ma'lumotlarni biriktiradi (FAQ, teglar, muallif obyekti).
  hydrate: (a) => {
    if (!a) return a;
    a.faqs = Articles.getFaqs(a.id);
    a.tags = Tags.getForArticle(a.id);
    a.author_obj = a.author_id ? Authors.getById(a.author_id) : null;
    return a;
  },

  // Maqola FAQ'larini to'liq almashtiradi (eskisini o'chirib, yangisini yozadi).
  setFaqs: (articleId, faqs) => {
    const tx = db.transaction((list) => {
      db.prepare("DELETE FROM article_faqs WHERE article_id=?").run(articleId);
      const ins = db.prepare(
        "INSERT INTO article_faqs (article_id, question, answer, position) VALUES (?,?,?,?)"
      );
      list.forEach((f, i) => {
        const q = String(f.question || "").trim();
        if (q) ins.run(articleId, q, cleanHtml(f.answer || ""), i);
      });
    });
    tx(faqs || []);
  },

  remove: (id) => {
    db.prepare("DELETE FROM article_faqs WHERE article_id=?").run(id);
    db.prepare("DELETE FROM article_tags WHERE article_id=?").run(id);
    return db.prepare("DELETE FROM articles WHERE id=?").run(id);
  },
  count: () => db.prepare("SELECT COUNT(*) c FROM articles").get().c,
  incrementViews: (id) => db.prepare("UPDATE articles SET views=views+1 WHERE id=?").run(id),

  // Rejalashtirilgan maqolalarni vaqti kelganda 'published' ga o'tkazadi.
  publishDue: () => {
    const now = new Date().toISOString();
    return db.prepare(
      "UPDATE articles SET status='published' WHERE status='scheduled' AND published_at IS NOT NULL AND published_at <= ?"
    ).run(now).changes;
  },
};

// Barcha yoziladigan ustunlar (created_at/updated_at alohida boshqariladi).
const ALL_COLS = [
  "title", "slug", "excerpt", "content", "category", "icon", "icon_color",
  "cover_image", "cover_alt", "cover_caption", "author", "status",
  "seo_title", "seo_description", "focus_keyword", "canonical_url",
  "robots_index", "robots_follow", "is_featured", "published_at", "reading_minutes",
];
const VALID_STATUS = ["draft", "published", "scheduled", "archived"];

function _articleParams(a, now) {
  const status = VALID_STATUS.includes(a.status) ? a.status : "draft";
  // published_at: chop etilganda vaqt bo'lmasa — hozir; rejalashtirilganda — berilgan vaqt.
  let published_at = a.published_at || null;
  if (status === "published" && !published_at) published_at = now;
  const words = String(a.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt || "",
    content: a.content || "",
    category: a.category || "",
    icon: a.icon || "book",
    icon_color: a.icon_color || "blue",
    cover_image: a.cover_image || "",
    cover_alt: a.cover_alt || "",
    cover_caption: a.cover_caption || "",
    author: a.author || "Digital CFO",
    status,
    seo_title: a.seo_title || "",
    seo_description: a.seo_description || "",
    focus_keyword: a.focus_keyword || "",
    canonical_url: a.canonical_url || "",
    robots_index: a.robots_index === 0 || a.robots_index === "0" ? 0 : 1,
    robots_follow: a.robots_follow === 0 || a.robots_follow === "0" ? 0 : 1,
    is_featured: a.is_featured ? 1 : 0,
    published_at,
    reading_minutes: Math.max(1, Math.round(words / 200)),
  };
}

// Berilgan jadval ichida unikal slug (name/base'dan).
function uniqueSlugIn(table, base, excludeId = null) {
  const s = slugify(base);
  const exists = db.prepare(`SELECT id FROM ${table} WHERE slug=? AND id!=?`);
  let candidate = s;
  let i = 1;
  while (exists.get(candidate, excludeId ?? -1)) candidate = `${s}-${++i}`;
  return candidate;
}

// --- Mualliflar (avatar + bio) ---
export const Authors = {
  list: () => db.prepare("SELECT * FROM authors ORDER BY name").all(),
  getById: (id) => db.prepare("SELECT * FROM authors WHERE id=?").get(id),
  getBySlug: (slug) => db.prepare("SELECT * FROM authors WHERE slug=?").get(slug),
  // Nom bo'yicha topadi yoki yaratadi; avatar/bio berilsa yangilaydi.
  upsertByName: (name, extra = {}) => {
    const nm = String(name || "").trim() || "Digital CFO";
    let a = db.prepare("SELECT * FROM authors WHERE name=?").get(nm);
    if (!a) {
      const slug = uniqueSlugIn("authors", nm);
      const info = db
        .prepare("INSERT INTO authors (name, slug, avatar, bio, created_at) VALUES (?,?,?,?,?)")
        .run(nm, slug, extra.avatar || "", extra.bio || "", new Date().toISOString());
      return Authors.getById(info.lastInsertRowid);
    }
    if (extra.avatar !== undefined || extra.bio !== undefined) {
      db.prepare("UPDATE authors SET avatar=?, bio=? WHERE id=?").run(
        extra.avatar !== undefined ? extra.avatar : a.avatar,
        extra.bio !== undefined ? extra.bio : a.bio,
        a.id
      );
      a = Authors.getById(a.id);
    }
    return a;
  },
  remove: (id) => {
    db.prepare("UPDATE articles SET author_id=NULL WHERE author_id=?").run(id);
    return db.prepare("DELETE FROM authors WHERE id=?").run(id);
  },
};

// --- Teglar (M2M) ---
export const Tags = {
  all: () => db.prepare("SELECT * FROM tags ORDER BY name").all(),
  getForArticle: (articleId) =>
    db.prepare(
      "SELECT t.name, t.slug FROM tags t JOIN article_tags at ON at.tag_id=t.id WHERE at.article_id=? ORDER BY t.name"
    ).all(articleId),
  // Nom bo'yicha topadi yoki yaratadi.
  upsertByName: (name) => {
    const nm = String(name || "").trim();
    if (!nm) return null;
    let t = db.prepare("SELECT * FROM tags WHERE name=? COLLATE NOCASE").get(nm);
    if (!t) {
      const info = db.prepare("INSERT INTO tags (name, slug) VALUES (?,?)").run(nm, uniqueSlugIn("tags", nm));
      t = db.prepare("SELECT * FROM tags WHERE id=?").get(info.lastInsertRowid);
    }
    return t;
  },
  // Maqola teglarini to'liq almashtiradi. `tags`: massiv yoki vergulli satr.
  setForArticle: (articleId, tags) => {
    const names = (Array.isArray(tags) ? tags : String(tags || "").split(","))
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 20);
    const tx = db.transaction(() => {
      db.prepare("DELETE FROM article_tags WHERE article_id=?").run(articleId);
      const link = db.prepare("INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?,?)");
      const seen = new Set();
      for (const nm of names) {
        const t = Tags.upsertByName(nm);
        if (t && !seen.has(t.id)) { link.run(articleId, t.id); seen.add(t.id); }
      }
    });
    tx();
  },
};

// --- Newsletter obunachilari ---
export const Subscribers = {
  // Yangi obuna (dublikat bo'lsa false). email allaqachon tekshirilgan bo'lishi kerak.
  add: (email, source = "") => {
    try {
      db.prepare("INSERT INTO subscribers (email, source, created_at) VALUES (?,?,?)")
        .run(email.toLowerCase(), source, new Date().toISOString());
      return true;
    } catch {
      return false; // UNIQUE buzilishi — allaqachon obuna
    }
  },
  count: () => db.prepare("SELECT COUNT(*) c FROM subscribers").get().c,
  list: () => db.prepare("SELECT id, email, source, created_at FROM subscribers ORDER BY datetime(created_at) DESC").all(),
};

// --- Dastlabki seed: mavjud 6 maqolani client'dagi articles.js dan ko'chiramiz ---
// Faqat jadval bo'sh bo'lsa bir marta ishlaydi.
const ICON_MAP = {
  LineChart: "chart", Droplets: "droplet", ShieldAlert: "shield",
  TrendingUp: "trending-up", Landmark: "bank", FileSpreadsheet: "file",
};
const COLOR_BY_CAT = {
  Asoslar: "blue", Likvidlik: "sky", Risk: "red",
  Rentabellik: "green", Barqarorlik: "violet", Amaliyot: "teal",
};

if (Articles.count() === 0) {
  try {
    const seedPath = path.join(__dirname, "..", "client", "src", "data", "articles.js");
    const mod = await import(pathToFileURL(seedPath).href);
    const insertMany = db.transaction((list) => {
      for (const a of list) {
        // FAQ bloklarini content oxiriga qo'shamiz (alohida maydon yo'q).
        const faqHtml = (a.faq || []).length
          ? `<h2>Ko'p so'raladigan savollar</h2>` +
            a.faq.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join("")
          : "";
        Articles.insert({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || a.description || "",
          content: cleanHtml((a.body || "") + faqHtml),
          category: a.category || "",
          icon: ICON_MAP[a.icon] || "book",
          icon_color: COLOR_BY_CAT[a.category] || "blue",
          author: "Digital CFO",
          status: "published",
          created_at: new Date(a.datePublished || Date.now()).toISOString(),
        });
      }
    });
    insertMany(mod.ARTICLES || []);
    console.log(`🌱 Maqolalar seed qilindi: ${Articles.count()} ta`);
  } catch (err) {
    console.warn("⚠️ Seed o'tkazib yuborildi:", err.message);
  }
}

export default db;
