# Digital CFO — Handoff (topshirish hujjati)

> Oxirgi yangilanish: 2026-07-07. Bir sessiyada bajarilgan ishlar, joriy holat va
> keyingi qadamlar. Yangi ishlovchi shu hujjatdan kontekstni tiklashi mumkin.
>
> Bu sessiya asosan **sayt maqolalari tizimini to'liq professional SEO CMS'ga
> (CMS v2)** aylantirishga bag'ishlandi, hamda bot va sayt UI'siga bir nechta
> yaxshilanishlar kiritildi.

---

## 1. Maqsad

Digital CFO — korxona moliyaviy hisobotlarini (1C Shakl 1/Shakl 2) avtomatik
tahlil qiluvchi AI platforma. Ikki ustun:

1. **Moliyaviy tahlil yadrosi** — Excel → 48 ko'rsatkich (Altman Z, likvidlik,
   rentabellik, barqarorlik, aylanuvchanlik, o'sish) → professional PDF hisobot.
2. **AI Sales & Onboarding Agent ("Maliya")** — Telegram botdagi leadlarni
   voronka bo'ylab yetaklaydi.

**Bu sessiya maqsadi:** digitalcfo.uz uchun WordPress/Ghost darajasidagi
**SEO-ga optimallashtirilgan maqolalar CMS'i** qurish (qidiruvda top-1 uchun);
bot `/reports_formulalar` chiqishini yaxshilash; UI sayqallash (navbar, dark mode).

---

## 2. Loyiha tuzilishi (2 ta alohida repo)

| | Sayt | Bot |
|---|---|---|
| Nom | `digital-cfo-fullstack` | `CFO_final` |
| Lokal yo'l | `C:\Users\lenovo\OneDrive\Desktop\digital-cfo-fullstack` | `C:\Users\lenovo\Downloads\CFO_final` |
| GitHub | `NodirbekGaniyev14/digital-cfo-fullstack` | `NodirbekGaniyev14/CFO_final` |
| Texnologiya | React + Vite (client) + Express (server) + Python engine | Python (python-telegram-bot v21) |
| Server | **UZCLOUD VPS** · `/var/www/digital-cfo` · nginx + PM2 (`digital-cfo`) | **DigitalOcean Droplet** `134.122.69.214` · `/opt/digital-cfo` · systemd |
| Deploy | **Qo'lda (git):** `git pull && npm run build && pm2 restart digital-cfo` | **rsync-asosli** (git EMAS!) — CI: push → test → rsync → `systemctl restart`; qo'lda `scp` + restart |

> ⚠️ **Sayt vs Bot deploy farqi:** Sayt VPS'da **git checkout** — `git pull`
> ishlaydi. Bot serveri **rsync bilan** o'rnatilgan — u yerda `git pull` YO'Q
> (git repo emas). Botni qo'lda deploy: lokaldan `scp bot.py root@134.122.69.214:/opt/digital-cfo/`
> + `ssh ... "chown cfo:cfo bot.py; systemctl restart digital-cfo"`.
>
> ⚠️ **Muhim:** moliyaviy engine IKKI joyda dublikatlangan — bot'da va sayt'da
> (`server/engine/*`). Har tuzatish IKKALASIGA qo'llanishi shart. Texnik qarz.

---

## 3. Joriy holat

### Sayt — Maqolalar CMS v2 (asosiy ish)
Maqolalar tizimi **statik fayldan** (`client/src/data/articles.js`) **SQLite DB +
to'liq admin panelga** ko'chirildi. Deyarli butun PRD amalga oshirildi.

**Ishlayapti / JONLI (deploy qilingan):**
- `digitalcfo.uz/blog` — maqolalar ro'yxati (qidiruv, "Yangi/Ommabop" saralash,
  featured pin, teg filtri); `digitalcfo.uz/blog/<slug>` — bitta maqola.
- Eski `/article/<slug>` va `/maqolalar` → **301 redirect** `/blog`ga.
- **SSR + SEO:** har maqola server-side render qilinadi (robotlar JS'siz ko'radi)
  + JSON-LD (BlogPosting/FAQ/Breadcrumb/Organization) + OG/Twitter/canonical/robots
  + dinamik `sitemap.xml`.
