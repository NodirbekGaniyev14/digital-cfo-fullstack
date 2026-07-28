import "./load-env.js"; // ENG BIRINCHI — .env ni auth.js/ssr.js dan oldin yuklaydi
import express from "express";
import sharp from "sharp";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { timingSafeEqual, createHash } from "node:crypto";
import db, { Articles, Authors, Tags, Categories, Subscribers, Revisions, AutopilotTopics, SocialPosts, PageViews, cleanHtml, uniqueSlug } from "./db.js";
import { loginHandler, requireAdmin } from "./auth.js";
import { renderArticle, renderList, renderHome, buildSitemap, hasTemplate } from "./ssr.js";
import { aiEnabled, generateArticle, generateSocialPackage, scoreArticle } from "./anthropic.js";
import { startAutopilot, autopilotStatus, setAutopilotSettings, seedStarterTopics, runGuarded } from "./autopilot.js";
import { publisherStatus, publishArticleSocial, autoPostArticleTelegram } from "./publisher.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === "production";

const app = express();
app.set("trust proxy", 1); // reverse-proxy ortida to'g'ri IP olish uchun

// ---- Gzip siqish -------------------------------------------------------------
// nginx faqat text/html ni siqadi (gzip_types default), shuning uchun JS/CSS
// siqilmay ketardi (~533 KB bundle). Node darajasida siqamiz — nginx uni
// o'zgarishsiz uzatadi. `x-no-compression` sarlavhasi — debug uchun.
app.use(
  compression({
    threshold: 1024,
    filter: (req, res) =>
      req.headers["x-no-compression"] ? false : compression.filter(req, res),
  })
);

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
app.use("/media", express.static(mediaDir, { maxAge: "7d" }));

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
// Xotirada qabul qilamiz, so'ng sharp bilan optimallab diskka yozamiz.
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok =
      IMG_EXT.includes(path.extname(file.originalname).toLowerCase()) &&
      file.mimetype.startsWith("image/");
    cb(ok ? null : new Error("Faqat rasm fayllari (jpg, png, webp)"), ok);
  },
});

// Rasmni optimallab (webp, maks 1600px) media papkasiga yozadi, URL qaytaradi.
async function saveOptimizedImage(file) {
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ext = path.extname(file.originalname).toLowerCase();
  // SVG/GIF — animatsiya/vektor, sharp bilan buzilmasin: asl holicha saqlaymiz.
  if (ext === ".svg" || ext === ".gif") {
    const name = `${base}${ext}`;
    await fs.promises.writeFile(path.join(mediaDir, name), file.buffer);
    return `/media/${name}`;
  }
  const name = `${base}.webp`;
  await sharp(file.buffer)
    .rotate() // EXIF orientatsiyasini to'g'rilash
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(mediaDir, name));
  return `/media/${name}`;
}

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
// CSV YO'Q: tahlil dvigateli (engine/parser.py) faqat Excel o'qiydi. CSV'ni
// qabul qilib keyin "tahlil amalga oshmadi" deyish o'rniga kirishda aniq
// xabar beramiz.
const ALLOWED_EXT = [".xlsx", ".xls"];
const ALLOWED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/octet-stream", // ba'zi brauzerlar xls uchun shuni yuboradi
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
        : new Error("Faqat Excel fayl (.xlsx yoki .xls) qabul qilinadi"),
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
// Qaytaradi: true — barcha yuklangan fayllar Telegram'ga hujjat sifatida yetib
// bordi (lokal nusxani o'chirish xavfsiz); false — yetib bormadi (diskda qolsin).
async function notifyTelegram(lead, files = []) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false; // sozlanmagan — fayllar diskda qoladi

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
    let allDelivered = true;
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
      if (!docRes.ok) {
        allDelivered = false;
        console.warn("⚠️ Telegram fayl javobi:", docRes.status);
      }
    }
    return allDelivered;
  } catch (err) {
    console.warn("⚠️ Telegram yuborilmadi:", err.message);
    return false;
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

// Rejalashtirilgan maqolalar (scheduled) — vaqti kelganda avtomatik chop etamiz.
function runScheduler() {
  try {
    const ids = Articles.publishDue();
    if (ids.length) {
      console.log(`🕒 ${ids.length} ta rejalashtirilgan maqola chop etildi`);
      // Telegram avto-post (bepul rejim; toggle o'chiq bo'lsa jim o'tadi, hech qachon throw qilmaydi)
      (async () => {
        for (const id of ids) await autoPostArticleTelegram(Articles.getById(id));
      })();
    }
  } catch (err) {
    console.warn("⚠️ Scheduler xatosi:", err.message);
  }
}
runScheduler(); // startda bir marta
setInterval(runScheduler, 60 * 1000); // har daqiqa

// Avtopilot (DCOS Faza 2) — standart holatda O'CHIQ; yoqilsa slotlarda ishlaydi.
startAutopilot();

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
    // Fayllar Telegram'ga hujjat sifatida YETIB BORGACH lokal nusxa o'chiriladi
    // (maxfiylik: mijoz balansi serverda muddatsiz yotmasin). Yetib bormasa
    // (token yo'q / tarmoq xatosi) — diskda qoladi, yagona nusxa yo'qolmasin.
    notifyTelegram(lead, uploaded).then((delivered) => {
      if (delivered && uploaded.length) cleanupFiles();
    });

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
  Articles.hydrate(a); // faqs + tags + author_obj
  Articles.incrementViews(a.id); // ko'rishlar hisoblagichi
  res.json({ article: a });
});

