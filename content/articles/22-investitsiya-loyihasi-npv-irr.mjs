// Investitsiya loyihasini baholash (NPV/IRR) · standard · kw: "NPV va IRR"
export default {
  title: "NPV va IRR: investitsiya loyihasi arziydimi yoki yo'q?",
  slug: "npv-va-irr",
  category: "Financial Analysis",
  focus_keyword: "NPV va IRR",
  seo_title: "NPV va IRR nima? Investitsiya loyihasini baholash usullari",
  seo_description:
    "NPV (sof joriy qiymat) va IRR (ichki daromadlilik) nima, ular investitsiya loyihasi foydaliligini qanday ko'rsatadi? Formula, misol va qaror qoidasi.",
  excerpt:
    "Yangi uskuna, filial yoki loyihaga pul tikishdan oldin bitta savolga javob kerak: bu arziydimi? NPV va IRR aynan shu savolga raqamli javob beradi. Ularni tushunamiz.",
  cover_alt: "NPV va IRR — investitsiya loyihasi pul oqimi va diskontlash",
  tags: [
    "NPV", "IRR", "investitsiya", "sof joriy qiymat", "ichki daromadlilik",
    "diskontlash", "loyiha bahosi", "pul oqimi", "qoplanish muddati",
    "moliyaviy tahlil", "kapital byudjeti", "CFO",
  ],
  faqs: [
    {
      question: "NPV nima va u nimani ko'rsatadi?",
      answer:
        "<p>NPV (Net Present Value, sof joriy qiymat) — loyiha keltiradigan barcha kelajakdagi pul oqimlarining bugungi qiymatidan boshlang'ich investitsiyani ayirgan natija. NPV musbat bo'lsa — loyiha qiymat yaratadi, manfiy bo'lsa — yo'q.</p>",
    },
    {
      question: "IRR nima?",
      answer:
        "<p>IRR (Internal Rate of Return, ichki daromadlilik darajasi) — loyihaning \"foiz\"i, ya'ni NPV nolga teng bo'ladigan diskont stavkasi. Agar IRR kredit foizidan yoki talab qilinadigan daromaddan yuqori bo'lsa — loyiha arziydi.</p>",
    },
    {
      question: "Nega kelajakdagi pul \"diskontlanadi\"?",
      answer:
        "<p>Chunki bugungi 1 mln so'm kelajakdagi 1 mln so'mdan qimmatroq — uni bugun investitsiya qilib, ko'paytirish mumkin. Diskontlash kelajakdagi pulni bugungi qiymatiga keltiradi, shunda taqqoslash adolatli bo'ladi.</p>",
    },
    {
      question: "NPV va IRR ziddiyat bersa qaysi biriga ishonaman?",
      answer:
        "<p>NPV'ga. U mutlaq qiymat (qancha pul) beradi va loyihalarni to'g'ri saralaydi. IRR foiz sifatida qulay, lekin ba'zi holatlarda (turli hajmli loyihalar) chalg'itishi mumkin. Ikkalasini birga ko'ring, lekin NPV ustun.</p>",
    },
  ],
  content: `
<p>Yangi uskuna 200 mln so'm turadi va yiliga 60 mln pul keltiradi. Bu yaxshimi? "Ha, 3 yilda qoplanadi" degan javob to'liq emas — chunki u pulning <em>vaqt qiymatini</em> hisobga olmaydi. To'g'ri javob uchun <strong>NPV va IRR</strong> kerak.</p>

<h2>Asosiy g'oya: pulning vaqt qiymati</h2>

<p>Bugungi 1 mln so'm — kelasi yilgi 1 mln so'mdan qimmatroq. Nega? Chunki bugungi pulni investitsiya qilib, ko'paytirishingiz mumkin. Shuning uchun kelajakdagi pul oqimini bugungi qiymatiga keltirish — <strong>diskontlash</strong> — kerak.</p>

<blockquote>
<p>Kelajakdagi pulni bugungi qiymatiga keltirmasdan investitsiya baholash — bu turli valyutalarni kursi hisobga olmasdan qo'shishga o'xshaydi.</p>
</blockquote>

<h2>NPV — sof joriy qiymat</h2>

<p><strong>NPV</strong> = (kelajakdagi pul oqimlarining bugungi qiymati) − (boshlang'ich investitsiya)</p>

<p><strong>Qaror qoidasi:</strong></p>
<ul>
<li>NPV > 0 → loyiha qiymat yaratadi, <strong>arziydi</strong></li>
<li>NPV = 0 → befarq (aynan talab qilingan daromadni beradi)</li>
<li>NPV < 0 → loyiha qiymat yo'qotadi, <strong>arzimaydi</strong></li>
</ul>

<h3>Amaliy misol</h3>

<p>200 mln investitsiya, 3 yil davomida yiliga 90 mln pul oqimi, diskont stavkasi 15%:</p>

<table>
<thead>
<tr><th>Yil</th><th>Pul oqimi</th><th>Bugungi qiymat (15%)</th></tr>
</thead>
<tbody>
<tr><td>0</td><td>−200 mln</td><td>−200 mln</td></tr>
<tr><td>1</td><td>+90 mln</td><td>+78 mln</td></tr>
<tr><td>2</td><td>+90 mln</td><td>+68 mln</td></tr>
<tr><td>3</td><td>+90 mln</td><td>+59 mln</td></tr>
<tr><td><strong>NPV</strong></td><td></td><td><strong>+5 mln</strong></td></tr>
</tbody>
</table>

<p>NPV musbat (+5 mln) — demak loyiha 15% talabni qoplab, ustiga qiymat yaratadi. Arziydi.</p>

<h2>IRR — ichki daromadlilik darajasi</h2>

<p><strong>IRR</strong> — bu loyihaning "foizi": NPV aynan nolga teng bo'ladigan diskont stavkasi. Yuqoridagi misolda IRR ~16% atrofida bo'ladi.</p>

<p><strong>Qaror qoidasi:</strong> IRR sizning talab qilinadigan daromadingizdan (yoki kredit foizidan) yuqori bo'lsa — loyiha arziydi. Misolda IRR (16%) > talab (15%) → arziydi.</p>

<h2>NPV va IRR birga</h2>

<table>
<thead>
<tr><th>Ko'rsatkich</th><th>Beradi</th><th>Qulaylik</th></tr>
</thead>
<tbody>
<tr><td>NPV</td><td>Mutlaq qiymat (qancha pul)</td><td>Loyihalarni to'g'ri saralaydi</td></tr>
<tr><td>IRR</td><td>Foiz (daromadlilik)</td><td>Tushunish oson, taqqoslash qulay</td></tr>
</tbody>
</table>

<p>Ular ziddiyat bersa — NPV ustun, chunki u haqiqiy qiymatni (pulni) o'lchaydi.</p>

<h2>Xatolardan qochish</h2>

<ul>
<li><strong>Faqat qoplanish muddatiga qarash.</strong> "3 yilda qoplanadi" pulning vaqt qiymatini e'tiborsiz qoldiradi.</li>
<li><strong>Optimistik pul oqimi.</strong> Kelajakdagi tushumni oshirib ko'rsatish NPV'ni buzadi.</li>
<li><strong>Noto'g'ri diskont stavkasi.</strong> Stavka investitsiyaning xavfini va muqobil imkoniyatni aks ettirishi kerak.</li>
</ul>

<h2>Xulosa</h2>

<p>NPV va IRR — investitsiya qarorlarining oltin standarti. Ular "arziydimi?" degan savolga sezgi emas, pulning vaqt qiymatini hisobga olgan aniq javob beradi.</p>

<p>Amaliy maslahat: keyingi yirik xarid yoki loyiha oldidan uni <a href="/blog/excel-moliyachi-uchun">Excel</a>da NPV bilan baholang (Excelda NPV va IRR funksiyalari tayyor). Bu tahlilni <a href="/blog/moliyaviy-model">moliyaviy model</a>ning bir qismiga aylantiring.</p>
`.trim(),
};
