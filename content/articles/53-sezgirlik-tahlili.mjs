// Sezgirlik va stsenariy tahlili · standard · kw: "stsenariy tahlili"
export default {
  title: "Stsenariy va sezgirlik tahlili: \"agar shunday bo'lsa?\" savoliga javob",
  slug: "stsenariy-tahlili",
  category: "Financial Analysis",
  focus_keyword: "stsenariy tahlili",
  seo_title: "Stsenariy va sezgirlik tahlili — noaniqlikda qaror qabul qilish",
  seo_description:
    "Stsenariy tahlili va sezgirlik tahlili nima, ular qanday farq qiladi va noaniqlik sharoitida qaror qabul qilishda qanday yordam beradi? Amaliy misollar.",
  excerpt:
    "Kelajak noaniq — bitta prognoz xavfli. Stsenariy tahlili bir necha kelajakni ko'rsatadi, sezgirlik tahlili esa qaysi omil eng ko'p ta'sir qilishini ochadi.",
  cover_alt: "Stsenariy tahlili — optimistik, realistik va pessimistik variantlar",
  tags: [
    "stsenariy tahlili", "sezgirlik tahlili", "risk", "prognoz",
    "moliyaviy model", "noaniqlik", "qaror qabul qilish", "byudjet",
    "moliyaviy rejalashtirish", "what-if", "CFO", "investitsiya",
  ],
  faqs: [
    {
      question: "Stsenariy va sezgirlik tahlili farqi nima?",
      answer:
        "<p>Stsenariy tahlili bir nechta <em>butun holat</em>ni ko'radi (optimistik/realistik/pessimistik). Sezgirlik tahlili esa <em>bitta omil</em>ni o'zgartirib, uning natijaga ta'sirini o'lchaydi (masalan, narx 5% oshsa nima bo'ladi).</p>",
    },
    {
      question: "Nega bitta prognoz yetarli emas?",
      answer:
        "<p>Chunki kelajak noaniq va bitta raqam yolg'on aniqlik beradi. Bir nechta stsenariy xavfni ko'rsatadi va \"eng yomon holatda omon qolamizmi?\" degan hayotiy savolga javob beradi.</p>",
    },
    {
      question: "Sezgirlik tahlili nimaga foydali?",
      answer:
        "<p>U qaysi omil natijaga eng ko'p ta'sir qilishini ko'rsatadi. Shunda diqqatni eng muhim omilga (masalan, narx yoki sotuv hajmi) qaratasiz — ular ustidan nazorat foydani eng ko'p himoya qiladi.</p>",
    },
    {
      question: "Buni nimada qilaman?",
      answer:
        "<p><a href=\"/blog/excel-moliyachi-uchun\">Excel</a> ideal: kirish ma'lumotini o'zgartirib, natijaní ko'rasiz. Data Table va Scenario Manager funksiyalari aynan shu uchun. Buni <a href=\"/blog/moliyaviy-model\">moliyaviy modelga</a> qo'shing.</p>",
    },
  ],
  content: `
<p>Har prognoz bitta muammoga ega: u kelajakni <em>bitta</em> raqam bilan ko'rsatadi. Lekin kelajak noaniq — sotuv rejadan kam bo'lishi, narx o'zgarishi, xarajat oshishi mumkin. <strong>Stsenariy va sezgirlik tahlili</strong> aynan shu noaniqlik bilan ishlaydi.</p>

<h2>Muammo: yolg'on aniqlik</h2>

<p>"Kelasi yil foyda 150 mln bo'ladi" — bu aniq ko'rinadi, lekin aslida taxmin. Agar sotuv 20% kam bo'lsa-chi? Bitta raqam bu savolga javob bermaydi va xavfni yashiradi.</p>

<blockquote>
<p>Aniq bitta prognoz — noaniq kelajakni aniqday ko'rsatadi. Bu eng xavfli xato: rejaga haddan ortiq ishonish.</p>
</blockquote>

<h2>Stsenariy tahlili: bir necha kelajak</h2>

<p><strong>Stsenariy tahlili</strong> bir nechta butun holatni quradi:</p>

<table>
<thead>
<tr><th>Stsenariy</th><th>Faraz</th><th>Sof foyda</th></tr>
</thead>
<tbody>
<tr><td>Optimistik</td><td>Sotuv +15%</td><td>200 mln</td></tr>
<tr><td>Realistik</td><td>Reja bo'yicha</td><td>150 mln</td></tr>
<tr><td>Pessimistik</td><td>Sotuv −25%</td><td>40 mln ⚠️</td></tr>
</tbody>
</table>

<p>Eng muhimi — <strong>pessimistik</strong> stsenariy. U savolga javob beradi: eng yomon holatda omon qolamizmi? Agar pessimistik stsenariyda zarar bo'lsa — bu jiddiy ogohlantirish, hozirdan choraga tayyorlanish kerak.</p>

<h2>Sezgirlik tahlili: qaysi omil muhim?</h2>

<p><strong>Sezgirlik tahlili</strong> bitta omilni o'zgartirib, uning ta'sirini o'lchaydi — qolganini qat'iy tutib:</p>

<table>
<thead>
<tr><th>Omil o'zgarishi</th><th>Foydaga ta'sir</th></tr>
</thead>
<tbody>
<tr><td>Narx +5%</td><td>Foyda +40 mln 🔥</td></tr>
<tr><td>Sotuv hajmi +5%</td><td>Foyda +18 mln</td></tr>
<tr><td>Tannarx −5%</td><td>Foyda +25 mln</td></tr>
<tr><td>Doimiy xarajat −5%</td><td>Foyda +8 mln</td></tr>
</tbody>
</table>

<p>Xulosa aniq: <strong>narx</strong> foydaga eng ko'p ta'sir qiladi. Demak, diqqatni <a href="/blog/narxlash-strategiyasi">narxlashga</a> qaratish eng katta samara beradi. Sezgirlik tahlili aynan shu ustuvorlikni ko'rsatadi.</p>

<h2>Ikkalasini birga ishlatish</h2>

<ul>
<li><strong>Stsenariy tahlili</strong> — "kelajak qanday bo'lishi mumkin?" (xavfni ko'rish)</li>
<li><strong>Sezgirlik tahlili</strong> — "qaysi omil eng muhim?" (diqqatni qaratish)</li>
</ul>

<p>Birinchisi sizni tayyorlaydi, ikkinchisi harakatni yo'naltiradi.</p>

<h2>Amaliy qo'llash</h2>

<ol>
<li><a href="/blog/moliyaviy-model">Moliyaviy model</a> tuzing — taxminlar alohida.</li>
<li>Uchta stsenariy quring (optimistik/realistik/pessimistik).</li>
<li>Har asosiy omilni ±5–10% o'zgartirib, foydaga ta'sirini ko'ring.</li>
<li>Eng ta'sirli omillarni aniqlang va ularga e'tibor bering.</li>
<li>Pessimistik stsenariyga choralar rejasini tayyorlang.</li>
</ol>

<h2>Qayerda kerak?</h2>

<ul>
<li><a href="/blog/budjetlashtirish-nima">Byudjetlashtirish</a> — bir necha stsenariy bilan</li>
<li><a href="/blog/npv-va-irr">Investitsiya qarorlari</a> — loyiha yomon ketsa nima bo'ladi</li>
<li><a href="/blog/biznes-reja-moliyaviy-qismi">Biznes reja</a> — investorga xavfni ko'rsatish</li>
<li><a href="/blog/moliyaviy-risk-boshqaruvi">Risk boshqaruvi</a> — tahdidlarni o'lchash</li>
</ul>

<h2>Xulosa</h2>

<p>Stsenariy va sezgirlik tahlili — noaniqlik bilan aql bilan ishlash usuli. Ular kelajakni bashorat qilmaydi, lekin turli yo'llarga tayyorlanish va eng muhim omilga diqqat qaratish imkonini beradi.</p>

<p>Amaliy maslahat: keyingi muhim qarordan (byudjet, investitsiya) oldin uch stsenariy quring va pessimistik holatda omon qolasizmi tekshiring. Keyin bir necha omilni o'zgartirib, qaysi biri eng ko'p ta'sir qilishini toping. Bu ikki mashq qaror sifatini keskin oshiradi.</p>
`.trim(),
};