// ---- Sayt tashriflari analitikasi (maxfiylikka mos, o'zimizniki) --------------
// Toshkent sanasi (YYYY-MM-DD) — analitika kunini birlashtirish uchun.
function tashkentYmd() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" });
}
// Tashrifchi identifikatori: IP+UA ning KUNLIK-tuzli hashi. Kunlik tuz (salt)
// tufayli u har kuni o'zgaradi — barqaror kuzatuv EMAS, faqat kunlik noyoblik uchun.
function visitorHash(req, ymd) {
  const salt = process.env.JWT_SECRET || "dcfo";
  const ua = req.get("user-agent") || "";
  return createHash("sha256").update(`${salt}|${ymd}|${req.ip}|${ua}`).digest("hex").slice(0, 16);
}

// Tashrif beacon'i uchun yumshoq rate-limit (bot spam'ini cheklaydi).
const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: false,
  legacyHeaders: false,
  message: {},
});

// Public: sahifa ko'rishini qayd etadi (frontend har route almashganda chaqiradi).
app.post("/api/track", trackLimiter, (req, res) => {
  try {
    let p = String(req.body?.path || "/").split("?")[0].slice(0, 300) || "/";
    // Admin va API yo'llarini hisoblamaymiz — faqat public sahifalar.
    if (p.startsWith("/admin") || p.startsWith("/api")) return res.json({ ok: true });
    const ymd = tashkentYmd();
    PageViews.record({ path: p, visitor: visitorHash(req, ymd), ymd });
  } catch (e) {
    /* analitika hech qachon foydalanuvchini buzmasin */
  }
  res.json({ ok: true });
});

// Public: teglar ro'yxati (frontend filtr uchun)
app.get("/api/tags", (_req, res) => res.json({ tags: Tags.all() }));

// ---- Newsletter obuna (public) -----------------------------------------------
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." },
});
app.post("/api/subscribe", subscribeLimiter, (req, res) => {
  if (clean(req.body?.website)) return res.json({ ok: true }); // honeypot
  const email = clean(req.body?.email, 160).toLowerCase();
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Email manzili noto'g'ri" });
  const source = clean(req.body?.source, 80);
  const added = Subscribers.add(email, source);
  if (added) console.log("📧 Yangi obunachi:", email);
  res.json({ ok: true, already: !added });
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
const VALID_STATUS = ["draft", "published", "scheduled", "archived"];

// Kiruvchi maqola ma'lumotlarini tekshirish va tozalash.
function parseArticleInput(body, { forId = null } = {}) {
  const title = clean(body.title, 200);
  if (!title) return { error: "Sarlavha majburiy" };
  const status = VALID_STATUS.includes(body.status) ? body.status : "draft";
  const slugBase = clean(body.slug, 200) || title;
  const slug = uniqueSlug(slugBase, forId);
  // FAQ'lar — massiv, har biri {question, answer}
  const faqs = Array.isArray(body.faqs)
    ? body.faqs
        .map((f) => ({ question: clean(f.question, 300), answer: cleanHtml(f.answer || "") }))
        .filter((f) => f.question)
        .slice(0, 30)
    : [];
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
      cover_alt: clean(body.cover_alt, 300),
      cover_caption: clean(body.cover_caption, 300),
      author: clean(body.author, 120) || "Digital CFO",
      author_avatar: clean(body.author_avatar, 500),
      author_bio: clean(body.author_bio, 600),
      tags: Array.isArray(body.tags) ? body.tags.map((t) => clean(t, 40)).filter(Boolean) : [],
      status,
      published_at: clean(body.published_at, 40) || null,
      is_featured: body.is_featured ? 1 : 0,
      seo_title: clean(body.seo_title, 200),
      seo_description: clean(body.seo_description, 320),
      focus_keyword: clean(body.focus_keyword, 120),
      canonical_url: clean(body.canonical_url, 500),
      robots_index: body.robots_index === 0 || body.robots_index === false ? 0 : 1,
      robots_follow: body.robots_follow === 0 || body.robots_follow === false ? 0 : 1,
      faqs,
    },
  };
}

