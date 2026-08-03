// Pul vaqt qiymati · pillar · kw: "pul vaqt qiymati"
export default {
  title: "Pul vaqt qiymati: bugungi 1 mln nega ertangi 1 mln'dan qimmat?",
  slug: "pul-vaqt-qiymati",
  category: "Financial Analysis",
  focus_keyword: "pul vaqt qiymati",
  seo_title: "Pul vaqt qiymati — bugungi va kelajakdagi pul qiymati farqi",
  seo_description:
    "Pul vaqt qiymati nima, nega bugungi pul kelajakdagi puldan qimmat va bu tushuncha investitsiya hamda qaror qabul qilishda qanday ishlatiladi?",
  excerpt:
    "Bugungi 1 million kelajakdagi 1 milliondan qimmat — chunki uni ishlatib, ko'paytirish mumkin. Pul vaqt qiymati shu oddiy, lekin kuchli tushunchani ochadi.",
  cover_alt: "Pul vaqt qiymati — bugungi va kelajak pul qiymati",
  tags: [
    "pul vaqt qiymati", "diskontlash", "kelajak qiymat", "joriy qiymat",
    "investitsiya", "foiz", "NPV", "moliyaviy qaror", "kapital narxi",
    "moliyaviy savodxonlik", "CFO", "diskont stavka",
  ],
  faqs: [
    {
      question: "Pul vaqt qiymati nima?",
      answer:
        "<p>Bu tushuncha: bugungi pul kelajakdagi bir xil summadan qimmat, chunki uni bugun ishlatib (investitsiya, foiz) ko'paytirish mumkin. Vaqt pulga qiymat qo'shadi, shuning uchun turli vaqtdagi pulni to'g'ridan-to'g'ri solishtirib bo'lmaydi.</p>",
    },
    {
      question: "Nega bugungi pul qimmatroq?",
      answer:
        "<p>Uch sabab: uni investitsiya qilib foyda olish mumkin, inflatsiya kelajak pulning qadrini tushiradi, va kelajak noaniq (pul kelmasligi mumkin). Shuning uchun \"qo'ldagi bir qush shoxdagi ikkitasidan yaxshi\".</p>",
    },
    {
      question: "Diskontlash nima?",
      answer:
        "<p>Bu kelajakdagi pulni bugungi qiymatga aylantirish. Masalan, 1 yildan keyingi 110 birlik, 10% stavkada, bugun 100 birliga teng. Diskontlash turli vaqtdagi pulni adolatli solishtirishga imkon beradi.</p>",
    },
    {
      question: "Bu tushuncha qayerda ishlatiladi?",
      answer:
        "<p>Deyarli har moliyaviy qarorda: <a href=\"/blog/npv-va-irr\">NPV</a> hisobi, investitsiya baholash, kredit vs naqd, lizing qarori. Kelajak pulni bugungi qiymatga keltirmasdan qilingan taqqoslash noto'g'ri bo'ladi.</p>",
    },
  ],
  content: `
<p>Savol: kimdir sizga "bugun 1 million beraman yoki bir yildan keyin 1 million" desa, qaysi birini tanlaysiz? Aql bilan — bugun. Lekin nega? Ikkalasi ham 1 million-ku. Javob <strong>pul vaqt qiymati</strong> tushunchasida yashiringan — bu butun moliyaning eng asosiy g'oyalaridan biri.</p>

<p>Bu tushunchani anglash sizni ko'p noto'g'ri qarordan saqlaydi: kredit shartlarini to'g'ri baholash, investitsiyani solishtirish, chegirma taklifini o'lchash. Keling, oddiy misollar bilan ochamiz.</p>

<h2>Nega bugungi pul qimmatroq?</h2>

<p>Bugungi 1 million kelajakdagi 1 milliondan qimmat, chunki:</p>
<ul>
<li><strong>Uni ishlatish mumkin.</strong> Bugun olsangiz, investitsiya qilib yoki biznesga solib ko'paytirasiz.</li>
<li><strong>Inflatsiya.</strong> Vaqt o'tishi bilan pulning xarid quvvati tushadi — kelajakda o'sha 1 million kamroq narsa oladi.</li>
<li><strong>Noaniqlik.</strong> Kelajakdagi pul kelmasligi ham mumkin. Qo'ldagi pul aniq.</li>
</ul>

<blockquote>
<p>Vaqt pulga qiymat qo'shadi. Shuning uchun turli vaqtdagi ikki summani to'g'ridan-to'g'ri solishtirish — olma bilan nokni solishtirishday xato.</p>
</blockquote>

<h2>Kelajak qiymat: pul qanday o'sadi</h2>

<p>Bugungi pul kelajakda qancha bo'ladi? Bu <strong>kelajak qiymat</strong> (future value). Agar 100 birlikni 10% stavkada qo'ysangiz:</p>

<table>
<thead>
<tr><th>Yil</th><th>Qiymat (10%)</th></tr>
</thead>
<tbody>
<tr><td>Bugun</td><td>100</td></tr>
<tr><td>1 yil</td><td>110</td></tr>
<tr><td>2 yil</td><td>121</td></tr>
<tr><td>3 yil</td><td>133</td></tr>
</tbody>
</table>

<p>E'tibor bering: 2-yilda 121 (110 emas) — foizga ham foiz qo'shiladi. Bu <em>murakkab foiz</em> kuchi.</p>

<h2>Joriy qiymat: kelajakni bugunga keltirish</h2>

<p>Teskari savol muhimroq: kelajakdagi pul bugun qancha turadi? Bu <strong>joriy qiymat</strong> (present value) va uni topish jarayoni — <strong>diskontlash</strong>.</p>

<p>1 yildan keyingi 110 birlik, 10% stavkada, bugun 100 birliga teng (110 ÷ 1.10). Kelajak summa qancha uzoq va stavka qancha yuqori bo'lsa, uning bugungi qiymati shuncha kichik.</p>

<h2>Diskont stavka: qaysi foizni olish kerak?</h2>

<p>Diskontlashda ishlatiladigan stavka — sizning <a href="/blog/kapital-narxi">kapital narxingiz</a> yoki muqobil investitsiya daromadi. Agar pulingizni 15% keltiradigan joyga qo'ya olsangiz, diskont stavka 15%. Yuqori stavka kelajak pulni ko'proq "arzonlashtiradi".</p>

<h2>Amaliy qo'llanish</h2>

<p>Bu tushuncha kundalik qarorda ishlaydi:</p>
<ul>
<li><strong>Chegirma taklifi.</strong> "Bugun to'lasang 5% chegirma" — pul vaqt qiymatidan foydalanadi.</li>
<li><strong>Investitsiya.</strong> <a href="/blog/npv-va-irr">NPV</a> aynan kelajak pul oqimlarini bugungi qiymatga keltiradi.</li>
<li><strong>Kredit.</strong> "Keyin to'layman" degan pulning haqiqiy yuki bugungi qiymatda o'lchanadi.</li>
<li><strong>Naqd vs bo'lib to'lash.</strong> Bo'lib to'lash ko'pincha yashirin qiymatga ega.</li>
</ul>

<h2>72 qoidasi: pul necha yilda ikkilanadi?</h2>

<p>Murakkab foizning kuchini tez baholashning oddiy yo'li — <strong>72 qoidasi</strong>. Pulingiz necha yilda ikki barobar bo'lishini bilish uchun 72ni foiz stavkasiga bo'ling. Masalan, 12% stavkada pul 72 ÷ 12 = 6 yilda ikkilanadi. 8% stavkada esa 9 yilda.</p>

<p>Bu oddiy qoida ikki narsani ko'rsatadi. Birinchi — vaqt va stavka birgalikda qanday kuch yaratadi. Ikkinchi — hattoki kichik stavka farqi (8% vs 12%) uzoq muddatda katta natija beradi. Aynan shu sabab investitsiya va qarz qarorlarida stavka har doim muhim — u vaqt bilan kattalashadi.</p>

<h2>Keng tarqalgan xato: nominal raqamga aldanish</h2>

<p>Eng ko'p uchraydigan xato — turli vaqtdagi summalarni nominal (yozilgan) qiymati bo'yicha solishtirish. "1 yilda 1.2 mln beraman" degan taklif "bugun 1 mln"dan ko'proq ko'rinadi. Lekin agar pulingiz yiliga 25% keltirsa, bugungi 1 mln bir yilda 1.25 mln bo'ladi — ya'ni taklif aslida yomonroq.</p>

<p>Shuning uchun har "keyin ko'proq to'layman" yoki "bo'lib to'layman" taklifini diskontlab ko'ring. Katta nominal raqam doim yaxshi degani emas — vaqt uni kichraytiradi. Bu tushuncha sizni sotuvchi va kreditorlarning "jozibali" takliflarida yashiringan haqiqatni ko'rishga o'rgatadi.</p>

<h2>Xulosa</h2>

<p>Pul vaqt qiymati — moliyaning poydevor tushunchasi: bugungi pul kelajakdagi puldan qimmat, chunki vaqt pulga qiymat qo'shadi. Turli vaqtdagi summalarni solishtirishdan oldin ularni bir nuqtaga (odatda bugunga) keltirish shart.</p>

<p>Amaliy maslahat: keyingi safar "bugun yoki keyin to'lash", "naqd yoki bo'lib", "investitsiya A yoki B" degan qarorga duch kelsangiz, summalarni bugungi qiymatga keltirib solishtiring. Bu oddiy odat sizni "katta raqam yaxshiroq" degan aldamchi tuzoqdan saqlaydi va har moliyaviy qarorni aniqroq qiladi.</p>
`.trim(),
};
