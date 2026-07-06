import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { timingSafeEqual } from "node:crypto";
import db, { Articles, cleanHtml, uniqueSlug } from "./db.js";
import { loginHandler, requireAdmin } from "./auth.js";
import { renderArticle, renderList, buildSitemap, hasTemplate } from "./ssr.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === "production";

const app = express();
app.set("trust proxy", 1); // reverse-proxy ortida to'g'ri IP olish uchun

// ---- Xavfsizlik sarlavhalari --------------------------------------------------
// SPA inline-style va Google Fonts ishlatadi, shuning uchun CSP'ni o'chiramiz.
app.use(helmet({ contentSecurityPolicy: false }));

// ---- CORS (production'da cheklangan) -----------------------------------------
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: isProd && allowedOrigins.length ? allowedOrigins : true,
  })
);

app.use(express.json({ limit: "1mb" }));

// ---- Fayl yuklash (moliyaviy Excel/CSV) --------------------------------------
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });
const statsFile = path.join(dataDir, "stats.json");

// Maqola muqova rasmlari (admin yuklaydi) — /media orqali ochiq beriladi.
// Excel yuklamalaridan (uploads/, PII) ALOHIDA papka — mijoz fayllari oshkor bo'lmaydi.
const mediaDir = path.join(__dirname, "media");
fs.mkdirSync(mediaDir, { recursive: true });
app.use("/media", express.static(mediaDir));

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, mediaDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 8);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});
const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok =
      IMG_EXT.includes(path.extname(file.originalname).toLowerCase()) &&
      file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Faqat rasm fayllari (jpg, png, webp)"), ok);
  },
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = path
      .basename(file.originalname)
      .replace(/[^\w.\-]+/g, "_")
      .slice(-120);
    cb(null, `${Date.now()}-${safe}`);
  },
});
const ALLOWED_EXT = [".xlsx", ".xls", ".csv"];
const ALLOWED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/octet-stream", // ba'zi brauzerlar csv/xls uchun shuni yuboradi
];
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 2 }, // 15 MB, 2 tagacha fayl
  fileFilter: (_req, file, cb) => {
    const extOk = ALLOWED_EXT.includes(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeOk = ALLOWED_MIME.includes(file.mimetype);
    cb(
      extOk && mimeOk
        ? null
        : new Error("Faqat .xlsx, .xls yoki .csv qabul qilinadi"),
      extOk && mimeOk
    );
  },
});

// ---- Oddiy, ishonchli persistence (leads.json) -------------------------------
const dbFile = path.join(__dirname, "leads.json");
function loadLeads() {
  try {
    return JSON.parse(fs.readFileSync(dbFile, "utf8"));
  } catch {
    return [];
  }
}
function saveLeads(list) {
  const tmp = `${dbFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, dbFile); // atomik yozish
}
let leads = loadLeads();

// Vaqtni har doim Toshkent (GMT+5) zonasida formatlash.
function fmtTashkent(iso) {
  return new Date(iso).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// ---- Telegram bildirishnoma (ixtiyoriy) --------------------------------------
async function notifyTelegram(lead, files = []) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // sozlanmagan bo'lsa — jim o'tkazib yuboramiz

  const text =
    `🆕 *Yangi so'rov — Digital CFO*\n\n` +
    `👤 *Ism:* ${lead.name}\n` +
    (lead.company ? `🏢 *Kompaniya:* ${lead.company}\n` : "") +
    `✉️ *Email:* ${lead.email}\n` +
    (lead.phone ? `📞 *Telefon:* ${lead.phone}\n` : "") +
    (lead.message ? `💬 *Xabar:* ${lead.message}\n` : "") +
    (files.length
      ? files.map((f) => `📎 *${f.label}:* ${f.file.originalname}`).join("\n") +
        "\n"
      : "") +
    `🕒 ${fmtTashkent(lead.createdAt)} (GMT+5)`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) console.warn("⚠️ Telegram javobi:", res.status);

    // Yuklangan fayllarni ham hujjat sifatida yuboramiz (har biri alohida).
    for (const { label, file } of files) {
      if (!file?.path) continue;
      const fd = new FormData();
      fd.append("chat_id", chatId);
      fd.append("caption", `📎 ${label} — ${lead.name}`);
      fd.append(
        "document",
        new Blob([fs.readFileSync(file.path)]),
        file.originalname
      );
      const docRes = await fetch(
        `https://api.telegram.org/bot${token}/sendDocument`,
        { method: "POST", body: fd }
      );
      if (!docRes.ok) console.warn("⚠️ Telegram fayl javobi:", docRes.status);
    }
  } catch (err) {
    console.warn("⚠️ Telegram yuborilmadi:", err.message);
  }
}