app.get("/api/admin/articles", requireAdmin, (_req, res) => {
  res.json({ articles: Articles.listAll() });
});

app.get("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const a = Articles.getById(Number(req.params.id));
  if (!a) return res.status(404).json({ error: "Maqola topilmadi" });
  Articles.hydrate(a); // faqs + tags + author_obj (tahrirlash formasi uchun)
  res.json({ article: a });
});

// Editor uchun meta: mavjud mualliflar, teglar, kategoriyalar (datalist).
app.get("/api/admin/meta", requireAdmin, (_req, res) => {
  res.json({ authors: Authors.list(), tags: Tags.all(), categories: Categories.names() });
});

// ---- AI kontent generatori (DCOS) --------------------------------------------
// ANTHROPIC_API_KEY bo'lmasa — o'chiq (status:false). Editor buni tekshirib panelni
// ko'rsatadi/yashiradi. Generatsiya qimmat/sekin bo'lgani uchun rate-limit qo'yildi.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p AI so'rovi. Birozdan so'ng qayta urinib ko'ring." },
});

app.get("/api/admin/ai/status", requireAdmin, (_req, res) => {
  res.json({ enabled: aiEnabled() });
});

app.post("/api/admin/ai/generate", requireAdmin, aiLimiter, async (req, res) => {
  if (!aiEnabled()) {
    return res.status(503).json({ error: "AI o'chirilgan. server/.env ga ANTHROPIC_API_KEY qo'shing." });
  }
  const topic = clean(req.body?.topic, 300);
  if (!topic) return res.status(400).json({ error: "Mavzu majburiy" });
  const keyword = clean(req.body?.keyword, 120);
  const category = clean(req.body?.category, 80);
  const length = clean(req.body?.length, 20);
  const notes = clean(req.body?.notes, 1000);
  try {
    const article = await generateArticle({ topic, keyword, category, length, notes });
    console.log("🤖 AI maqola generatsiya qilindi:", topic);
    res.json({ ok: true, article });
  } catch (err) {
    console.warn("⚠️ AI generatsiya xatosi:", err.message);
    res.status(502).json({ error: err.message || "AI generatsiya muvaffaqiyatsiz" });
  }
});

// ---- Avtopilot (DCOS Faza 2) -------------------------------------------------
app.get("/api/admin/autopilot", requireAdmin, (_req, res) => {
  res.json(autopilotStatus());
});

app.post("/api/admin/autopilot/settings", requireAdmin, (req, res) => {
  const enabled = req.body?.enabled === undefined ? undefined : Boolean(req.body.enabled);
  const mode = req.body?.mode === undefined ? undefined : clean(req.body.mode, 20);
  const social = req.body?.social === undefined ? undefined : Boolean(req.body.social);
  const qgate = req.body?.qgate === undefined ? undefined : Boolean(req.body.qgate);
  const qgateMin = req.body?.qgateMin === undefined ? undefined : Number(req.body.qgateMin);
  const telegram = req.body?.telegram === undefined ? undefined : Boolean(req.body.telegram);
  res.json(setAutopilotSettings({ enabled, mode, social, qgate, qgateMin, telegram }));
});

