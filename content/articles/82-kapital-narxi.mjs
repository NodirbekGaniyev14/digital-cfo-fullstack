// Kapital narxi / WACC · standard · kw: "kapital narxi"
export default {
  title: "Kapital narxi (WACC): pulingiz aslida qancha turadi?",
  slug: "kapital-narxi",
  category: "Financing",
  focus_keyword: "kapital narxi",
  seo_title: "Kapital narxi (WACC) — qarz va ulush kapitalining haqiqiy narxi",
  seo_description:
    "Kapital narxi (WACC) nima, qarz va ulush kapitalining narxi qanday hisoblanadi va nega investitsiya daromadi shu narxdan yuqori bo'lishi kerak?",
  excerpt:
    "Har pulning narxi bor — hatto o'z pulingizniki ham. Kapital narxi (WACC) biznesga jalb qilingan pulning haqiqiy qiymatini ko'rsatadi va qaror mezonini beradi.",
  cover_alt: "Kapital narxi WACC — qarz va ulush kapitali narxi",
  tags: [
    "kapital narxi", "WACC", "qarz kapitali", "ulush kapitali", "investitsiya",
    "diskont stavka", "moliyalashtirish", "NPV", "moliyaviy qaror",
    "kapital tuzilishi", "CFO", "risk",
  ],
  faqs: [
    {
      question: "Kapital narxi nima?",
      answer:
        "<p>Bu biznes jalb qilgan pulning (qarz + ulush) o'rtacha narxi. Qarz uchun bu foiz, ulush uchun — investorlar kutgan daromad. WACC bu ikkisining og'irlangan o'rtachasi va investitsiya qarorlari uchun minimal daraja beradi.</p>",
    },
    {
      question: "O'z pulimning ham narxi bormi?",
      answer:
        "<p>Ha. O'z pulingizni biznesga solganda, uni boshqa joyga (masalan, investitsiya) qo'yib daromad olish imkoniyatidan voz kechasiz. Bu \"yo'qotilgan imkoniyat\" — o'z kapitalingizning narxi.</p>",
    },
    {
      question: "WACC nima uchun kerak?",
      answer:
        "<p>U investitsiya mezoni: loyiha daromadi WACC'dan yuqori bo'lsagina qiymat yaratadi. Shuningdek u <a href=\"/blog/npv-va-irr\">NPV</a> hisobida diskont stavka sifatida ishlatiladi. WACC — \"puldan foydalanish uchun to'lanadigan narx\".</p>",
    },
    {
      question: "Qarz kapitali ulushdan arzonmi?",
      answer:
        "<p>Odatda ha — qarz foizi ulush kutilgan daromaddan past, chunki qarz kam riskli va foiz ko'pincha soliqni kamaytiradi. Lekin ko'p qarz riskni oshiradi, shuning uchun muvozanat kerak.</p>",
    },
  ],
  content: `
<p>Ko'p tadbirkor "o'z pulim bepul" deb o'ylaydi. Aslida esa har pulning narxi bor — hatto o'zingizniki ham. Bu narxni tushunmasdan qilingan investitsiya qarori ko'pincha noto'g'ri bo'ladi: daromadli ko'ringan loyiha aslida qiymat yo'qotayotgan bo'lishi mumkin. Bu narxni <strong>kapital narxi</strong> deb ataladi.</p>

<h2>Kapitalning ikki manbai</h2>

<p>Biznes pulni ikki joydan oladi:</p>
<ul>
<li><strong>Qarz</strong> — bank krediti, qarz. Narxi = foiz stavka.</li>
<li><strong>Ulush</strong> — egalar va investorlar puli. Narxi = ular kutgan daromad.</li>
</ul>

<p>Ikkalasining ham narxi bor. Qarzniki aniq (foiz). Ulushniki yashirin, lekin real: investor pulini biznesga solganda, u boshqa imkoniyatdan voz kechadi va evaziga daromad kutadi.</p>

<blockquote>
<p>Bepul kapital yo'q. Qarzning foizi ko'rinadi, ulushning narxi ko'rinmaydi — lekin ikkalasi ham to'lanadi.</p>
</blockquote>

<h2>WACC: og'irlangan o'rtacha</h2>

<p><strong>WACC</strong> (Weighted Average Cost of Capital) — qarz va ulush narxining og'irlangan o'rtachasi. Misol:</p>

<table>
<thead>
<tr><th>Manba</th><th>Ulush</th><th>Narx</th><th>Hissa</th></tr>
</thead>
<tbody>
<tr><td>Qarz</td><td>40%</td><td>15%</td><td>6.0%</td></tr>
<tr><td>Ulush</td><td>60%</td><td>25%</td><td>15.0%</td></tr>
<tr><td><strong>WACC</strong></td><td>100%</td><td>—</td><td><strong>21%</strong></td></tr>
</tbody>
</table>

<p>Bu biznesning kapital narxi — 21%. Ya'ni biznes o'z pulidan foydalanish uchun o'rtacha 21% "to'laydi".</p>

<h2>Nega bu muhim: qaror mezoni</h2>

<p>WACC investitsiya uchun minimal daraja beradi. Agar loyiha 21%dan yuqori daromad keltirsa — u qiymat yaratadi. Agar pastroq bo'lsa — pul yo'qotiladi, hatto "foydali" ko'rinsa ham.</p>

<p>Misol: 18% daromadli loyiha yaxshi ko'rinadi. Lekin kapital narxi 21% bo'lsa, u aslida qiymat <em>yo'qotadi</em> — pulni jalb qilish undan olingan daromaddan qimmatga tushdi.</p>

<h2>Qarz vs ulush: muvozanat</h2>

<p>Qarz odatda ulushdan arzon (foizi past, soliq imtiyozi bor). Shuning uchun ko'proq qarz WACC'ni tushiradi. Lekin ko'p qarz riskni oshiradi — majburiy to'lovlar, <a href="/blog/kassa-uzilishi">kassa uzilishi</a> xavfi. Optimal <a href="/blog/qarz-kapital-nisbati">qarz-kapital nisbati</a> WACC'ni minimal, riskni boshqariladigan tutadi.</p>

<h2>Amaliy foydalanish</h2>

<p>WACC ni <a href="/blog/npv-va-irr">NPV</a> hisobida diskont stavka sifatida ishlating. Kelajak pul oqimlarini WACC bilan diskontlab, loyiha haqiqatan qiymat yaratishini ko'rasiz. Bu "his" emas, raqamga asoslangan investitsiya qaroriga imkon beradi.</p>

<h2>Misol: WACC qarorni qanday o'zgartiradi</h2>

<p>Ikki loyiha bor. A loyiha 18% daromad va'da qiladi, B loyiha 24%. Ikkalasi ham "foydali" ko'rinadi. Lekin kapital narxingiz (WACC) 21% bo'lsa, rasm o'zgaradi:</p>
<ul>
<li><strong>A loyiha (18%):</strong> WACCdan past — qiymat <em>yo'qotadi</em>. Pul jalb qilish undan olingan daromaddan qimmatga tushdi.</li>
<li><strong>B loyiha (24%):</strong> WACCdan yuqori — qiymat <em>yaratadi</em>. Buni tanlang.</li>
</ul>

<p>WACCsiz ikkalasini ham qabul qilgan bo'lar edingiz. WACC bilan A loyihani rad qilasiz. Aynan shu — WACCning amaliy kuchi: u "foydali ko'ringan" loyihani "aslida zararli" degan haqiqatdan ajratadi.</p>

<h2>Kichik biznes uchun soddalashtirish</h2>

<p>Kichik biznesda to'liq WACC hisobi murakkab bo'lishi mumkin. Soddaroq yondashuv: o'z pulingiz uchun "muqobil daromad"ni oling (agar pulni boshqa joyga qo'ysa ngiz qancha keltirar edi) va qarz foizini qo'shib o'rtachasini chiqaring.</p>

<p>Masalan, o'z pulingiz bankda 18% keltirar edi, kredit foizi 20%. Yarim-yarim bo'lsa, taxminiy kapital narxi ~19%. Endi har investitsiyani shu songa solishtiring. Bu aniq ilmiy WACC emas, lekin u sizni eng muhim savolga yo'naltiradi: bu loyiha pulimning narxini oqlaydimi? Aniqlik muhim emas — mezonning o'zi muhim.</p>

<h2>Xulosa</h2>

<p>Kapital narxi (WACC) — biznes jalb qilgan pulning haqiqiy o'rtacha narxi. U investitsiya qarori uchun eng muhim mezon: daromad WACC'dan yuqori bo'lsagina biznes qiymat yaratadi.</p>

<p>Amaliy maslahat: o'z biznesingiz uchun taxminiy WACC'ni hisoblang — qarz foizingiz va ulushdan kutilgan daromadni og'irlab o'rtachasini oling. Keyin har yirik investitsiyani shu songa solishtiring: agar loyiha undan yuqori keltirmasa, uni qayta ko'ring. Bu oddiy mezon sizni "katta raqam" tuzog'idan saqlaydi.</p>
`.trim(),
};