- **Admin panel** `/admin` (login: `admin` / parol `.env`da): Dashboard (statistika),
  Maqolalar (CRUD), Kategoriyalar (CRUD), Media library. **TipTap** rich-text editor
  (jadval/rasm/video/kod), SEO maydonlar + "SEO sog'lig'i" paneli, FAQ builder,
  mualliflar (avatar/bio), teglar, publish holatlari (draft/published/**scheduled**/
  archived), rasm optimallash (`sharp` → webp), views hisoblagich, **versiya tarixi +
  autosave**.
- Newsletter obuna (lead capture), PDF yuklab olish (print), TOC (sticky), share tugmalar.

**Deploy holati (DIQQAT):**
- Jonli: TipTap, SEO, FAQ, TOC, teglar, mualliflar, newsletter, media, dashboard,
  revision/autosave (crash-fix bilan) — deploy qilingan.
- **Push qilingan, deploy tasdiqlanmagan:** kategoriya CRUD (`b7497fc`), SEO sog'lig'i
  paneli (`4c007ff`).
- **Commit qilingan, PUSH qilinmagan:** dark mode palitrasi (`3f6de35`).

### Bot
- `/reports_formulalar` (va `/formulalar`) endi barcha hisob-kitob fayllarini
  **bitta ZIP arxivda** yuboradi (`index.txt` metama'lumot bilan). **Jonli.**

### Sayt — AI kontent generatori (DCOS, Faza 1) — YANGI
`/admin` editoriga **DCOS** (DigitalCFO AI Content Operating System v1.0) asosidagi
AI maqola generatori qo'shildi. DCOS — 10 qismli enterprise SEO kontent system prompt
(`server/prompts/dcos.md`, ~6900 so'z). Editorda "✨ AI bilan yaratish" paneli: mavzu +
kalit so'z + uzunlik kiritiladi → Claude to'liq maqola (title, slug, HTML matn, SEO
maydonlar, teglar, FAQ, muqova ALT + rasm prompti) qaytaradi → forma maydonlariga
to'ldiriladi (inson ko'rib, tahrirlab saqlaydi). Strukturaviy chiqish "tool use" bilan;
HTML faqat Tiptap qo'llagan teglar (h2/h3/p/ul/ol/table…). Prompt caching yoqilgan.
- **Holat:** kod tayyor, build+server sinovdan o'tdi. **Ishlashi uchun `ANTHROPIC_API_KEY`
  kerak** (yo'q bo'lsa panel jimgina "o'chirilgan" holatda ko'rinadi — graceful).

### Sayt — Avtopilot (DCOS Faza 2) — YANGI
Rejalashtirilgan avtomatik maqola generatsiyasi. `/admin/autopilot` sahifasi: mavzu
navbati (topic queue) boshqaruvi, yoqish/o'chirish toggle, nashr rejimi (draft/scheduled/
published), "hozir bitta yaratish" (test), ishga tushirish jurnali. Scheduler kunlik 4
slotda ishlaydi (08:00/12:25/17:00/20:30 Toshkent), kategoriya rotatsiyasi bilan navbatdan
mavzu oladi → DCOS orqali maqola yaratadi → **standart holatda `draft`** qilib qo'yadi
(inson chop etadi). Dedup (sarlavha), sanitize (`cleanHtml`), unikal slug qo'llanadi.
- **Xavfsizlik:** standart holatda **O'CHIQ** (`settings.autopilot_enabled='0'`) —
  kutilmagan xarajat yo'q. Yoqilishi uchun `ANTHROPIC_API_KEY` + admin panelda toggle.
- **Yangi DB:** `settings`, `autopilot_topics`, `autopilot_runs` jadvallari.
- **Yangi fayl:** `server/autopilot.js`. **Holat:** kod tayyor, build+server+DB sinovdan
  o'tdi (haqiqiy generatsiya kalit yo'qligi sabab sinalmagan).