app.get("/api/admin/autopilot/topics", requireAdmin, (_req, res) => {
  res.json({ topics: AutopilotTopics.list() });
});

app.post("/api/admin/autopilot/topics", requireAdmin, (req, res) => {
  const topic = clean(req.body?.topic, 300);
  if (!topic) return res.status(400).json({ error: "Mavzu majburiy" });
  const added = AutopilotTopics.add({
    topic,
    keyword: clean(req.body?.keyword, 120),
    category: clean(req.body?.category, 80),
    length: clean(req.body?.length, 20) || "standard",
  });
  res.json({ ok: true, topic: added });
});

app.delete("/api/admin/autopilot/topics/:id", requireAdmin, (req, res) => {
  AutopilotTopics.remove(Number(req.params.id));
  res.json({ ok: true });
});

app.post("/api/admin/autopilot/topics/:id/retry", requireAdmin, (req, res) => {
  AutopilotTopics.retry(Number(req.params.id));
  res.json({ ok: true });
});

// Mavzudan bo'sh qoralama yaratish — QO'LDA yozish yo'li (AI/API kalitisiz ishlaydi).
// Sarlavha/kalit so'z/kategoriya mavzudan to'ldiriladi; mavzu navbatdan chiqadi (done).
app.post("/api/admin/autopilot/topics/:id/draft", requireAdmin, (req, res) => {
  const t = AutopilotTopics.get(Number(req.params.id));
  if (!t) return res.status(404).json({ error: "Mavzu topilmadi" });
  if (t.status === "done" && t.article_id)
    return res.json({ ok: true, articleId: t.article_id, existing: true });
  if (Articles.titleExists(t.topic))
    return res.status(409).json({ error: "Bu sarlavhali maqola allaqachon mavjud" });
  const created = Articles.insert({
    title: String(t.topic).slice(0, 200),
    slug: uniqueSlug(t.topic),
    excerpt: "",
    content: "<p></p>",
    category: String(t.category || "").slice(0, 80),
    author: "Digital CFO",
    status: "draft",
    published_at: null,
    seo_title: "",
    seo_description: "",
    focus_keyword: String(t.keyword || "").slice(0, 120),
    cover_alt: "",
    cover_caption: "",
    tags: [],
    faqs: [],
  });
  AutopilotTopics.markDone(t.id, created.id);
  console.log("✍️ Mavzudan qo'lda qoralama:", created.slug);
  res.json({ ok: true, articleId: created.id });
});

app.post("/api/admin/autopilot/seed-starter", requireAdmin, (_req, res) => {
  const added = seedStarterTopics();
  res.json({ ok: true, added, topics: AutopilotTopics.list() });
});

// Qo'lda bitta generatsiya (test uchun) — navbatdan keyingi mavzuni yaratadi.
app.post("/api/admin/autopilot/run", requireAdmin, aiLimiter, async (_req, res) => {
  if (!aiEnabled()) {
    return res.status(503).json({ error: "AI o'chirilgan. server/.env ga ANTHROPIC_API_KEY qo'shing." });
  }
  const result = await runGuarded({ slot: "manual", manual: true });
  res.json(result);
});

// ---- Social paket (DCOS Part 7 — Faza 3) -------------------------------------
app.get("/api/admin/articles/:id/social", requireAdmin, (req, res) => {
  const a = Articles.getById(Number(req.params.id));
  if (!a) return res.status(404).json({ error: "Maqola topilmadi" });
  res.json({ social: Articles.getSocial(a.id) });
});

app.post("/api/admin/articles/:id/social/generate", requireAdmin, aiLimiter, async (req, res) => {
  if (!aiEnabled()) {
    return res.status(503).json({ error: "AI o'chirilgan. server/.env ga ANTHROPIC_API_KEY qo'shing." });
  }
  const a = Articles.getById(Number(req.params.id));
  if (!a) return res.status(404).json({ error: "Maqola topilmadi" });
  try {
    const contentText = String(a.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000);
    const social = await generateSocialPackage({
      title: a.title,
      excerpt: a.excerpt,
      keyword: a.focus_keyword,
      url: `https://digitalcfo.uz/blog/${a.slug}`,
      contentText,
    });
    Articles.setSocial(a.id, social);
    console.log("📣 Social paket yaratildi:", a.slug);
    res.json({ ok: true, social });
  } catch (err) {
    console.warn("⚠️ Social generatsiya xatosi:", err.message);
    res.status(502).json({ error: err.message || "Social generatsiya muvaffaqiyatsiz" });
  }
});