// ---- Yordamchilar -------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// ---- Kunlik ma'lumot zaxirasi (leads/arizalar/stats -> Telegram) --------------
// VPS diski yagona nusxa edi — endi har kuni 03:30 (Toshkent) da JSON fayllar
// admin chatiga hujjat sifatida yuboriladi. Token yo'q bo'lsa — jim o'tadi.
// Server TZ'idan qat'i nazar to'g'ri ishlaydi (Intl orqali Toshkent vaqti).
function tashkentDate() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" }); // YYYY-MM-DD
}
function tashkentHM() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t)?.value || 0);
  return { hour: get("hour"), minute: get("minute") };
}

async function backupDataToTelegram() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  // WAL'ni asosiy .db fayliga yozamiz — zaxira nusxasi izchil bo'lishi uchun.
  try { db.pragma("wal_checkpoint(TRUNCATE)"); } catch { /* ignore */ }
  const targets = [
    path.join(__dirname, "leads.json"),
    path.join(dataDir, "arizalar.json"),
    path.join(dataDir, "stats.json"),
    path.join(dataDir, "articles.db"),
  ].filter((f) => fs.existsSync(f));
  if (!targets.length) return false;

  const stamp = tashkentDate();
  let ok = true;
  for (const f of targets) {
    try {
      const fd = new FormData();
      fd.append("chat_id", chatId);
      fd.append("caption", `💾 Sayt zaxirasi — ${path.basename(f)} · ${stamp}`);
      fd.append(
        "document",
        new Blob([fs.readFileSync(f)]),
        `${stamp}_site_${path.basename(f)}`
      );
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendDocument`,
        { method: "POST", body: fd }
      );
      if (!res.ok) {
        ok = false;
        console.warn("⚠️ Zaxira yuborilmadi:", path.basename(f), res.status);
      }
    } catch (err) {
      ok = false;
      console.warn("⚠️ Zaxira xatosi:", path.basename(f), err.message);
    }
  }
  if (ok) console.log("💾 Sayt ma'lumotlari zaxirasi yuborildi:", stamp);
  return ok;
}

// Har 10 daqiqada tekshiramiz: Toshkent vaqti 03:30 dan keyin bo'lsa va bugun
// hali yuborilmagan bo'lsa — zaxira. (PM2 restartlarida ham barqaror.)
let lastBackupDate = "";
setInterval(() => {
  const { hour, minute } = tashkentHM();
  const today = tashkentDate();
  if (hour === 3 && minute >= 30 && lastBackupDate !== today) {
    lastBackupDate = today;
    backupDataToTelegram();
  }
}, 10 * 60 * 1000);

// ---- Routes -------------------------------------------------------------------
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Kontakt formasiga maxsus rate-limit: 15 daqiqada IP'dan maks 6 ta
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p so'rov. Birozdan so'ng qayta urinib ko'ring." },
});

app.post(
  "/api/contact",
  contactLimiter,
  upload.fields([
    { name: "balance", maxCount: 1 },
    { name: "report", maxCount: 1 },
  ]),
  (req, res) => {
    // Yuklangan fayllar: 1-si Balans, 2-si Moliyaviy hisobot (ikkalasi ham ixtiyoriy).
    const upBalance = req.files?.balance?.[0] || null;
    const upReport = req.files?.report?.[0] || null;
    const uploaded = [
      upBalance && { label: "Balans", file: upBalance },
      upReport && { label: "Moliyaviy hisobot", file: upReport },
    ].filter(Boolean);
    const cleanupFiles = () =>
      uploaded.forEach(({ file }) =>
        fs.promises.unlink(file.path).catch(() => {})
      );

    // Honeypot: bot'lar "website" yashirin maydonni to'ldiradi — jim rad etamiz.
    if (clean(req.body.website)) {
      cleanupFiles();
      return res.json({ ok: true }); // bot'ni "muvaffaqiyat" bilan aldaymiz
    }

    const name = clean(req.body.name, 120);
    const email = clean(req.body.email, 160);
    const company = clean(req.body.company, 160);
    const phone = clean(req.body.phone, 40);
    const message = clean(req.body.message, 2000);

    if (!name || !email) {
      cleanupFiles();
      return res.status(400).json({ error: "Ism va email majburiy" });
    }
    if (!EMAIL_RE.test(email)) {
      cleanupFiles();
      return res.status(400).json({ error: "Email manzili noto'g'ri" });
    }

    const lead = {
      id: leads.length ? leads[leads.length - 1].id + 1 : 1,
      name,
      company: company || null,
      email,
      phone: phone || null,
      message: message || null,
      files: uploaded.map(({ label, file }) => ({
        label,
        filename: file.filename,
      })),
      ip: req.ip,
      createdAt: new Date().toISOString(),
    };
    leads.push(lead);
    saveLeads(leads);
    console.log(
      "📩 Yangi so'rov:",
      lead.name,
      lead.email,
      lead.files.map((f) => f.filename).join(", ") || ""
    );
    notifyTelegram(lead, uploaded); // fire-and-forget (fayllar bilan)

    // IP'ni javobda qaytarmaymiz
    const { ip, ...safe } = lead;
    res.json({ ok: true, lead: safe });
  }
);

// ---- Ariza (Mutaxassis bilan bog'lanish) — #Ariza_N + Telegram --------------
const arizaFile = path.join(dataDir, "arizalar.json");
function loadArizalar() {
  try {
    return JSON.parse(fs.readFileSync(arizaFile, "utf8"));
  } catch {
    return [];
  }
}
function saveArizalar(list) {
  const tmp = `${arizaFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, arizaFile);
}
let arizalar = loadArizalar();

async function notifyAriza(a) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // sozlanmagan bo'lsa — jim
  const text =
    `🆕 *#Ariza_${a.id}* — Yangi murojaat (CFO.UZ)\n\n` +
    `👤 *Ism:* ${a.name}\n` +
    (a.email ? `✉️ *Email:* ${a.email}\n` : "") +
    (a.phone ? `📞 *Telefon:* ${a.phone}\n` : "") +
    (a.telegram ? `✈️ *Telegram:* ${a.telegram}\n` : "") +
    (a.message ? `💬 *Xabar:* ${a.message}\n` : "") +
    `🕒 ${fmtTashkent(a.createdAt)} (GMT+5)`;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) console.warn("⚠️ Ariza Telegram javobi:", res.status);
  } catch (err) {
    console.warn("⚠️ Ariza Telegram yuborilmadi:", err.message);
  }
}

const arizaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p so'rov. Birozdan so'ng qayta urinib ko'ring." },
});

app.post("/api/lead-request", arizaLimiter, (req, res) => {
  // Honeypot
  if (clean(req.body.website)) return res.json({ ok: true, ref: "" });

  const name = clean(req.body.name, 120);
  const email = clean(req.body.email, 160);
  const phone = clean(req.body.phone, 40);
  let telegram = clean(req.body.telegram, 60);
  const message = clean(req.body.message, 2000);

  if (!name) return res.status(400).json({ error: "Ism majburiy" });
  if (!email && !phone && !telegram)
    return res.status(400).json({ error: "Kamida bitta bog'lanish usulini kiriting" });
  if (email && !EMAIL_RE.test(email))
    return res.status(400).json({ error: "Email manzili noto'g'ri" });
  if (telegram) telegram = "@" + telegram.replace(/^@+/, "");

  const id = (arizalar.length ? arizalar[arizalar.length - 1].id : 0) + 1;
  const ariza = {
    id,
    name,
    email: email || null,
    phone: phone || null,
    telegram: telegram || null,
    message: message || null,
    ip: req.ip,
    createdAt: new Date().toISOString(),
  };
  arizalar.push(ariza);
  saveArizalar(arizalar);
  console.log(`📩 #Ariza_${id}:`, name, email || phone || telegram || "");
  notifyAriza(ariza); // fire-and-forget
  res.json({ ok: true, ticket: id, ref: `#Ariza_${id}` });
});

// Tahlil endpointi: faylni qabul qiladi, KPI hisoblaydi va natijani qaytaradi.
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p so'rov. Birozdan so'ng qayta urinib ko'ring." },
});

// Tahlil yadrosi — Telegram bot bilan AYNAN bir xil (Python engine).
const ENGINE = path.join(__dirname, "engine", "analyze_cli.py");
const PYTHON_BIN = process.env.PYTHON_BIN || "python3";

