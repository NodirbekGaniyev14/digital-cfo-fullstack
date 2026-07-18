// Zaxiralarni boshqarish (Inventory Management) · standard · kw: "zaxiralarni boshqarish"
export default {
  title: "Zaxiralarni boshqarish: omborda muzlagan pulni qanday bo'shatasiz?",
  slug: "zaxiralarni-boshqarish",
  category: "Working Capital",
  focus_keyword: "zaxiralarni boshqarish",
  seo_title: "Zaxiralarni boshqarish — aylanish koeffitsienti va optimal daraja",
  seo_description:
    "Zaxiralarni boshqarish nima, zaxira aylanish koeffitsienti qanday hisoblanadi va omborda muzlagan pulni qanday kamaytirasiz? Amaliy usullar bilan.",
  excerpt:
    "Ombordagi tovar — bu javondagi pul. Ko'p bo'lsa kassa muzlaydi, kam bo'lsa sotuvni yo'qotasiz. Zaxirani qanday o'lchash va optimallashtirishni ko'rib chiqamiz.",
  cover_alt: "Zaxiralarni boshqarish — ombor, aylanish va optimal daraja",
  tags: [
    "zaxiralarni boshqarish", "inventory management", "zaxira aylanishi", "ombor",
    "aylanma kapital", "tovar zaxirasi", "ABC tahlil", "pul oqimi",
    "tovar tannarxi", "logistika", "moliyaviy boshqaruv", "CFO",
  ],
  faqs: [
    {
      question: "Zaxira aylanish koeffitsienti nima?",
      answer:
        "<p>Bu zaxira yil davomida necha marta \"aylangani\"ni (sotilib, yangilangani) ko'rsatadi. Formula: Tovar tannarxi ÷ O'rtacha zaxira. Yuqori koeffitsient — tovar tez sotilyapti degani.</p>",
    },
    {
      question: "Ko'p zaxira nega yomon?",
      answer:
        "<p>Ombordagi tovar — muzlagan pul. Bundan tashqari: saqlash xarajati, eskirish/buzilish xavfi va zamonaviylikni yo'qotish. Ko'p zaxira ko'pincha \"xavfsizlik\" tuyg'usi beradi, lekin aslida kassani bo'shatadi.</p>",
    },
    {
      question: "ABC tahlil nima?",
      answer:
        "<p>Zaxirani muhimlik bo'yicha 3 guruhga bo'lish: A — qiymatning katta qismini beradigan oz sonli tovar (qattiq nazorat), B — o'rta, C — ko'p sonli arzon tovar (yengil nazorat). Bu e'tiborni to'g'ri joyga qaratadi.</p>",
    },
    {
      question: "Optimal zaxira darajasini qanday topaman?",
      answer:
        "<p>Sotuv tezligi, yetkazib berish muddati va xavfsizlik zaxirasini hisobga oling. Asosiy savol: tovar tugab qolmasligi uchun minimal qancha kerak? Ortiqchasi — muzlagan pul.</p>",
    },
  ],
  content: `
<p>Ombordagi to'la javonlar tadbirkorga xotirjamlik beradi — "tovar bor, sotuvga tayyor". Lekin moliyaviy nuqtai nazardan bu javonlar boshqa narsani ko'rsatadi: <strong>muzlagan pul</strong>.</p>

<p>Har bir zaxira birligi — bu siz to'lagan, lekin hali qaytmagan pul. Zaxira boshqaruvi — bu tovar tugab qolmaslik bilan ortiqcha pulni muzlatib qo'ymaslik o'rtasidagi muvozanat.</p>

<h2>Zaxiralarni boshqarish nima?</h2>

<p><strong>Zaxiralarni boshqarish</strong> (Inventory Management) — bu tovar-moddiy zaxiralarning optimal darajasini ta'minlash jarayoni: yetarli sotuv uchun, lekin ortiqcha pul muzlatmasdan.</p>

<blockquote>
<p>Ombor — bu do'kon emas, xarajat markazi. Tovar javonda turgan har kun sizga pulga tushadi.</p>
</blockquote>

<h2>Ortiqcha va kam zaxiraning narxi</h2>

<table>
<thead>
<tr><th>Ortiqcha zaxira</th><th>Kam zaxira</th></tr>
</thead>
<tbody>
<tr><td>Muzlagan pul (kassa bo'sh)</td><td>Yo'qotilgan sotuv</td></tr>
<tr><td>Saqlash xarajati</td><td>Norozi mijoz</td></tr>
<tr><td>Eskirish/buzilish xavfi</td><td>Shoshilinch xarid (qimmat)</td></tr>
<tr><td>Zamonaviylikni yo'qotish</td><td>Ishlab chiqarish to'xtashi</td></tr>
</tbody>
</table>

<p>Ko'rinib turibdiki, ikkala chekka ham zararli. Maqsad — "oltin o'rta"ni topish.</p>

<h2>Zaxira aylanish koeffitsienti</h2>

<p>Asosiy ko'rsatkich — zaxira yil davomida necha marta aylanishini o'lchaydi:</p>

<p><strong>Aylanish = Tovar tannarxi ÷ O'rtacha zaxira</strong></p>

<p>Misol: Yillik tovar tannarxi 600 mln, o'rtacha zaxira 100 mln bo'lsa:</p>
<p>Aylanish = 600 ÷ 100 = <strong>6 marta</strong> (ya'ni zaxira ~60 kunda yangilanadi)</p>

<p>Yuqori koeffitsient — tovar tez sotilyapti, pul tez aylanyapti degani. Past koeffitsient — tovar javonda qotib qolyapti.</p>

<h2>ABC tahlil: e'tiborni to'g'ri joyga qaratish</h2>

<p>Barcha tovarni bir xil nazorat qilish — vaqt isrofi. ABC tahlil ularni muhimlik bo'yicha bo'ladi:</p>

<ul>
<li><strong>A guruh (~20% tovar, ~80% qiymat):</strong> qattiq nazorat, tez-tez tekshiruv.</li>
<li><strong>B guruh (~30% tovar, ~15% qiymat):</strong> o'rtacha nazorat.</li>
<li><strong>C guruh (~50% tovar, ~5% qiymat):</strong> yengil nazorat, katta partiyada xarid.</li>
</ul>

<p>Bu Pareto qoidasining amaliy qo'llanishi: kam sonli muhim tovarga ko'proq e'tibor bering.</p>

<h2>Zaxirani optimallashtirish usullari</h2>

<ol>
<li><strong>Sotuv ma'lumotiga tayaning.</strong> "Sezgi" emas, real sotuv tezligi asosida buyurtma bering.</li>
<li><strong>Xavfsizlik zaxirasini hisoblang.</strong> Yetkazib berish muddati va sotuv o'zgaruvchanligiga qarab minimal zaxira.</li>
<li><strong>Sekin harakatlanuvchi tovarni aniqlang.</strong> Uzoq turgan tovarni chegirma bilan soting — muzlagan pulni bo'shating.</li>
<li><strong>Yetkazib beruvchi bilan ishlang.</strong> Tez-tez, kichik partiyada yetkazib berish zaxirani kamaytiradi.</li>
<li><strong>Muntazam inventarizatsiya.</strong> Haqiqiy zaxira va hisobdagi farqni nazorat qiling — bu <a href="/blog/ichki-nazorat-nima">ichki nazorat</a>ning qismi.</li>
</ol>

<h2>Xulosa</h2>

<p>Zaxira boshqaruvi — bu "ko'proq — yaxshiroq" degan fikrni "aylanadigan — yaxshiroq" degan fikrga o'zgartirish. Ombordagi tovar sotilib pulga aylangandagina qiymat yaratadi.</p>

<p>Amaliy maslahat: zaxira aylanish koeffitsientini hisoblang va uni oldingi davr bilan solishtiring. Koeffitsient tushayotgan bo'lsa — pul omborda muzlay boshlagan. Zaxira, <a href="/blog/debitorlik-qarzlari">debitorlik</a> va <a href="/blog/kreditorlik-qarzlari">kreditorlik</a> birgalikda aylanma kapital sog'ligini belgilaydi.</p>
`.trim(),
};