// ---- Social tarqatish (DCOS Faza 3b) -----------------------------------------
app.get("/api/admin/social/status", requireAdmin, (_req, res) => {
  res.json(publisherStatus());
});

app.get("/api/admin/articles/:id/social/posts", requireAdmin, (req, res) => {
  res.json({ posts: SocialPosts.forArticle(Number(req.params.id)) });
});

app.post("/api/admin/articles/:id/social/publish", requireAdmin, async (req, res) => {
  const platforms = Array.isArray(req.body?.platforms) ? req.body.platforms.map((p) => clean(p, 20)).filter(Boolean) : null;
  const force = Boolean(req.body?.force);
  try {
    const result = await publishArticleSocial(Number(req.params.id), { platforms, force });
    console.log("📤 Social tarqatildi:", req.params.id, JSON.stringify(result.results || []));
    res.json({ ok: true, ...result });
  } catch (err) {
    console.warn("⚠️ Social tarqatish xatosi:", err.message);
    res.status(400).json({ error: err.message || "Tarqatish muvaffaqiyatsiz" });
  }
});

// ---- Sifat bahosi (DCOS Part 9 — Quality Gate) -------------------------------
app.post("/api/admin/articles/:id/quality", requireAdmin, aiLimiter, async (req, res) => {
  if (!aiEnabled()) {
    return res.status(503).json({ error: "AI o'chirilgan. server/.env ga ANTHROPIC_API_KEY qo'shing." });
  }
  const a = Articles.getById(Number(req.params.id));
  if (!a) return res.status(404).json({ error: "Maqola topilmadi" });
  try {
    const contentText = String(a.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);
    const result = await scoreArticle({ title: a.title, contentText, keyword: a.focus_keyword });
    Articles.setQuality(a.id, result.total);
    console.log(`🏅 Sifat bahosi: ${a.slug} → ${result.total}/100`);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.warn("⚠️ Sifat baholash xatosi:", err.message);
    res.status(502).json({ error: err.message || "Baholash muvaffaqiyatsiz" });
  }
});

// ---- Kategoriyalar CRUD (admin) ----------------------------------------------
app.get("/api/admin/categories", requireAdmin, (_req, res) => {
  res.json({ categories: Categories.list() });
});
app.post("/api/admin/categories", requireAdmin, (req, res) => {
  const name = clean(req.body?.name, 80);
  if (!name) return res.status(400).json({ error: "Nom majburiy" });
  const c = Categories.create(name);
  if (!c) return res.status(409).json({ error: "Bunday kategoriya allaqachon bor" });
  res.json({ ok: true, category: c });
});
app.put("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const name = clean(req.body?.name, 80);
  if (!name) return res.status(400).json({ error: "Nom majburiy" });
  const c = Categories.rename(Number(req.params.id), name);
  if (!c) return res.status(404).json({ error: "Topilmadi" });
  res.json({ ok: true, category: c });
});
app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  Categories.remove(Number(req.params.id));
  res.json({ ok: true });
});

app.post("/api/admin/articles", requireAdmin, (req, res) => {
  const { data, error } = parseArticleInput(req.body || {});
  if (error) return res.status(400).json({ error });
  const created = Articles.insert(data);
  console.log("📝 Yangi maqola:", created.slug, `(${created.status})`);
  if (created.status === "published") autoPostArticleTelegram(created); // bepul avto-post (toggle o'chiq bo'lsa jim)
  res.json({ ok: true, article: created });
});

app.put("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const prev = Articles.getById(id);
  if (!prev) return res.status(404).json({ error: "Maqola topilmadi" });
  const { data, error } = parseArticleInput(req.body || {}, { forId: id });
  if (error) return res.status(400).json({ error });
  const updated = Articles.update(id, data);
  console.log("✏️ Maqola tahrirlandi:", updated.slug, `(${updated.status})`);
  // Faqat draft/scheduled → published O'TISHIDA avto-post (eski maqola tahririda emas).
  if (updated.status === "published" && prev.status !== "published") autoPostArticleTelegram(updated);
  res.json({ ok: true, article: updated });
});

