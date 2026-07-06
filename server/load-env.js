// server/.env ni ishga tushishda avtomatik o'qiydi — PM2, oddiy `node`, yoki
// `--env-file` bilan ham ishlaydi. Node versiyasidan qat'i nazar, tashqi paketsiz.
//
// MUHIM: bu modul index.js dagi ENG BIRINCHI import bo'lishi kerak — auth.js/ssr.js
// process.env ni import vaqtida o'qiydi, shuning uchun ular yuklanishidan oldin
// qiymatlar joyida bo'lishi shart.
//
// Mavjud process.env qiymatlari USTUN (override qilinmaydi) — ya'ni PM2 yoki
// --env-file bergan qiymatlar saqlanadi, .env faqat yetishmayotganlarini to'ldiradi.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), ".env");

try {
  if (fs.existsSync(envPath)) {
    const text = fs.readFileSync(envPath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue; // izohlar (#...) va bo'sh qatorlar o'tkazib yuboriladi
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
} catch (err) {
  console.warn("⚠️ .env o'qib bo'lmadi:", err.message);
}
