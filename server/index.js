import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";

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
  const pdfPath = path.join(uploadDir, `report-${Date.now()}.pdf`);
  const cleanup = () => {
    paths.forEach((p) => fs.promises.unlink(p).catch(() => {}));
    fs.promises.unlink(pdfPath).catch(() => {});
  };

  const args = [ENGINE, ...paths, "--lang", "uz", "--pdf", pdfPath];
  execFile(
    PYTHON_BIN,
    args,
    { timeout: 60000, maxBuffer: 12 * 1024 * 1024 },
    (err, stdout) => {
      if (err && !stdout) {
        console.warn("⚠️ Tahlil (python) xatosi:", err.message);
        cleanup();
        return res
          .status(500)
          .json({ error: "Tahlil amalga oshmadi. Fayl formatini tekshiring." });
      }
      let data;
      try {
        data = JSON.parse(String(stdout).trim());
      } catch {
        cleanup();
        return res.status(500).json({ error: "Natijani o'qib bo'lmadi." });
      }
      if (!data.ok) {
        cleanup();
        return res
          .status(400)
          .json({ error: data.error || "Tahlil amalga oshmadi" });
      }
      // Bot bilan bir xil PDF — javobga base64 sifatida qo'shamiz, so'ng o'chiramiz.
      let pdfBase64 = "";
      try {
        pdfBase64 = fs.readFileSync(pdfPath).toString("base64");
      } catch {}
      cleanup();
      res.json({ ...data, pdfBase64 });
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
  if (!token || req.get("x-stats-token") !== token) {
    return res.status(403).json({ error: "Ruxsat yo'q" });
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
  app.use(express.static(clientDist));
  app.get("*", (_req, res) =>
    res.sendFile(path.join(clientDist, "index.html"))
  );
}

app.listen(PORT, () =>
  console.log(`✅ Digital CFO API http://localhost:${PORT}`)
);