app.delete("/api/admin/articles/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Articles.getById(id)) return res.status(404).json({ error: "Maqola topilmadi" });
  Articles.remove(id);
  console.log("🗑️ Maqola o'chirildi:", id);
  res.json({ ok: true });
});

// ---- Versiya tarixi (revisions) ----------------------------------------------
app.get("/api/admin/articles/:id/revisions", requireAdmin, (req, res) => {
  res.json({ revisions: Revisions.list(Number(req.params.id)) });
});
app.get("/api/admin/revisions/:revId", requireAdmin, (req, res) => {
  const r = Revisions.get(Number(req.params.revId));
  if (!r) return res.status(404).json({ error: "Versiya topilmadi" });
  res.json({ revision: r });
});

// ---- Rasm yuklash (maqola muqovasi / matn ichidagi rasmlar) ------------------
app.post("/api/admin/upload", requireAdmin, imageUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Rasm yuklanmadi" });
  try {
    const url = await saveOptimizedImage(req.file);
    res.json({ ok: true, url });
  } catch (err) {
    console.warn("⚠️ Rasm optimallashda xato:", err.message);
    res.status(400).json({ error: "Rasmni qayta ishlab bo'lmadi" });
  }
});

// ---- Media library (yuklangan rasmlar) ---------------------------------------
app.get("/api/admin/media", requireAdmin, (_req, res) => {
  let files = [];
  try {
    files = fs
      .readdirSync(mediaDir)
      .filter((n) => IMG_EXT.includes(path.extname(n).toLowerCase()))
      .map((n) => {
        const st = fs.statSync(path.join(mediaDir, n));
        return { name: n, url: `/media/${n}`, size: st.size, mtime: st.mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime);
  } catch (err) {
    console.warn("⚠️ Media o'qishda xato:", err.message);
  }
  res.json({ media: files });
});

app.delete("/api/admin/media/:name", requireAdmin, (req, res) => {
  const name = path.basename(req.params.name || ""); // path traversal himoyasi
  if (!name || !IMG_EXT.includes(path.extname(name).toLowerCase())) {
    return res.status(400).json({ error: "Noto'g'ri fayl" });
  }
  const target = path.join(mediaDir, name);
  if (!fs.existsSync(target)) return res.status(404).json({ error: "Topilmadi" });
  try {
    fs.unlinkSync(target);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "O'chirib bo'lmadi" });
  }
});

// ---- Obunachilar (admin) -----------------------------------------------------
app.get("/api/admin/subscribers", requireAdmin, (_req, res) => {
  res.json({ count: Subscribers.count(), subscribers: Subscribers.list() });
});

// ---- Dashboard statistikasi (admin) ------------------------------------------
app.get("/api/admin/stats", requireAdmin, (_req, res) => {
  const all = Articles.listAll();
  const byStatus = (s) => all.filter((a) => a.status === s).length;
  const totalViews = all.reduce((n, a) => n + (a.views || 0), 0);
  const top = all
    .filter((a) => a.status === "published")
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((a) => ({ id: a.id, title: a.title, slug: a.slug, views: a.views || 0 }));
  const newest = [...all]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map((a) => ({ id: a.id, title: a.title, slug: a.slug, status: a.status, created_at: a.created_at }));
  let media = 0;
  try {
    media = fs.readdirSync(mediaDir).filter((n) => IMG_EXT.includes(path.extname(n).toLowerCase())).length;
  } catch { /* ignore */ }
  res.json({
    total: all.length,
    published: byStatus("published"),
    draft: byStatus("draft"),
    scheduled: byStatus("scheduled"),
    archived: byStatus("archived"),
    views: totalViews,
    subscribers: Subscribers.count(),
    media,
    top,
    newest,
  });
});

