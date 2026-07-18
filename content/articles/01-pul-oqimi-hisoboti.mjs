// Pul oqimi hisoboti (Cash Flow Statement) · standard · kw: "pul oqimi hisoboti"
export default {
  title: "Pul oqimi hisoboti (Cash Flow Statement) qanday o'qiladi?",
  slug: "pul-oqimi-hisoboti",
  category: "Cash Flow",
  focus_keyword: "pul oqimi hisoboti",
  seo_title: "Pul oqimi hisoboti qanday o'qiladi? 3 bo'lim va amaliy misol",
  seo_description:
    "Pul oqimi hisoboti (Cash Flow Statement) nima, uning 3 bo'limi qanday o'qiladi va kompaniya sog'ligini qanday ko'rsatadi? Amaliy misol bilan tushuntirdik.",
  excerpt:
    "Pul oqimi hisoboti — kompaniyaga qayerdan pul kelgani va qayerga ketganini ko'rsatadigan uchinchi asosiy hisobot. Uning 3 bo'limini va ular nima haqida gapirishini amaliy misolda ko'rib chiqamiz.",
  cover_alt: "Pul oqimi hisoboti — operatsion, investitsion va moliyaviy oqimlar",
  tags: [
    "pul oqimi hisoboti", "cash flow statement", "cash flow", "operatsion pul oqimi",
    "investitsion faoliyat", "moliyaviy faoliyat", "moliyaviy hisobot", "IAS 7",
    "pul oqimi tahlili", "likvidlik", "CFO", "moliyaviy tahlil",
  ],
  faqs: [
    {
      question: "Pul oqimi hisoboti Foyda hisobotidan nimasi bilan farq qiladi?",
      answer:
        "<p>Foyda hisoboti hisoblash usulida (accrual) tuziladi — daromad sotuv sodir bo'lgan payt yoziladi, pul kelmagan bo'lsa ham. Pul oqimi hisoboti esa faqat <em>haqiqiy</em> pul kelib-ketishini ko'rsatadi. Shuning uchun foyda katta bo'lib, pul oqimi manfiy bo'lishi mumkin.</p>",
    },
    {
      question: "Qaysi bo'lim eng muhim?",
      answer:
        "<p>Operatsion pul oqimi (OCF). U kompaniya asosiy biznesidan qancha pul ishlab topayotganini ko'rsatadi. Barqaror musbat OCF — sog'lom biznes belgisi.</p>",
    },
    {
      question: "Manfiy pul oqimi doim yomonmi?",
      answer:
        "<p>Yo'q. Investitsion bo'limda manfiy oqim — kompaniya o'sish uchun uskuna/aktiv sotib olayotganini bildiradi (bu yaxshi). Lekin operatsion bo'limda uzoq davom etgan manfiy oqim — jiddiy signal.</p>",
    },
    {
      question: "Pul oqimi hisobotini qanday tuzaman?",
      answer:
        "<p>Ikki usul bor: to'g'ridan-to'g'ri (barcha pul tushum va to'lovlarni sanash) va bilvosita (sof foydadan boshlab tuzatishlar qilish). Amaliyotda ko'pchilik bilvosita usulni ishlatadi, chunki u Foyda hisoboti va Balansdan chiqadi.</p>",
    },
  ],
  content: `
<p>Ko'p tadbirkor faqat bitta raqamga qaraydi — <strong>foyda</strong>. Lekin foyda "qog'ozdagi" ko'rsatkich: u sotuv sodir bo'lganda yoziladi, mijoz pulni keyin to'lasa ham. Aynan shuning uchun foydali kompaniyalar ham bankrot bo'ladi — kassada pul qolmaydi.</p>

<p><strong>Pul oqimi hisoboti</strong> (Cash Flow Statement) ana shu bo'shliqni to'ldiradi: u faqat haqiqiy pul harakatini ko'rsatadi. Keling, uni qanday o'qishni o'rganamiz.</p>

<h2>Pul oqimi hisoboti nima?</h2>

<p>Bu — moliyaviy hisobotning uchta asosiy shaklidan biri (Balans va <a href="/blog/operatsion-pul-oqimi">Foyda hisoboti</a> bilan birga). U davr davomida kompaniyaga <strong>qancha pul kirdi va qancha chiqdi</strong> degan savolga javob beradi va uchta bo'limga bo'linadi.</p>

<blockquote>
<p>Foyda — bu fikr (accrual asosida hisoblanadi). Pul oqimi — bu fakt. Bank hisobingizdagi qoldiq yolg'on gapirmaydi.</p>
</blockquote>

<h2>3 bo'lim: pul qayerdan keladi va qayerga ketadi</h2>

<h3>1. Operatsion faoliyat (OCF)</h3>
<p>Asosiy biznesdan keladigan pul: mijozlardan tushum <em>minus</em> yetkazib beruvchilarga, xodimlarga, soliqqa to'lovlar. Bu — hisobotning yuragi. Sog'lom kompaniyada OCF barqaror musbat bo'ladi.</p>

<h3>2. Investitsion faoliyat (ICF)</h3>
<p>Uzoq muddatli aktivlar bilan bog'liq: uskuna, transport, bino sotib olish (pul chiqadi) yoki sotish (pul keladi). O'sayotgan kompaniyada bu bo'lim odatda manfiy — bu normal, chunki kelajakka investitsiya qilinyapti.</p>

<h3>3. Moliyaviy faoliyat (FCF)</h3>
<p>Kapital va qarz bilan bog'liq: kredit olish (pul keladi), kreditni qaytarish yoki dividend to'lash (pul chiqadi), egalardan qo'shimcha kapital.</p>

<h2>Amaliy misol</h2>

<table>
<thead>
<tr><th>Bo'lim</th><th>Summa (mln so'm)</th><th>Nima demoqchi</th></tr>
</thead>
<tbody>
<tr><td>Operatsion oqim (OCF)</td><td>+180</td><td>Biznes o'zidan pul ishlab topyapti ✅</td></tr>
<tr><td>Investitsion oqim (ICF)</td><td>−120</td><td>Yangi uskunaga investitsiya qilindi</td></tr>
<tr><td>Moliyaviy oqim (FCF)</td><td>−30</td><td>Kredit qisman qaytarildi</td></tr>
<tr><td><strong>Sof o'zgarish</strong></td><td><strong>+30</strong></td><td>Kassa 30 mln so'mga oshdi</td></tr>
</tbody>
</table>

<p>Bu — sog'lom rasm: kompaniya asosiy biznesidan 180 mln ishlab topdi, uning bir qismini o'sishga (uskuna) va qarzni kamaytirishga yo'naltirdi, oxiri kassa hali ham oshdi.</p>

<h2>Nimaga e'tibor berish kerak?</h2>

<ul>
<li><strong>OCF musbatmi?</strong> Agar foyda bor-u OCF manfiy bo'lsa — mijozlar to'lamayapti yoki zaxira qotib qolgan. <a href="/blog/likvidlik-koeffitsienti">Likvidlik</a>ni tekshiring.</li>
<li><strong>Foyda va OCF farqi.</strong> Ikkalasi uzoq vaqt keskin farq qilsa — foyda "sifati" past.</li>
<li><strong>Kredit hisobiga yashash.</strong> OCF manfiy, lekin FCF doim musbat (yangi kreditlar) — bu vaqtinchalik va xavfli model.</li>
<li><strong>Erkin pul oqimi (FCF).</strong> OCF minus kapital xarajatlari — kompaniya egalar uchun qancha "erkin" pul qoldirayotganini ko'rsatadi.</li>
</ul>

<h2>Xulosa</h2>

<p>Pul oqimi hisoboti — biznesning "puls"ini o'lchaydi. Foyda hisoboti nima <em>ishlab topilgani</em>ni, Balans nima <em>egalik qilinishini</em>, pul oqimi esa nima <em>haqiqatan sodir bo'lganini</em> ko'rsatadi.</p>

<p>Amaliy maslahat: har oy uchta hisobotni birga o'qing. Faqat foydaga qarab qaror qabul qilish — eng keng tarqalgan moliyaviy xato.</p>
`.trim(),
};