app.post("/api/analyze", analyzeLimiter, upload.array("files", 2), (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: "Fayl yuklanmadi" });

  const paths = files.map((f) => f.path);
  const cleanup = () =>
    paths.forEach((p) => fs.promises.unlink(p).catch(() => {}));

  // Sayt — TEASER rejimi: PDF generatsiya qilmaymiz (faqat botda).
  const args = [ENGINE, ...paths, "--lang", "uz"];
  execFile(
    PYTHON_BIN,
    args,
    { timeout: 60000, maxBuffer: 12 * 1024 * 1024 },
    (err, stdout) => {
      cleanup();
      if (err && !stdout) {
        console.warn("⚠️ Tahlil (python) xatosi:", err.message);
        return res
          .status(500)
          .json({ error: "Tahlil amalga oshmadi. Fayl formatini tekshiring." });
      }
      let data;
      try {
        data = JSON.parse(String(stdout).trim());
      } catch {
        return res.status(500).json({ error: "Natijani o'qib bo'lmadi." });
      }
      if (!data.ok) {
        return res
          .status(400)
          .json({ error: data.error || "Tahlil amalga oshmadi" });
      }
      // FAQAT 5 ta asosiy ko'rsatkich (har guruhdan bittadan) — qolgani "yopiq".
      // To'liq tahlil (~50 ko'rsatkich + PDF hisobot) Telegram botda.
      const inds = Array.isArray(data.indicators) ? data.indicators : [];
      const seen = new Set();
      const highlights = [];
      for (const i of inds) {
        if (!seen.has(i.group)) {
          seen.add(i.group);
          highlights.push(i);
        }
        if (highlights.length >= 5) break;
      }
      res.json({
        ok: true,
        company: data.company,
        stir: data.stir,
        period_year: data.period_year,
        period_quarter: data.period_quarter,
        has_pl: data.has_pl,
        score: data.score,
        verdict: data.verdict,
        counts: data.counts,
        highlights,
        locked: Math.max(inds.length - highlights.length, 0),
        total: inds.length,
      });
    }
  );
});

// /api/leads — faqat admin token bilan yoki localhost'dan
app.get("/api/leads", (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  const isLocal = ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.ip);
  const authed = token
    ? req.get("x-admin-token") === token
    : isLocal; // token sozlanmagan bo'lsa — faqat localhost
  if (!authed) return res.status(403).json({ error: "Ruxsat yo'q" });
  res.json({ leads });
});

// Doimiy-vaqt token solishtirish (timing-attack'dan himoya)
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// ---- Bot statistikasi (kunlik) -----------------------------------------------
// Bot har kuni 03:00 da POST /api/stats orqali yangilab turadi (token bilan).
app.get("/api/stats", (_req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(statsFile, "utf8")));
  } catch {
    res.json({}); // hali ma'lumot yo'q
  }
});

app.post("/api/stats", (req, res) => {
  const token = process.env.STATS_TOKEN;
  if (!token || !safeEqual(req.get("x-stats-token") || "", token)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const b = req.body || {};
  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const stats = {
    users: num(b.users),
    visits: num(b.visits),
    reports: num(b.reports),
    with_phone: num(b.with_phone),
    today_active: num(b.today_active),
    premium: num(b.premium),
    updated_at: new Date().toISOString(),
  };

  // AI agent metrikalari (ixtiyoriy, ichki obyekt) — har bir sonni tozalaymiz.
  const a = b.agent;
  if (a && typeof a === "object") {
    const sanitize = (obj) =>
      obj && typeof obj === "object"
        ? Object.fromEntries(Object.keys(obj).map((k) => [k, num(obj[k])]))
        : {};
    stats.agent = {
      funnel: sanitize(a.funnel),
      conversions: sanitize(a.conversions),
      today: sanitize(a.today),
    };
  }
  try {
    const tmp = statsFile + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(stats, null, 2));
    fs.renameSync(tmp, statsFile);
  } catch {
    return res.status(500).json({ error: "Saqlab bo'lmadi" });
  }
  console.log("📊 Statistika yangilandi:", stats.users, "foydalanuvchi");
  res.json({ ok: true });
});

// ==============================================================================
//  MAQOLALAR — public API + admin CRUD (SQLite)
// ==============================================================================

// ---- Public: faqat chop etilgan maqolalar ------------------------------------
app.get("/api/articles", (_req, res) => {
  res.json({ articles: Articles.listPublished() });
});

app.get("/api/articles/:slug", (req, res) => {
  const a = Articles.getPublishedBySlug(req.params.slug);
  if (!a) return res.status(404).json({ error: "Maqola topilmadi" });
  res.json({ article: a });
});

// ---- Admin login (rate-limit bilan) ------------------------------------------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
});
app.post("/api/admin/login", loginLimiter, loginHandler);

// ---- Admin CRUD (JWT himoyasida) ---------------------------------------------
const VALID_STATUS = ["draft", "published"];