### Sayt — Social paket (DCOS Part 7, Faza 3) + Sifat nazorati (Part 9) — YANGI
- **Social paket:** har maqola uchun 13 kanal kontenti (LinkedIn/Telegram/Instagram/X/
  email/Reels/Shorts/podkast/hashtag) generatsiyasi. Editorda "Social paket" paneli
  (tahrirlash rejimida): "Yaratish" → JSON DB'ga (`articles.social_json`) saqlanadi va
  copy-paste uchun ko'rsatiladi. `server/anthropic.js` → `generateSocialPackage` (tool).
  **Tashqi platformalarga avto-post YO'Q** (OAuth/kredensiallar kerak — "Faza 3b").
- **Sifat nazorati (quality gate):** maqolani DCOS 10 mezoni bo'yicha 0–100 baholaydi
  (`scoreArticle` tool). Editorда "Sifat bahosi" paneli (manual). Avtopilotda ixtiyoriy
  q-gate: baho `qgateMin`dan past bo'lsa maqola avtomatik qayta yoziladi (≤2 marta,
  eng yaxshi versiya saqlanadi); 'published' rejimда past baho → xavfsizlik uchun draft.
  Baho `articles.quality_score`da saqlanadi.
- **Yangi:** `client/src/admin/SocialPanel.jsx`, `QualityPanel.jsx`. **Holat:** kod tayyor,
  build+server+DB sinovdan o'tdi (haqiqiy generatsiya kalit yo'qligi sabab sinalmagan).

### Yoqilmagan / kutilmoqda (oldingi sessiyalardan)
- 🔴 **Bot tokeni REVOKE qilinmagan** — avvalgi suhbatda oshkor bo'lgan.
- 🟠 **Event Engine (agent)** — `ENGINE_ENABLED=1` + `backfill_stages.py --apply` kerak.
- 🟠 **`ANTHROPIC_API_KEY` yo'q** — AI kontent generatori (DCOS) uchun kerak; qo'shilsa
  `/admin` da AI panel avtomatik yoqiladi. Xarajat: har maqola generatsiyasi Claude API.

---

## 4. Ustida ishlangan fayllar (bu sessiya)

### Sayt — server (`digital-cfo-fullstack/server`)
- **Yangi:** `db.js` (better-sqlite3 — `articles`+ authors/categories/tags/faqs/
  subscribers/revisions jadvallari, sanitize-html, seed, CRUD, Categories/Tags/
  Authors/Subscribers/Revisions helperlar), `auth.js` (JWT login + requireAdmin),
  `ssr.js` (SEO runtime render + dinamik sitemap), `load-env.js` (.env avtomatik o'qish).
- **O'zgartirilgan:** `index.js` (public + admin API, JWT, SSR route'lar,
  /blog+301, rasm yuklash/media, newsletter, kategoriya CRUD, revision, dashboard
  stats, scheduler), `.env.example` (ADMIN_USERNAME/PASSWORD/JWT_SECRET).
- **Yangi paketlar:** `better-sqlite3`, `jsonwebtoken`, `sanitize-html`, `sharp`
  (ikkitasi native modul).

### Sayt — client (`digital-cfo-fullstack/client/src`)
- **Yangi (public):** `data/articles.js` (seed manbai + helperlar), `lib/api.js`,
  `lib/seo.jsx`, `lib/schema.js`, `pages/ArticlesIndex.jsx`, `pages/Article.jsx`,
  `pages/NotFound.jsx`, `components/ArticleCard.jsx`, `ShareButtons.jsx`,
  `TableOfContents.jsx`, `NewsletterForm.jsx`.
- **Yangi (admin `src/admin/`):** `AdminApp.jsx`, `AdminLogin.jsx`, `AdminShell.jsx`,
  `AdminList.jsx`, `AdminEditor.jsx`, `AdminDashboard.jsx`, `AdminMedia.jsx`,
  `AdminCategories.jsx`, `TiptapEditor.jsx`, `SeoHealth.jsx`.
