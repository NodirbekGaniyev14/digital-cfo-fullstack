// Maqolalar (blog) ma'lumotlar bazasi — SEO uchun asosiy kontent manbai.
//
// MUHIM: bu fayl SOF ma'lumot (React yo'q) — uni ham React sahifalari, ham
// build-time prerender skripti (scripts/prerender.mjs, Node) import qiladi.
// Shu sababli bu yerda faqat oddiy JS/HTML ishlatiladi (JSX yo'q).
//
// Har bir maqola alohida sahifada ochiladi:  /article/<slug>
// Ro'yxat sahifasi:                          /maqolalar
//
// SEO tamoyillari (top-1 uchun):
//  - slug'da kalit so'z (masalan /article/likvidlik-koeffitsienti)
//  - title 50–60 belgi, description 150–160 belgi
//  - har maqolada H1 bitta, mantiqiy H2/H3 iyerarxiya
//  - FAQ bloklari → Google "rich results" (FAQ schema prerenderda qo'shiladi)
//  - ichki havolalar (relatedSlugs) → sayt ichida "link juice" tarqaladi

export const SITE_URL = "https://digitalcfo.uz";
export const BOT_URL = "https://t.me/Moliyaviy_Tahlilchi_bot";

// Sana matnini o'zbekcha "6-yanvar, 2026" ko'rinishida chiqarish.
const MONTHS_UZ = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];
export function formatDateUz(iso) {
  const d = new Date(iso);
  return `${d.getUTCDate()}-${MONTHS_UZ[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

// CTA — har maqola oxirida takrorlanadigan blok (HTML).
const CTA = `
<div class="article-cta">
  <h3>Hisobotingizni bepul tahlil qildiring</h3>
  <p>Balans (Shakl 1) va Moliyaviy natijalar (Shakl 2) faylini yuboring — Digital CFO 50 dan ortiq ko'rsatkichni avtomatik hisoblab, kuchli va zaif tomonlaringizni va aniq tavsiyalarni tayyor PDF hisobot ko'rinishida qaytaradi.</p>
  <p><a href="${BOT_URL}" rel="noopener">Telegram bot orqali boshlash →</a></p>
</div>`;

export const ARTICLES = [
  // ========================================================================
  {
    slug: "moliyaviy-tahlil-nima",
    title: "Moliyaviy tahlil nima va u nima uchun kerak?",
    description:
      "Moliyaviy tahlil nima, qanday turlari bor va korxona uchun nima uchun zarur — likvidlik, rentabellik va barqarorlikni oddiy tilda tushuntiramiz.",
    keywords: [
      "moliyaviy tahlil", "moliyaviy tahlil nima", "korxona moliyaviy holati",
      "balans tahlili", "moliyaviy ko'rsatkichlar",
    ],
    category: "Asoslar",
    icon: "LineChart",
    datePublished: "2026-01-12",
    dateModified: "2026-01-12",
    readingMinutes: 7,
    excerpt:
      "Moliyaviy tahlil — bu korxona raqamlarini «sog'liq tekshiruvi»ga aylantirish. Nima ekanligini, turlarini va nega har bir biznesga kerakligini tushuntiramiz.",
    relatedSlugs: ["likvidlik-koeffitsienti", "rentabellik-korsatkichlari"],
    faq: [
      {
        q: "Moliyaviy tahlil uchun qanday hujjatlar kerak?",
        a: "Asosan ikkita hisobot yetarli: Buxgalteriya balansi (Shakl 1) va Moliyaviy natijalar to'g'risidagi hisobot (Shakl 2). Ko'p ko'rsatkichlar aynan shu ikki hujjat asosida hisoblanadi.",
      },
      {
        q: "Moliyaviy tahlilni buxgaltersiz o'zim qila olamanmi?",
        a: "Ha. Digital CFO kabi avtomatik tizim faylni o'qib, ko'rsatkichlarni hisoblab, ularni oddiy tilda izohlab beradi — buxgalteriya bilimisiz ham natijani tushunasiz.",
      },
      {
        q: "Tahlil qanchalik tez-tez o'tkazilishi kerak?",
        a: "Kamida choraklik (3 oyda bir marta) tavsiya etiladi. Shunda tendensiyalarni — o'sish yoki tushishni — o'z vaqtida ko'rasiz.",
      },
    ],
    body: `
<p><strong>Moliyaviy tahlil</strong> — bu korxonaning buxgalteriya hisobotlaridagi «quruq» raqamlarni biznes uchun tushunarli xulosalarga aylantirish jarayoni. U savolga javob beradi: <em>korxona sog'lommi yoki xavf ostidami?</em> Xuddi shifokor tahlil natijalariga qarab bemorning holatini baholagani kabi, moliyaviy tahlil ham raqamlar ortidagi haqiqiy holatni ko'rsatadi.</p>

<h2>Moliyaviy tahlil nima uchun kerak?</h2>
<p>Raqamlarning o'zi hech narsa demaydi. «Foydamiz 500 million so'm» degani yaxshimi yoki yomonmi? Bu aylanmaga, aktivlarga va o'tgan davrga bog'liq. Moliyaviy tahlil aynan shu kontekstni beradi. U yordamida siz:</p>
<ul>
  <li>korxona qarzlarini o'z vaqtida to'lay oladimi yoki yo'qligini (<strong>likvidlik</strong>);</li>
  <li>biznes qancha foyda keltirayotganini (<strong>rentabellik</strong>);</li>
  <li>korxona qarzlarga qanchalik bog'liqligini (<strong>moliyaviy barqarorlik</strong>);</li>
  <li>resurslar qanchalik samarali ishlayotganini (<strong>aylanuvchanlik</strong>);</li>
  <li>bankrotlik xavfi bor-yo'qligini (<strong>Altman Z-Score</strong>) bilib olasiz.</li>
</ul>

<h2>Moliyaviy tahlilning asosiy turlari</h2>
<h3>1. Gorizontal tahlil</h3>
<p>Ko'rsatkichlarni davrlar bo'yicha solishtiradi: bu yilgi daromad o'tgan yilga nisbatan qancha o'sdi yoki kamaydi. Tendensiyani ko'rish uchun eng oddiy usul.</p>

<h3>2. Vertikal tahlil</h3>
<p>Har bir moddaning umumiy summadagi ulushini ko'rsatadi. Masalan, xarajatlar daromadning necha foizini tashkil qiladi. Struktura muammolarini topishga yordam beradi.</p>

<h3>3. Koeffitsientli tahlil</h3>
<p>Eng kuchli usul — turli moddalarni bir-biriga bo'lib, mazmunli nisbatlarni chiqaradi. Aynan shu yerda likvidlik, rentabellik va barqarorlik koeffitsientlari hisoblanadi.</p>

<h2>Asosiy ko'rsatkichlar guruhlari</h2>
<table>
  <thead><tr><th>Guruh</th><th>Nimani o'lchaydi</th><th>Misol</th></tr></thead>
  <tbody>
    <tr><td>Likvidlik</td><td>Qarzni to'lash qobiliyati</td><td>Joriy likvidlik koeffitsienti</td></tr>
    <tr><td>Rentabellik</td><td>Foydalilik darajasi</td><td>ROA, ROE, ROS</td></tr>
    <tr><td>Barqarorlik</td><td>Qarzga bog'liqlik</td><td>Avtonomiya koeffitsienti</td></tr>
    <tr><td>Aylanuvchanlik</td><td>Resurs samaradorligi</td><td>Aktivlar aylanuvchanligi</td></tr>
    <tr><td>Risk</td><td>Bankrotlik ehtimoli</td><td>Altman Z-Score</td></tr>
  </tbody>
</table>

<h2>Amalda bu qanday ko'rinadi?</h2>
<p>Aytaylik, korxonangizning joriy likvidlik koeffitsienti 0,8 ga teng. Bu shuni anglatadiki, qisqa muddatli qarzlarni to'lash uchun aylanma mablag'lar yetarli emas — bu ogohlantiruvchi belgi. Agar bu ko'rsatkich 1,5–2,5 oralig'ida bo'lsa, korxona qarzlarini bemalol qoplay oladi. Tahlilning kuchi ham shunda: bitta raqam sizga aniq harakat yo'nalishini beradi.</p>

<blockquote>Moliyaviy tahlil — bu «o'tmishni ayblash» emas, balki «kelajakni boshqarish» quroli. U muammoni kech bo'lmasidan ko'rsatadi.</blockquote>

${CTA}
`,
  },

  // ========================================================================
  {
    slug: "likvidlik-koeffitsienti",
    title: "Likvidlik koeffitsientlari: joriy, tezkor, mutlaq",
    description:
      "Likvidlik koeffitsienti nima, joriy/tezkor/mutlaq likvidlik qanday hisoblanadi va me'yoriy qiymatlari qancha — formulalar va misollar bilan.",
    keywords: [
      "likvidlik koeffitsienti", "joriy likvidlik", "tezkor likvidlik",
      "mutlaq likvidlik", "likvidlik formulasi", "to'lov qobiliyati",
    ],
    category: "Likvidlik",
    icon: "Droplets",
    datePublished: "2026-01-15",
    dateModified: "2026-01-15",
    readingMinutes: 8,
    excerpt:
      "Likvidlik — korxonaning qarzlarini o'z vaqtida to'lay olish qobiliyati. Uchta asosiy koeffitsient, ularning formulalari va me'yoriy qiymatlari.",
    relatedSlugs: ["moliyaviy-tahlil-nima", "moliyaviy-barqarorlik"],
    faq: [
      {
        q: "Joriy likvidlik koeffitsienti qancha bo'lishi kerak?",
        a: "Me'yoriy qiymat 1,5–2,5 oralig'ida. 1 dan past bo'lsa — korxona qisqa muddatli qarzlarini qoplay olmasligi mumkin. 3 dan yuqori bo'lsa — aylanma mablag'lar samarasiz ishlayotgan bo'lishi mumkin.",
      },
      {
        q: "Likvidlik va to'lov qobiliyati bir xil narsami?",
        a: "Yaqin, lekin bir xil emas. Likvidlik — aktivlarni tez pulga aylantirish qobiliyati. To'lov qobiliyati — umuman barcha majburiyatlarni qoplay olish. Likvidlik to'lov qobiliyatining qisqa muddatli o'lchovidir.",
      },
      {
        q: "Nega tezkor likvidlik joriy likvidlikdan past bo'ladi?",
        a: "Chunki tezkor likvidlikdan zaxiralar (tovar-moddiy boyliklar) chiqarib tashlanadi — ular eng sekin pulga aylanadigan aktiv. Shu sababli tezkor koeffitsient deyarli har doim joriydan kichik bo'ladi.",
      },
    ],
    body: `
<p><strong>Likvidlik</strong> — bu korxonaning aktivlarini tez pulga aylantirib, qisqa muddatli qarzlarini o'z vaqtida to'lash qobiliyati. Agar korxona foyda ko'rsatayotgan bo'lsa-yu, lekin hisob-kitob qilishga puli bo'lmasa, u baribir jiddiy xavf ostida. Aynan shuning uchun likvidlik — moliyaviy tahlilning eng muhim bo'limlaridan biri.</p>

<h2>Uchta asosiy likvidlik koeffitsienti</h2>

<h3>1. Joriy likvidlik koeffitsienti (Current Ratio)</h3>
<p>Eng ko'p ishlatiladigan ko'rsatkich. Barcha aylanma aktivlarni qisqa muddatli majburiyatlarga bo'ladi.</p>
<p><strong>Formula:</strong> Joriy likvidlik = Aylanma aktivlar / Qisqa muddatli majburiyatlar</p>
<ul>
  <li><strong>Me'yor:</strong> 1,5 – 2,5</li>
  <li><strong>&lt; 1:</strong> qarzlarni qoplashga mablag' yetishmaydi — xavf;</li>
  <li><strong>&gt; 3:</strong> mablag'lar «ishlamay» turibdi — samaradorlik past bo'lishi mumkin.</li>
</ul>

<h3>2. Tezkor likvidlik koeffitsienti (Quick Ratio)</h3>
<p>Zaxiralarni hisobga olmaydi — chunki tovar-moddiy zaxiralarni tez sotib pulga aylantirish har doim ham oson emas. Shu bois bu «qat'iyroq» o'lchov.</p>
<p><strong>Formula:</strong> Tezkor likvidlik = (Aylanma aktivlar − Zaxiralar) / Qisqa muddatli majburiyatlar</p>
<ul>
  <li><strong>Me'yor:</strong> 0,8 – 1,0 va undan yuqori;</li>
  <li>zaxiralarsiz ham qarzni qoplay olsa — korxona kuchli likvid holatda.</li>
</ul>

<h3>3. Mutlaq likvidlik koeffitsienti (Cash Ratio)</h3>
<p>Eng qat'iy ko'rsatkich — faqat pul mablag'lari va tez sotiladigan qisqa muddatli moliyaviy qo'yilmalarni hisobga oladi.</p>
<p><strong>Formula:</strong> Mutlaq likvidlik = (Pul mablag'lari + Qisqa muddatli qo'yilmalar) / Qisqa muddatli majburiyatlar</p>
<ul>
  <li><strong>Me'yor:</strong> 0,2 – 0,5;</li>
  <li>korxona qarzning kamida 20–25% ini «hoziroq» to'lay olishi kerak.</li>
</ul>

<h2>Solishtirma jadval</h2>
<table>
  <thead><tr><th>Koeffitsient</th><th>Nimani o'z ichiga oladi</th><th>Me'yor</th></tr></thead>
  <tbody>
    <tr><td>Joriy</td><td>Barcha aylanma aktivlar</td><td>1,5 – 2,5</td></tr>
    <tr><td>Tezkor</td><td>Zaxiralarsiz aylanma aktivlar</td><td>0,8 – 1,0</td></tr>
    <tr><td>Mutlaq</td><td>Faqat pul va qo'yilmalar</td><td>0,2 – 0,5</td></tr>
  </tbody>
</table>

<h2>Amaliy misol</h2>
<p>Korxonada: aylanma aktivlar — 300 mln so'm, shundan zaxiralar — 120 mln, pul mablag'lari — 40 mln. Qisqa muddatli majburiyatlar — 150 mln so'm.</p>
<ul>
  <li>Joriy = 300 / 150 = <strong>2,0</strong> ✅ (me'yorda)</li>
  <li>Tezkor = (300 − 120) / 150 = <strong>1,2</strong> ✅ (me'yordan yuqori)</li>
  <li>Mutlaq = 40 / 150 = <strong>0,27</strong> ✅ (me'yorda)</li>
</ul>
<p>Uchala ko'rsatkich ham sog'lom — bu korxona qisqa muddatli majburiyatlarini bemalol qoplay oladi.</p>

<blockquote>Foyda — bu fikr, pul oqimi — bu haqiqat. Likvidlik aynan shu haqiqatni o'lchaydi.</blockquote>

${CTA}
`,
  },

  // ========================================================================
  {
    slug: "altman-z-koeffitsienti",
    title: "Altman Z-Score: bankrotlik xavfini baholash",
    description:
      "Altman Z-Score nima, formulasi qanday va korxona bankrotlik xavfini qanday baholaydi — «xavfsiz», «kulrang zona» va «xavfli» chegaralari bilan.",
    keywords: [
      "altman z-score", "altman z koeffitsienti", "bankrotlik xavfi",
      "bankrotlik ehtimoli", "moliyaviy risk", "z-score formulasi",
    ],
    category: "Risk",
    icon: "ShieldAlert",
    datePublished: "2026-01-18",
    dateModified: "2026-01-18",
    readingMinutes: 7,
    excerpt:
      "Altman Z-Score — bitta raqam bilan bankrotlik xavfini baholaydigan klassik model. Formulasi, chegaralari va o'qish usuli.",
    relatedSlugs: ["moliyaviy-barqarorlik", "moliyaviy-tahlil-nima"],
    faq: [
      {
        q: "Altman Z-Score qancha bo'lsa yaxshi?",
        a: "2,99 dan yuqori — «xavfsiz zona», korxona sog'lom. 1,81–2,99 oralig'i — «kulrang zona», ehtiyot bo'lish kerak. 1,81 dan past — bankrotlik xavfi yuqori.",
      },
      {
        q: "Altman Z-Score barcha korxonalarga mos keladimi?",
        a: "Klassik model asosan ishlab chiqarish korxonalari uchun ishlab chiqilgan. Savdo va xizmat korxonalari uchun Altman keyinchalik moslashtirilgan variantlarni (Z' va Z'') taklif qilgan.",
      },
      {
        q: "Bitta koeffitsientning o'ziga ishonsa bo'ladimi?",
        a: "Yo'q. Z-Score kuchli signal, lekin uni likvidlik, rentabellik va pul oqimi tahlili bilan birga ko'rish kerak. Bir ko'rsatkich hech qachon to'liq manzarani bermaydi.",
      },
    ],
    body: `
<p><strong>Altman Z-Score</strong> — 1968-yilda professor Edvard Altman tomonidan ishlab chiqilgan model bo'lib, u korxonaning bankrotlikka yaqinligini <em>bitta yakuniy raqam</em> orqali baholaydi. Model beshta moliyaviy koeffitsientni birlashtirib, ular uchun har xil «og'irlik» beradi va yakunda umumiy ballni chiqaradi.</p>

<h2>Altman Z-Score formulasi</h2>
<p>Klassik (ishlab chiqarish korxonalari uchun) formula:</p>
<p><strong>Z = 1,2·X₁ + 1,4·X₂ + 3,3·X₃ + 0,6·X₄ + 1,0·X₅</strong></p>
<table>
  <thead><tr><th>O'zgaruvchi</th><th>Ma'nosi</th></tr></thead>
  <tbody>
    <tr><td>X₁</td><td>Sof aylanma kapital / Jami aktivlar</td></tr>
    <tr><td>X₂</td><td>Taqsimlanmagan foyda / Jami aktivlar</td></tr>
    <tr><td>X₃</td><td>Foiz va soliqqacha foyda (EBIT) / Jami aktivlar</td></tr>
    <tr><td>X₄</td><td>Xususiy kapitalning bozor qiymati / Jami majburiyatlar</td></tr>
    <tr><td>X₅</td><td>Sotuvdan tushum / Jami aktivlar</td></tr>
  </tbody>
</table>

<h2>Natijani qanday o'qish kerak?</h2>
<table>
  <thead><tr><th>Z qiymati</th><th>Zona</th><th>Ma'nosi</th></tr></thead>
  <tbody>
    <tr><td>Z &gt; 2,99</td><td>🟢 Xavfsiz</td><td>Bankrotlik ehtimoli past, korxona barqaror</td></tr>
    <tr><td>1,81 – 2,99</td><td>🟡 Kulrang zona</td><td>Noaniqlik, diqqat bilan kuzatish kerak</td></tr>
    <tr><td>Z &lt; 1,81</td><td>🔴 Xavfli</td><td>Bankrotlik xavfi yuqori</td></tr>
  </tbody>
</table>

<h2>Nega har bir koeffitsientning og'irligi har xil?</h2>
<p>Altman statistik tahlil orqali aniqladiki, ba'zi ko'rsatkichlar bankrotlikni boshqalaridan kuchliroq bashorat qiladi. Masalan, <strong>X₃ (rentabellik)</strong> ning og'irligi 3,3 — eng yuqori, chunki foyda keltira olmaydigan korxona uzoq yashamaydi. Bu — modelning kuchli tomoni: u shunchaki koeffitsientlarni qo'shmaydi, balki ularni «ahamiyatiga qarab tortadi».</p>

<h2>Amaliy misol</h2>
<p>Korxona uchun quyidagi qiymatlar chiqdi: X₁=0,15, X₂=0,20, X₃=0,10, X₄=0,50, X₅=1,10.</p>
<p>Z = 1,2·0,15 + 1,4·0,20 + 3,3·0,10 + 0,6·0,50 + 1,0·1,10 = 0,18 + 0,28 + 0,33 + 0,30 + 1,10 = <strong>2,19</strong></p>
<p>Natija <strong>kulrang zona</strong>da — korxona hozircha bankrot emas, lekin rentabellik va aylanma kapitalni yaxshilash zarur. Bu aynan o'z vaqtida olingan ogohlantirish.</p>

<blockquote>Altman Z-Score qiymati — bu «tashxis» emas, «signal». U muammoni bir necha chorak oldindan ko'rsatib bera oladi.</blockquote>

${CTA}
`,
  },

  // ========================================================================
  {
    slug: "rentabellik-korsatkichlari",
    title: "Rentabellik ko'rsatkichlari: ROA, ROE va ROS",
    description:
      "Rentabellik nima, ROA, ROE va ROS qanday hisoblanadi hamda ular korxona foydaliligini qanday ko'rsatadi — formulalar, me'yorlar va misollar.",
    keywords: [
      "rentabellik", "ROA", "ROE", "ROS", "sof foyda marjasi",
      "aktivlar rentabelligi", "kapital rentabelligi",
    ],
    category: "Rentabellik",
    icon: "TrendingUp",
    datePublished: "2026-01-21",
    dateModified: "2026-01-21",
    readingMinutes: 8,
    excerpt:
      "Rentabellik — biznes har bir so'mdan qancha foyda olayotganini ko'rsatadi. ROA, ROE va ROS: formulalar, farqlar va me'yoriy qiymatlar.",
    relatedSlugs: ["moliyaviy-tahlil-nima", "likvidlik-koeffitsienti"],
    faq: [
      {
        q: "ROA va ROE o'rtasidagi farq nima?",
        a: "ROA — barcha aktivlardan olingan foyda samaradorligi. ROE — faqat egalar (xususiy kapital) qo'ygan mablag'dan olingan foyda. ROE odatda ROA dan yuqori bo'ladi, chunki korxona qarz mablag'idan ham foydalanadi.",
      },
      {
        q: "Yaxshi ROS qancha bo'ladi?",
        a: "Bu sohaga bog'liq. Savdoda 3–5% ham yaxshi hisoblanadi, xizmat va IT sohasida esa 15–25% ga yetishi mumkin. Shuning uchun ROS ni doim raqobatchilar va soha o'rtachasi bilan solishtirish kerak.",
      },
      {
        q: "Rentabellik past bo'lsa nima qilish kerak?",
        a: "Ikkita yo'nalishda ishlash mumkin: daromadni oshirish (narx, sotuv hajmi) yoki xarajatlarni kamaytirish (tannarx, operatsion xarajatlar). Tahlil aynan qaysi biri muammo ekanini ko'rsatadi.",
      },
    ],
    body: `
<p><strong>Rentabellik</strong> — bu korxona sarflagan resurslardan qancha foyda olayotganini ko'rsatadigan ko'rsatkichlar guruhi. Aylanma katta bo'lishi mumkin, lekin agar undan foyda qolmasa, biznes samarasiz. Rentabellik aynan shu «samaradorlik»ni o'lchaydi.</p>

<h2>Uchta asosiy rentabellik ko'rsatkichi</h2>

<h3>1. ROS — Sotuvlar rentabelligi (sof foyda marjasi)</h3>
<p>Har 100 so'm tushumdan qancha sof foyda qolishini ko'rsatadi.</p>
<p><strong>Formula:</strong> ROS = Sof foyda / Sotuvdan tushum × 100%</p>
<p>Agar ROS = 12% bo'lsa — har 100 so'm sotuvdan 12 so'm sof foyda qoladi. Bu ko'rsatkich narx siyosati va xarajatlar nazorati qanchalik samarali ekanini ko'rsatadi.</p>

<h3>2. ROA — Aktivlar rentabelligi</h3>
<p>Korxona o'z aktivlaridan (bino, uskuna, zaxira, pul) qanchalik samarali foyda olayotganini ko'rsatadi.</p>
<p><strong>Formula:</strong> ROA = Sof foyda / O'rtacha jami aktivlar × 100%</p>
<p>ROA past bo'lsa — aktivlar «bekor yotibdi» yoki samarasiz ishlatilyapti degani.</p>

<h3>3. ROE — Xususiy kapital rentabelligi</h3>
<p>Egalar qo'ygan pul (xususiy kapital) qancha foyda keltirayotganini ko'rsatadi — investorlar uchun eng muhim ko'rsatkich.</p>
<p><strong>Formula:</strong> ROE = Sof foyda / O'rtacha xususiy kapital × 100%</p>
<p>ROE ni bank depoziti foizi bilan solishtirish mumkin: agar biznes depozitdan kam daromad bersa, egaga uni yuritishning iqtisodiy ma'nosi savol ostida qoladi.</p>

<h2>Solishtirma jadval</h2>
<table>
  <thead><tr><th>Ko'rsatkich</th><th>Nimaga nisbatan</th><th>Kimga muhim</th></tr></thead>
  <tbody>
    <tr><td>ROS</td><td>Sotuvga</td><td>Menejment (xarajat nazorati)</td></tr>
    <tr><td>ROA</td><td>Aktivlarga</td><td>Menejment (samaradorlik)</td></tr>
    <tr><td>ROE</td><td>Xususiy kapitalga</td><td>Egalar / investorlar</td></tr>
  </tbody>
</table>

<h2>Amaliy misol</h2>
<p>Korxona: sof foyda — 60 mln so'm, tushum — 500 mln, jami aktivlar — 400 mln, xususiy kapital — 250 mln.</p>
<ul>
  <li>ROS = 60 / 500 × 100% = <strong>12%</strong></li>
  <li>ROA = 60 / 400 × 100% = <strong>15%</strong></li>
  <li>ROE = 60 / 250 × 100% = <strong>24%</strong></li>
</ul>
<p>ROE (24%) ROA (15%) dan sezilarli yuqori — bu korxona qarz mablag'idan foydalanib, egalar kapitalining daromadliligini oshirayotganini bildiradi (moliyaviy leveraj samarasi).</p>

<blockquote>Aylanma — bu obro', foyda — bu aql, pul — bu haqiqat. Rentabellik ana shu «aql»ni raqamga aylantiradi.</blockquote>

${CTA}
`,
  },

  // ========================================================================
  {
    slug: "moliyaviy-barqarorlik",
    title: "Moliyaviy barqarorlik va avtonomiya koeffitsienti",
    description:
      "Moliyaviy barqarorlik nima, avtonomiya koeffitsienti qanday hisoblanadi va korxona qarzga qanchalik bog'liqligini qanday baholash mumkin.",
    keywords: [
      "moliyaviy barqarorlik", "avtonomiya koeffitsienti", "qarz koeffitsienti",
      "xususiy kapital", "moliyaviy mustaqillik", "leveraj",
    ],
    category: "Barqarorlik",
    icon: "Landmark",
    datePublished: "2026-01-24",
    dateModified: "2026-01-24",
    readingMinutes: 7,
    excerpt:
      "Moliyaviy barqarorlik — korxona uzoq muddatda qanchalik mustahkam turishini ko'rsatadi. Avtonomiya va qarz koeffitsientlari bilan tanishamiz.",
    relatedSlugs: ["altman-z-koeffitsienti", "likvidlik-koeffitsienti"],
    faq: [
      {
        q: "Avtonomiya koeffitsienti qancha bo'lishi kerak?",
        a: "Me'yoriy qiymat 0,5 va undan yuqori. Bu korxona aktivlarining kamida yarmi o'z mablag'i hisobidan shakllanganini bildiradi — bu moliyaviy mustaqillik belgisi.",
      },
      {
        q: "Qarz ko'p bo'lishi har doim yomonmi?",
        a: "Yo'q. O'lchangan qarz o'sishni tezlashtiradi (leveraj). Muammo — qarz haddan oshib, foiz to'lovlari foydani yeb qo'yganda va korxona majburiyatlarga qaram bo'lib qolganda boshlanadi.",
      },
      {
        q: "Barqarorlik va likvidlik farqi nimada?",
        a: "Likvidlik — qisqa muddatli qarzni to'lash qobiliyati (bugun/ertaga). Barqarorlik — uzoq muddatli mustahkamlik, kapital tuzilishi. Biri qisqa, ikkinchisi uzoq muddatli xavfsizlikni o'lchaydi.",
      },
    ],
    body: `
<p><strong>Moliyaviy barqarorlik</strong> — korxonaning uzoq muddatda mustaqil va mustahkam tura olish qobiliyati. U asosiy savolga javob beradi: korxona o'z mablag'i bilan ishlayaptimi yoki asosan qarz hisobiga «suzib» turibdimi? Barqaror korxona iqtisodiy zarbalarga bardosh beradi, barqaror bo'lmagani esa kichik silkinishdayoq qiyinchilikka tushadi.</p>

<h2>Avtonomiya koeffitsienti (moliyaviy mustaqillik)</h2>
<p>Eng muhim barqarorlik ko'rsatkichi. Aktivlarning qancha qismi xususiy kapital hisobidan shakllanganini ko'rsatadi.</p>
<p><strong>Formula:</strong> Avtonomiya = Xususiy kapital / Jami aktivlar</p>
<ul>
  <li><strong>Me'yor:</strong> ≥ 0,5;</li>
  <li>0,5 — aktivlarning yarmi o'z mablag'i, bu sog'lom balans;</li>
  <li>past qiymat — korxona qarzga kuchli bog'liq, xavf yuqori.</li>
</ul>

<h2>Qarz koeffitsienti (Debt Ratio)</h2>
<p>Avtonomiyaning «teskarisi» — aktivlarning qancha qismi qarz hisobidan ekanini ko'rsatadi.</p>
<p><strong>Formula:</strong> Qarz koeffitsienti = Jami majburiyatlar / Jami aktivlar</p>
<p>Avtonomiya va qarz koeffitsienti yig'indisi doim 1 ga teng bo'ladi. Masalan, avtonomiya 0,6 bo'lsa, qarz koeffitsienti 0,4.</p>

<h2>Moliyaviy leveraj (qarz/kapital nisbati)</h2>
<p><strong>Formula:</strong> Leveraj = Jami majburiyatlar / Xususiy kapital</p>
<p>Bu ko'rsatkich 1 dan katta bo'lsa — korxonada qarz o'z kapitalidan ko'p. Ma'lum darajada bu foydali (o'sishni tezlashtiradi), lekin haddan oshsa — xavf keskin ortadi.</p>

<h2>Solishtirma jadval</h2>
<table>
  <thead><tr><th>Ko'rsatkich</th><th>Formula</th><th>Me'yor</th></tr></thead>
  <tbody>
    <tr><td>Avtonomiya</td><td>Xususiy kapital / Aktivlar</td><td>≥ 0,5</td></tr>
    <tr><td>Qarz koeffitsienti</td><td>Majburiyatlar / Aktivlar</td><td>≤ 0,5</td></tr>
    <tr><td>Leveraj</td><td>Majburiyatlar / Xususiy kapital</td><td>≤ 1,0</td></tr>
  </tbody>
</table>

<h2>Amaliy misol</h2>
<p>Korxona: jami aktivlar — 800 mln so'm, xususiy kapital — 480 mln, majburiyatlar — 320 mln.</p>
<ul>
  <li>Avtonomiya = 480 / 800 = <strong>0,60</strong> ✅</li>
  <li>Qarz koeffitsienti = 320 / 800 = <strong>0,40</strong> ✅</li>
  <li>Leveraj = 320 / 480 = <strong>0,67</strong> ✅</li>
</ul>
<p>Uchala ko'rsatkich ham me'yorda — korxona moliyaviy jihatdan mustaqil va barqaror. Bunday korxona bankdan kredit olishda ham qulay shartlarga ega bo'ladi.</p>

<blockquote>Barqarorlik — bu «bo'ron»da cho'kmaslik qobiliyati. U qarz bilan kapital o'rtasidagi sog'lom muvozanatdan boshlanadi.</blockquote>

${CTA}
`,
  },

  // ========================================================================
  {
    slug: "1c-hisobotdan-moliyaviy-tahlil",
    title: "1C hisobotlaridan moliyaviy tahlil: Shakl 1 va Shakl 2",
    description:
      "1C dagi Buxgalteriya balansi (Shakl 1) va Moliyaviy natijalar (Shakl 2) hisobotlaridan qanday qilib to'liq moliyaviy tahlil olish mumkin — bosqichma-bosqich.",
    keywords: [
      "1c moliyaviy tahlil", "shakl 1 balans", "shakl 2 moliyaviy natijalar",
      "buxgalteriya balansi tahlili", "1c hisobot", "moliyaviy hisobot tahlili",
    ],
    category: "Amaliyot",
    icon: "FileSpreadsheet",
    datePublished: "2026-01-27",
    dateModified: "2026-01-27",
    readingMinutes: 8,
    excerpt:
      "1C dan chiqarilgan Shakl 1 va Shakl 2 hisobotlari — to'liq moliyaviy tahlil uchun yetarli. Ulardan qanday foydalanishni ko'rsatamiz.",
    relatedSlugs: ["moliyaviy-tahlil-nima", "rentabellik-korsatkichlari"],
    faq: [
      {
        q: "Tahlil uchun 1C ning qaysi hisobotlari kerak?",
        a: "Ikkita: «Buxgalteriya balansi» (Shakl 1) va «Moliyaviy natijalar to'g'risidagi hisobot» (Shakl 2). Ularni 1C dan Excel (.xlsx) ko'rinishida eksport qilish mumkin.",
      },
      {
        q: "Faqat Shakl 1 bo'lsa tahlil bo'ladimi?",
        a: "Qisman. Shakl 1 dan likvidlik va barqarorlik hisoblanadi, lekin rentabellik (ROA, ROE, ROS) uchun Shakl 2 dagi foyda va tushum kerak. To'liq tahlil uchun ikkalasini birga yuklang.",
      },
      {
        q: "Digital CFO 1C faylini avtomatik o'qiy oladimi?",
        a: "Ha. Tizim standart 1C/soliq shakllari tuzilishini taniydi, kerakli qatorlarni avtomatik topadi va 50 dan ortiq ko'rsatkichni hisoblab, tayyor PDF hisobot beradi.",
      },
    ],
    body: `
<p>O'zbekistondagi aksariyat korxonalar buxgalteriyani <strong>1C</strong> tizimida yuritadi. Yaxshi yangilik shundaki, to'liq moliyaviy tahlil uchun sizga atigi ikkita standart hisobot yetarli: <strong>Shakl 1 (Buxgalteriya balansi)</strong> va <strong>Shakl 2 (Moliyaviy natijalar to'g'risidagi hisobot)</strong>.</p>

<h2>Shakl 1 — Buxgalteriya balansi</h2>
<p>Balans korxonaning ma'lum sanadagi «suratini» beradi: nimalarga egasiz (aktivlar) va bu mablag'lar qayerdan kelgan (majburiyatlar va xususiy kapital). Undan quyidagilar hisoblanadi:</p>
<ul>
  <li><strong>Likvidlik</strong> — aylanma aktivlar va qisqa muddatli majburiyatlar asosida;</li>
  <li><strong>Barqarorlik</strong> — xususiy kapital va jami aktivlar asosida (avtonomiya);</li>
  <li><strong>Aylanma kapital</strong> — Altman Z-Score uchun ham kerak bo'ladi.</li>
</ul>

<h2>Shakl 2 — Moliyaviy natijalar hisoboti</h2>
<p>Bu hisobot davr davomidagi «harakat»ni ko'rsatadi: qancha tushum bo'ldi, qancha xarajat qilindi va oxirida qancha foyda qoldi. Undan quyidagilar hisoblanadi:</p>
<ul>
  <li><strong>Rentabellik</strong> — ROS, ROA, ROE (foyda va tushum asosida);</li>
  <li><strong>Xarajatlar tuzilishi</strong> — tannarx va operatsion xarajatlar ulushi;</li>
  <li><strong>O'sish sur'ati</strong> — tushum va foydaning davrlararo dinamikasi.</li>
</ul>

<h2>Tahlil bosqichlari</h2>
<ol>
  <li><strong>Eksport:</strong> 1C dan Shakl 1 va Shakl 2 ni Excel (.xlsx) formatida saqlang.</li>
  <li><strong>Tekshiruv:</strong> qatorlar to'liqligini va davr (yil/chorak) to'g'riligini ko'ring.</li>
  <li><strong>Yuklash:</strong> ikkala faylni Digital CFO tizimiga yuklang.</li>
  <li><strong>Hisoblash:</strong> tizim 50 dan ortiq koeffitsientni avtomatik hisoblaydi.</li>
  <li><strong>Xulosa:</strong> tayyor PDF hisobotda kuchli/zaif tomonlar va tavsiyalar chiqadi.</li>
</ol>

<h2>Qo'lda tahlil vs avtomatik tahlil</h2>
<table>
  <thead><tr><th>Mezon</th><th>Qo'lda (Excel)</th><th>Digital CFO</th></tr></thead>
  <tbody>
    <tr><td>Vaqt</td><td>Bir necha soat</td><td>~1 daqiqa</td></tr>
    <tr><td>Xatolik xavfi</td><td>Yuqori</td><td>Minimal</td></tr>
    <tr><td>Ko'rsatkichlar soni</td><td>Cheklangan</td><td>50+</td></tr>
    <tr><td>Izoh va tavsiya</td><td>Yo'q</td><td>Bor</td></tr>
  </tbody>
</table>

<h2>Muhim maslahat</h2>
<p>Ikkala shaklni bir davr uchun (masalan, 2025-yil 9 oy) birga yuklang — shundagina tahlil to'liq bo'ladi. Agar faqat Shakl 1 bo'lsa, likvidlik va barqarorlik hisoblanadi, lekin rentabellik ko'rsatkichlari «bo'sh» qoladi.</p>

<blockquote>1C — ma'lumot manbai, tahlil esa undan ma'no chiqarish. Digital CFO aynan shu «ma'no chiqarish» qismini avtomatlashtiradi.</blockquote>

${CTA}
`,
  },
];

// Slug bo'yicha tez topish uchun yordamchi.
export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}