// Kiruvchi maqola ma'lumotlarini tekshirish va tozalash.
function parseArticleInput(body, { forId = null } = {}) {
  const title = clean(body.title, 200);
  if (!title) return { error: "Sarlavha majburiy" };
  const status = VALID_STATUS.includes(body.status) ? body.status : "draft";
  const slugBase = clean(body.slug, 200) || title;
  const slug = uniqueSlug(slugBase, forId);
  return {
    data: {
      title,
      slug,
      excerpt: clean(body.excerpt, 400),
      content: cleanHtml(body.content || ""),
      category: clean(body.category, 80),
      icon: clean(body.icon, 40) || "book",
      icon_color: clean(body.icon_color, 40) || "blue",
      cover_image: clean(body.cover_image, 500),
      author: clean(body.author, 120) || "Digital CFO",
      status,
    },
  };
}

app.get("/api/admin/articles", requireAdmin, (_req, res) => {
  res.json({ articles: Articles.listAll() });
});

app.get("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const a = Articles.getById(Number(req.params.id));
  if (!a) return res.status(404).json({ error: "Maqola topilmadi" });
  res.json({ article: a });
});

app.post("/api/admin/articles", requireAdmin, (req, res) => {
  const { data, error } = parseArticleInput(req.body || {});
  if (error) return res.status(400).json({ error });
  const created = Articles.insert(data);
  console.log("📝 Yangi maqola:", created.slug, `(${created.status})`);
  res.json({ ok: true, article: created });
});

app.put("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Articles.getById(id)) return res.status(404).json({ error: "Maqola topilmadi" });
  const { data, error } = parseArticleInput(req.body || {}, { forId: id });
  if (error) return res.status(400).json({ error });
  const updated = Articles.update(id, data);
  console.log("✏️ Maqola tahrirlandi:", updated.slug, `(${updated.status})`);
  res.json({ ok: true, article: updated });
});

app.delete("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Articles.getById(id)) return res.status(404).json({ error: "Maqola topilmadi" });
  Articles.remove(id);
  console.log("🗑️ Maqola o'chirildi:", id);
  res.json({ ok: true });
});

// ---- Rasm yuklash (maqola muqovasi) ------------------------------------------
app.post("/api/admin/upload", requireAdmin, imageUpload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Rasm yuklanmadi" });
  res.json({ ok: true, url: `/media/${req.file.filename}` });
});

// ---- Multer/umumiy xatolarni chiroyli qaytarish ------------------------------
app.use((err, _req, res, _next) => {
  if (err) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "Fayl hajmi 15 MB dan oshmasligi kerak"
        : err.message || "Server xatosi";
    return res.status(400).json({ error: msg });
  }
  res.status(500).json({ error: "Server xatosi" });
});

// ---- Production'da tayyor client'ni serve qilish ------------------------------
const clientDist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  // --- SEO: maqola sahifalarini DB'dan server-side render qilamiz -------------
  // (static'dan OLDIN — robotlar to'liq matnni JS'siz ko'radi).

  // Dinamik sitemap — DB'dagi published maqolalar bilan.
  app.get("/sitemap.xml", (_req, res) => {
    try {
      res.type("application/xml").send(buildSitemap(Articles.listPublished()));
    } catch {
      res.sendFile(path.join(clientDist, "sitemap.xml"));
    }
  });

  // Ro'yxat sahifasi.
  app.get("/maqolalar", (_req, res, next) => {
    if (!hasTemplate()) return next();
    try {
      res.type("html").send(renderList(Articles.listPublished()));
    } catch (e) {
      console.warn("⚠️ SSR (ro'yxat) xatosi:", e.message);
      next();
    }
  });

  // Texnik talabdagi /maqolalar/<slug> — asosiy /article/<slug> ga yo'naltiramiz.
  app.get("/maqolalar/:slug", (req, res) =>
    res.redirect(301, `/article/${req.params.slug}`)
  );

  // Bitta maqola sahifasi.
  app.get("/article/:slug", (req, res, next) => {
    if (!hasTemplate()) return next();
    const a = Articles.getPublishedBySlug(req.params.slug);
    if (!a) return next(); // topilmasa — SPA 404 sahifasi ko'rsatadi
    try {
      res.type("html").send(renderArticle(a));
    } catch (e) {
      console.warn("⚠️ SSR (maqola) xatosi:", e.message);
      next();
    }
  });

  // extensions:["html"] — toza URL beradi (maxfiylik.html, shartlar.html).
  app.use(express.static(clientDist, { extensions: ["html"] }));
  // Qolgan (client-side) yo'llar uchun SPA fallback.
  app.get("*", (_req, res) =>
    res.sendFile(path.join(clientDist, "index.html"))
  );
}

app.listen(PORT, () =>
  console.log(`✅ Digital CFO API http://localhost:${PORT}`)
);
