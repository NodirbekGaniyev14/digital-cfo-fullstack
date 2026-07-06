// Admin autentifikatsiyasi — bitta admin, JWT token.
// Login/parol .env dan olinadi (ADMIN_USERNAME / ADMIN_PASSWORD), taqqoslash
// timing-safe. Muvaffaqiyatda 7 kunlik JWT beriladi; /api/admin/* uni tekshiradi.

import jwt from "jsonwebtoken";
import { timingSafeEqual } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET || "";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// Sozlanganmi? (ADMIN_PASSWORD va JWT_SECRET .env da bo'lishi shart)
export function authConfigured() {
  return Boolean(ADMIN_PASSWORD && JWT_SECRET);
}

export function loginHandler(req, res) {
  if (!authConfigured()) {
    return res.status(503).json({
      error: "Admin sozlanmagan. .env ga ADMIN_PASSWORD va JWT_SECRET qo'shing.",
    });
  }
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  const okUser = safeEqual(username, ADMIN_USERNAME);
  const okPass = safeEqual(password, ADMIN_PASSWORD);
  if (!okUser || !okPass) {
    return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
  }
  const token = jwt.sign({ role: "admin", u: username }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ ok: true, token });
}

// /api/admin/* uchun himoya middleware.
export function requireAdmin(req, res, next) {
  if (!authConfigured()) {
    return res.status(503).json({ error: "Admin sozlanmagan" });
  }
  const hdr = req.get("authorization") || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : "";
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") throw new Error("role");
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Avtorizatsiya talab qilinadi" });
  }
}
