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

// --- HTML tozalash (stored-XSS himoyasi) — admin matni bazaga yozilishdan oldin ---
const SANITIZE_OPTS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "figure", "figcaption"]),
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
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
  "id, title, slug, excerpt, category, icon, icon_color, author, status, created_at, updated_at";

export const Articles = {
  // Public: faqat chop etilganlar, eng yangisi tepada.
  listPublished: () =>
    db.prepare(`SELECT ${LIST_COLS} FROM articles WHERE status='published' ORDER BY datetime(created_at) DESC`).all(),
  getPublishedBySlug: (slug) =>
    db.prepare("SELECT * FROM articles WHERE slug=? AND status='published'").get(slug),

  // Admin: hammasi (draft + published).
  listAll: () =>
    db.prepare(`SELECT ${LIST_COLS} FROM articles ORDER BY datetime(created_at) DESC`).all(),
  getById: (id) => db.prepare("SELECT * FROM articles WHERE id=?").get(id),
  getBySlug: (slug) => db.prepare("SELECT * FROM articles WHERE slug=?").get(slug),

  insert: (a) => {
    const now = new Date().toISOString();
    const info = db
      .prepare(
        `INSERT INTO articles (title, slug, excerpt, content, category, icon, icon_color, cover_image, author, status, created_at, updated_at)
         VALUES (@title, @slug, @excerpt, @content, @category, @icon, @icon_color, @cover_image, @author, @status, @created_at, @updated_at)`
      )
      .run({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        content: a.content || "",
        category: a.category || "",
        icon: a.icon || "book",
        icon_color: a.icon_color || "blue",
        cover_image: a.cover_image || "",
        author: a.author || "Digital CFO",
        status: a.status === "published" ? "published" : "draft",
        created_at: a.created_at || now,
        updated_at: now,
      });
    return Articles.getById(info.lastInsertRowid);
  },

  update: (id, a) => {
    const now = new Date().toISOString();
    db.prepare(
      `UPDATE articles SET title=@title, slug=@slug, excerpt=@excerpt, content=@content,
         category=@category, icon=@icon, icon_color=@icon_color, cover_image=@cover_image,
         author=@author, status=@status, updated_at=@updated_at WHERE id=@id`
    ).run({
      id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt || "",
      content: a.content || "",
      category: a.category || "",
      icon: a.icon || "book",
      icon_color: a.icon_color || "blue",
      cover_image: a.cover_image || "",
      author: a.author || "Digital CFO",
      status: a.status === "published" ? "published" : "draft",
      updated_at: now,
    });
    return Articles.getById(id);
  },

  remove: (id) => db.prepare("DELETE FROM articles WHERE id=?").run(id),
  count: () => db.prepare("SELECT COUNT(*) c FROM articles").get().c,
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