// Sayt tashriflari analitikasi — umumiy tashrifchi, ko'rishlar, kunlik dinamika.
app.get("/api/admin/analytics", requireAdmin, (req, res) => {
  const days = Math.min(90, Math.max(7, Number(req.query.days) || 30));
  res.json(PageViews.summary(days, tashkentYmd()));
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

  // --- Robotlar va AI agentlar uchun matn fayllari ---------------------------
  // Lighthouse SPA fallback'ga tushib qolmasligi (llms.txt) va sekin fayl
  // qidiruvi tufayli timeout bo'lmasligi (robots.txt) uchun aniq yo'llar.
  for (const name of ["robots.txt", "llms.txt"]) {
    app.get(`/${name}`, (_req, res, next) => {
      const file = path.join(clientDist, name);
      if (!fs.existsSync(file)) return next();
      res.type("text/plain; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600");
      res.sendFile(file);
    });
  }

  // Dinamik sitemap — DB'dagi published maqolalar bilan.
  app.get("/sitemap.xml", (_req, res) => {
    try {
      res.type("application/xml").send(buildSitemap(Articles.listPublished()));
    } catch {
      res.sendFile(path.join(clientDist, "sitemap.xml"));
    }
  });

  // Bosh sahifa — SSR. Avval bo'sh #root berilardi (robot 0 so'z ko'rardi);
  // endi to'liq marketing matni + FAQ schema JS'siz ham ko'rinadi.
  app.get("/", (_req, res, next) => {
    if (!hasTemplate()) return next();
    try {
      res.type("html").send(renderHome());
    } catch (e) {
      console.warn("⚠️ SSR (bosh sahifa) xatosi:", e.message);
      next(); // fallback: express.static index.html (SPA)
    }
  });

  // Ro'yxat sahifasi — /blog.
  app.get("/blog", (_req, res, next) => {
    if (!hasTemplate()) return next();
    try {
      res.type("html").send(renderList(Articles.listPublished()));
    } catch (e) {
      console.warn("⚠️ SSR (ro'yxat) xatosi:", e.message);
      next();
    }
  });

  // Bitta maqola sahifasi — /blog/<slug>.
  app.get("/blog/:slug", (req, res, next) => {
    if (!hasTemplate()) return next();
    const a = Articles.getPublishedBySlug(req.params.slug);
    if (!a) return next(); // topilmasa — SPA 404 sahifasi ko'rsatadi
    try {
      Articles.hydrate(a); // faqs (FAQ Schema) + tags + author_obj
      // O'xshash maqolalar: avval shu kategoriyadan, yetmasa eng yangilardan
      // (Article.jsx dagi mantiq bilan bir xil — SSR va SPA bir narsani ko'rsatsin).
      const pool = Articles.listPublished().filter((r) => r.slug !== a.slug);
      const related = [
        ...pool.filter((r) => r.category && r.category === a.category),
        ...pool.filter((r) => !r.category || r.category !== a.category),
      ].slice(0, 3);
      res.type("html").send(renderArticle(a, related));
    } catch (e) {
      console.warn("⚠️ SSR (maqola) xatosi:", e.message);
      next();
    }
  });

  // --- Eski URL'lardan 301 redirect (SEO uzluksizligi) ---
  app.get("/maqolalar", (_req, res) => res.redirect(301, "/blog"));
  app.get("/maqolalar/:slug", (req, res) => res.redirect(301, `/blog/${req.params.slug}`));
  app.get("/article/:slug", (req, res) => res.redirect(301, `/blog/${req.params.slug}`));

  // /assets/* — nomida kontent hash bor (index-CNA9PBHt.js), demak mazmuni
  // o'zgarsa nom ham o'zgaradi. 1 yil immutable kesh: qayta tashrifda 0 so'rov.
  app.use(
    "/assets",
    express.static(path.join(clientDist, "assets"), {
      immutable: true,
      maxAge: "1y",
    })
  );

  // extensions:["html"] — toza URL beradi (maxfiylik.html, shartlar.html).
  // Qolgan statik fayllar (favicon, og-image, pdf, demo.mp4) — 1 kun kesh.
  // HTML esa keshlanmaydi: deploy'dan keyin eski hash'li asset'ga ishora
  // qiluvchi sahifa qolib ketmasligi kerak.
  app.use(
    express.static(clientDist, {
      extensions: ["html"],
      maxAge: "1d",
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) res.set("Cache-Control", "no-cache");
      },
    })
  );
  // Qolgan (client-side) yo'llar uchun SPA fallback.
  app.get("*", (_req, res) =>
    res.sendFile(path.join(clientDist, "index.html"))
  );
}

app.listen(PORT, () =>
  console.log(`✅ Digital CFO API http://localhost:${PORT}`)
);
