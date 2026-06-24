# Digital CFO — AI Moliyaviy Tahlil Platformasi

To'liq full-stack marketing sayti (O'zbek tilida). **React + Vite + Tailwind CSS** frontend va **Express** backend.

---

## Tech stack

**Client**
- React 18 + Vite
- Tailwind CSS (brand dizayn-tizimi: navy / azure / emerald)
- framer-motion — animatsiyalar
- lucide-react — ikonkalar
- shadcn/ui uslubidagi komponentlar (Button, Input, Textarea, Label, Accordion)
- sonner — toast bildirishnomalar

**Server**
- Express + Multer (fayl yuklash: `.xlsx`, `.xls`, `.csv`, maks 15 MB)
- Xavfsizlik: `helmet`, `express-rate-limit`, honeypot, email validatsiya, sozlanadigan CORS
- `POST /api/analyze` — yuklangan Excel/CSV'ni o'qib KPI'larni real hisoblaydi (likvidlik, rentabellik, qarz, ROA/ROE, salomatlik balli). Fayl tahlildan keyin o'chiriladi
- `POST /api/contact` — kontakt/lead formasi (fayl bilan); so'rovlar `leads.json`'ga saqlanadi
- Telegram bildirishnoma — yangi so'rov kelganda admin'ga xabar (env orqali)
- `GET /api/leads` — yuborilgan so'rovlar (admin token yoki localhost)
- `GET /api/health` — holat tekshiruvi

---

## Tuzilma

```
digital-cfo-fullstack/
├─ client/
│  ├─ public/
│  │  └─ Namuna_Moliyaviy_Hisobot.pdf   # "Namuna ko'rish" / "Namunani yuklab olish"
│  └─ src/
│     ├─ pages/Home.jsx                 # barcha bo'limlar shu yerda
│     ├─ components/landing/            # 13 ta bo'lim komponenti
│     │  ├─ Navbar.jsx
│     │  ├─ HeroSection.jsx
│     │  ├─ ProblemSolution.jsx
│     │  ├─ HowItWorks.jsx
│     │  ├─ Roadmap.jsx
│     │  ├─ Services.jsx
│     │  ├─ KPIAnalytics.jsx
│     │  ├─ PDFReport.jsx
│     │  ├─ Pricing.jsx
│     │  ├─ FAQ.jsx
│     │  ├─ ContactForm.jsx
│     │  ├─ DashboardPreview.jsx
│     │  └─ Footer.jsx
│     ├─ components/ui/                 # shadcn-style komponentlar
│     ├─ lib/ (utils, motion presets)
│     └─ api/base44Client.js
└─ server/
   └─ index.js                         # Express API
```

---

## Ishga tushirish

### 1. Backend (Express)
```bash
cd server
npm install
npm run dev        # http://localhost:4000
```

### 2. Frontend (Vite)
```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

Vite dev-server `/api` so'rovlarini avtomatik `localhost:4000` ga yo'naltiradi (proxy).

### Production build (lokal sinov)
```bash
npm run build      # server+client deps o'rnatadi va client/dist yaratadi
npm start          # node server/index.js — Express dist'ni ham serve qiladi
```
So'ng sayt to'liq `http://localhost:4000` da ishlaydi (bitta xizmat: API + frontend).

---

## Deploy (bitta Node xizmat)

Express tayyor frontend (`client/dist`) ni ham, `/api` ni ham bitta domendan serve qiladi —
shuning uchun CORS shart emas va Telegram ishlaydi.

> **UZCLOUD VPS** uchun to'liq qadam-baqadam yo'riqnoma: [`deploy/DEPLOY.md`](deploy/DEPLOY.md)
> (tayyor `setup.sh`, nginx va PM2 konfiguratsiyasi bilan).

**Render / Railway sozlamalari** (`render.yaml` allaqachon tayyor):
- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Health check:** `/api/health`
- **Environment variables** (Dashboard'da kiritiladi — `.env` deploy'ga ketmaydi):
  ```
  NODE_ENV=production
  TELEGRAM_BOT_TOKEN=...
  TELEGRAM_CHAT_ID=...
  CORS_ORIGIN=            # bitta domen bo'lsa bo'sh qoldiring
  ADMIN_TOKEN=            # /api/leads himoyasi uchun (ixtiyoriy)
  ```
  `PORT` ni host avtomatik beradi — qo'lda kiritmang.

**Domen (`digitalcfo.uz`):**
1. Avval deploy qiling — host vaqtinchalik URL beradi (`*.onrender.com`).
2. Domen tayyor bo'lgach, host panelida "Custom domain" qo'shing va `uzdc.uz` DNS'ida
   A/CNAME yozuvlarini host bergan qiymatga sozlang.
3. Kоddagi `https://digitalcfo.uz` placeholder allaqachon shu domenга mos —
   boshqa domen bo'lsa, `client/index.html`, `client/public/sitemap.xml`,
   `client/public/robots.txt` dagi manzilni yangilang.

> ⚠️ **Saqlash:** bepul hosting fayl tizimi vaqtinchalik — `leads.json` va `uploads/`
> redeploy'da o'chadi. Bu muammo emas, chunki har bir so'rov **Telegram'ga** (matn + fayl)
> darhol yetkaziladi. Doimiy arxiv kerak bo'lsa — DB yoki doimiy disk ulang.

> 📷 **OG-rasm:** ijtimoiy tarmoqlarda chiroyli preview uchun `og-image.svg` ni 1200×630
> **PNG**ga eksport qilib, `client/index.html` dagi `og:image`/`twitter:image` ni yangilang.

---

## Sozlamalar

`.env` (client, ixtiyoriy):
```
VITE_API_URL=/api
```

`.env` (server) — namuna uchun `server/.env.example` ga qarang:
```
PORT=4000
NODE_ENV=development
CORS_ORIGIN=                 # production domenlari (vergul bilan)
ADMIN_TOKEN=                 # /api/leads himoyasi
TELEGRAM_BOT_TOKEN=          # @BotFather
TELEGRAM_CHAT_ID=            # @userinfobot
```
Telegram sozlanmasa, bildirishnoma jim o'tkazib yuboriladi (sayt baribir ishlaydi).

---

## Aloqa
- Telefon: +998 90 239 28 28
- Email: n.ganiyev2007@gmail.com
- Telegram: t.me/Moliyaviy_Tahlilchi_bot
- WhatsApp: wa.me/998911622545
- Manzil: Toshkent, O'zbekiston