- **O'zgartirilgan:** `App.jsx` (react-router + admin lazy + /blog), `landing/Navbar.jsx`
  (Maqolalar havolasi, bir qatorli xl), `landing/Footer.jsx`, `index.css`
  (article-prose, tiptap, print, **dark palitra**), `lib/i18n.jsx` (nav.articles).
- **Yangi paketlar:** `react-router-dom`, `@tiptap/*` (react/starter-kit/extension-*/
  pm), `react-quill-new` (endi ishlatilmaydi — o'chirsa bo'ladi).

### Bot (`CFO_final`)
- **O'zgartirilgan:** `bot.py` — `cmd_reports_formulalar` bitta ZIP yasaydi
  (`io`, `zipfile` importlari qo'shildi).

---

## 5. Kiritilgan o'zgarishlar (asosiy bloklar)

1. **Maqolalar → SQLite DB + admin CMS** — statik `articles.js` o'rniga DB;
   `/admin` JWT bilan; mavjud 6 maqola startda avtomatik seed qilinadi.
2. **CMS v2 (PRD bo'yicha bosqichma-bosqich):** TipTap editor · SEO maydonlar +
   JSON-LD + SSR · FAQ builder · reading time · publish/scheduled/views · TOC ·
   share · featured/popular · qidiruv · teglar · mualliflar (avatar/bio) ·
   newsletter · media library · PDF · Dashboard · revision+autosave · kategoriya
   CRUD · lokal "SEO sog'lig'i" paneli (Yoast uslubida, kalitsiz).
3. **URL `/article/<slug>` → `/blog/<slug>`** (canonical), eski URL'lardan 301.
4. **Bot `/reports_formulalar` → bitta ZIP** (avval har fayl alohida edi).
5. **Navbar bir qatorda** (`whitespace-nowrap` + `xl` breakpoint; 8 element sig'di).
6. **`load-env.js`** — server `.env`ni o'zi o'qiydi (PM2 env-keshi muammosini hal
   qildi; keyingi deploylarda oddiy `pm2 restart` yetarli).
7. **Dark mode palitrasi** — 5 xil tarqoq navy-qora → yagona "Refined Midnight"
   (aniq elevation: fon `#0a0e1a`, karta `#141b2e`; slate-tinted chegara; matn
   iyerarxiyasi WCAG AA). Brand azure/emerald saqlandi; light rejim o'zgarmadi.

---

## 6. Sinab ko'rilgan, ammo natija bermagan usullar

- **Statik prerender (`scripts/prerender.mjs`)** — dastlab har maqola uchun build
  vaqtida statik HTML yaratildi. DB-asosli CMS'ga o'tilgach ortiqcha bo'ldi
  (admin runtime'da maqola yaratadi) → **runtime SSR** (`ssr.js`) bilan almashtirildi,
  prerender.mjs o'chirildi.
- **PM2 env keshi** — `.env`ni yangilagach oddiy `pm2 restart` yangi qiymatlarni
  (ADMIN_PASSWORD/JWT_SECRET) O'QIMADI (admin panel "Admin sozlanmagan" berdi).
  Vaqtinchalik: `set -a; . ./server/.env; set +a; pm2 restart --update-env`.
  Doimiy yechim: **`load-env.js`** (server .env'ni o'zi parse qiladi).
- **Editor crash `User is not defined`** — `User` ikonkasi AdminEditor'da import
  qilinmagan edi; faqat avatarsiz muallifli maqolada bilindi (JONLI bug edi!).
  → import qo'shildi.
- **Dark `dark:bg-[#hex]` arbitrary qiymatlar** 21 faylda tarqoq — CSS o'zgaruvchi
  orqali toza override qilib bo'lmadi → butun `client/src` bo'ylab **sed hex
  almashtirish** bilan hal qilindi.
- **`preview_eval` ba'zan `location.pathname` ni noto'g'ri ("/") qaytardi** —
  preview-tab eskirishi (stale) tufayli. → Haqiqiy holat `preview_snapshot` /
  `preview_screenshot` bilan tekshirildi.
- **Git conflict deploy'da (`client/package-lock.json`)** — serverdagi `npm install`
  lock'ni o'zgartirgani uchun `git pull` to'xtadi. → `git checkout -- ...package-lock.json`
  dan so'ng pull.
- **Bash heredoc/inline JSON** apostrof va `<` bilan buzildi (shell escaping). →
  JSON scratchpad faylga yozildi + `curl -d @file`.
- **`git pull` bot serverida ishlamaydi** — bot rsync bilan o'rnatilgan (git repo
  emas), repo private (raw curl 404). → bot deploy `scp` + restart bilan.

---

## 7. Keyingi qadam

**Sayt CMS (shu sessiya davomi):**
1. **Dark mode'ni deploy qiling** (commit `3f6de35` push qilinmagan): push →
   VPS'da `git checkout -- client/package-lock.json server/package-lock.json &&
   git pull && npm run build && pm2 restart digital-cfo`.
2. Kategoriya CRUD + SEO sog'lig'i (`b7497fc`, `4c007ff`) jonliligini tasdiqlang.
3. **Google Search Console + Yandex Webmaster**'ga `digitalcfo.uz/sitemap.xml`
   yuboring (yangi `/blog` URL'lar tez indekslanishi uchun).
4. **AI kontent generatori (DCOS, Faza 1) + Avtopilot (Faza 2) — QURILDI.** Yoqish
   uchun VPS `server/.env` ga `ANTHROPIC_API_KEY` (ixtiyoriy `ANTHROPIC_MODEL`,
   standart `claude-sonnet-5`) qo'shing → `pm2 restart digital-cfo`. Keyin: (a)
   `/admin` editorда AI panel; (b) `/admin/autopilot` da navbatga mavzu qo'shib,
   toggle bilan yoqing (standart draft rejim); (c) editorда "Social paket" va "Sifat
   bahosi" panellari; (d) avtopilotда social + quality-gate toggle'lari.
   **DCOS Faza 1–3 + quality-gate qurildi.** Qolgan (ixtiyoriy): social avto-post
   (Faza 3b — platforma OAuth/kredensiallari kerak).
5. (Tozalash) `react-quill-new` paketi endi ishlatilmaydi — `npm uninstall` mumkin.

**Oldingi sessiyalardan (hali dolzarb):**
6. 🔴 **Bot tokenini REVOKE qiling** (@BotFather → Revoke → yangi token `.env`ga).
7. 🟠 **Event Engine (agent)** — `.env`: `ENGINE_ENABLED=1` + `backfill_stages.py --apply`.
8. Xavfsizlik: helmet CSP yoqish; `/api/leads` timing-safe; `npm audit fix`.
9. Texnik qarz: engine dublikatsiyasini (bot vs sayt) yagona paketga birlashtirish.

---

## 8. Muhim eslatmalar (CMS v2)

- **Admin deploy talabi:** VPS `server/.env` da **`ADMIN_PASSWORD` + `JWT_SECRET`**
  bo'lishi SHART (aks holda admin panel o'chiq, login 503). `ADMIN_USERNAME`
  ixtiyoriy (standart `admin`). JWT_SECRET yaratish:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- **Native modullar:** `better-sqlite3` va `sharp` — deploy'da `npm run build`
  (server install) ularni yig'adi (Ubuntu'da odatda prebuilt binary, muammosiz).
- **DB + media gitignored:** `server/data/articles.db*` va `server/media/*` runtime
  holati (git'ga tushmaydi). DB **kunlik Telegram zaxiraga** qo'shilgan (WAL
  checkpoint bilan). Startda bo'sh DB `articles.js` dan seed qilinadi.
- **Kontent endi DB'da:** seeddan keyin `articles.js` ni tahrirlash jonli saytga
  ta'sir qilMAYDI — barcha maqolalar `/admin` orqali boshqariladi.
- **URL:** maqola canonical `/blog/<slug>`. Ro'yxat `/blog`.
- **Test:** har o'zgarishdan keyin saytda `npm run build`; botda `pytest`.
- **Vaqt zonasi:** Toshkent (UTC+5) hamma joyda.
