// Asosiy vositalar hisobi · standard · kw: "asosiy vositalar"
export default {
  title: "Asosiy vositalar hisobi: uskuna va binoni qanday hisobga olish kerak?",
  slug: "asosiy-vositalar-hisobi",
  category: "Financial Analysis",
  focus_keyword: "asosiy vositalar",
  seo_title: "Asosiy vositalar hisobi — uskuna, bino va amortizatsiya",
  seo_description:
    "Asosiy vositalar (uskuna, bino, transport) qanday hisobga olinadi, nega ular darhol xarajat bo'lmaydi va amortizatsiya, balans qiymati qanday ishlaydi?",
  excerpt:
    "Uskuna sotib oldingiz — bu darhol xarajatmi? Yo'q. Asosiy vositalar yillar davomida ishlaydi, shuning uchun ularning xarajati ham yillarga taqsimlanadi.",
  cover_alt: "Asosiy vositalar hisobi — uskuna, bino, amortizatsiya",
  tags: [
    "asosiy vositalar", "uskuna", "amortizatsiya", "balans qiymati", "kapital xarajat",
    "capex", "moliyaviy hisobot", "buxgalteriya", "aktiv",
    "moliyaviy tahlil", "CFO", "moslashtirish prinsipi",
  ],
  faqs: [
    {
      question: "Asosiy vositalar nima?",
      answer:
        "<p>Bu biznes uzoq muddat (bir yildan ko'p) ishlatadigan qimmat aktivlar: uskuna, bino, transport, jihoz. Ular bir marta sotib olinadi, lekin yillar davomida daromad keltiradi — shu sabab ularning hisobi alohida.</p>",
    },
    {
      question: "Nega uskuna darhol xarajat bo'lmaydi?",
      answer:
        "<p>Chunki u bir yilda emas, yillar davomida ishlaydi va daromad keltiradi. <a href=\"/blog/xarajatni-tan-olish\">Moslashtirish prinsipi</a> bo'yicha uning xarajati shu yillarga taqsimlanadi — bu <a href=\"/blog/amortizatsiya-nima\">amortizatsiya</a>. Darhol yozish foydani buzadi.</p>",
    },
    {
      question: "Balans qiymati nima?",
      answer:
        "<p>Bu asosiy vositaning dastlabki qiymatidan to'plangan amortizatsiyani ayirgandan keyin qolgan qiymati. Masalan, 100 mln uskuna 3 yilda 60 mln amortizatsiya qilindi — balans qiymati 40 mln. U aktivning \"qolgan qiymati\"ni ko'rsatadi.</p>",
    },
    {
      question: "Asosiy vosita va joriy xarajat farqi nima?",
      answer:
        "<p>Joriy xarajat (masalan, xomashyo) darhol ishlatiladi va darhol yoziladi. Asosiy vosita (<a href=\"/blog/capex-va-opex\">capex</a>) uzoq ishlaydi va yillarga taqsimlanadi. Ta'mir — odatda joriy xarajat, yangi uskuna — asosiy vosita.</p>",
    },
  ],
  content: `
<p>100 million so'mlik uskuna sotib oldingiz. Bu bugungi oyning xarajatimi? Agar shunday yozsa ngiz, bu oy katta zarar, keyingi oylar esa sun'iy foyda ko'rinadi — holbuki uskuna 5 yil ishlaydi. <strong>Asosiy vositalar hisobi</strong> aynan shu muammoni hal qiladi: uzoq ishlaydigan aktivning xarajati ham uzoq davrga taqsimlanadi.</p>

<h2>Asosiy vositalar nima?</h2>

<p>Asosiy vositalar — biznes <em>uzoq muddat</em> (bir yildan ko'p) ishlatadigan qimmat aktivlar: uskuna, bino, transport, jihoz, mebel. Ularning umumiy xususiyati: bir marta sotib olinadi, lekin yillar davomida daromad keltiradi. Shu sabab ular <a href="/blog/zaxiralarni-boshqarish">zaxira</a> yoki xomashyodan farqli hisoblanadi.</p>

<blockquote>
<p>Xomashyo bir marta ishlatilib tugaydi — darhol xarajat. Uskuna yillar davomida ishlaydi — uning xarajati ham yillarga yoyiladi. Har aktiv o'z hayoti davomida "xarajat bo'ladi".</p>
</blockquote>

<h2>Nega darhol xarajat bo'lmaydi?</h2>

<p><a href="/blog/xarajatni-tan-olish">Moslashtirish prinsipi</a> sabab: xarajat u keltirgan daromad bilan bir davrda yoziladi. Uskuna 5 yil daromad keltirsa, uning xarajati ham 5 yilga taqsimlanishi kerak. Buni <a href="/blog/amortizatsiya-nima">amortizatsiya</a> qiladi — har yil uskunaning bir qismi (masalan, 20 mln) xarajat sifatida yoziladi. Bu har yil foydani real qiladi.</p>

<h2>Balans qiymati</h2>

<p>Asosiy vosita vaqt bilan "eskiradi" — uning hisobdagi qiymati kamayadi. <strong>Balans qiymati</strong> = dastlabki qiymat − to'plangan amortizatsiya:</p>
<table>
<thead>
<tr><th>Yil</th><th>Amortizatsiya</th><th>Balans qiymati</th></tr>
</thead>
<tbody>
<tr><td>0 (sotib olindi)</td><td>—</td><td>100</td></tr>
<tr><td>1</td><td>20</td><td>80</td></tr>
<tr><td>2</td><td>20</td><td>60</td></tr>
<tr><td>3</td><td>20</td><td>40</td></tr>
</tbody>
</table>
<p>Balans qiymati aktivning "qolgan qiymatini" ko'rsatadi — u <a href="/blog/balans-hisobotini-oqish">balansda</a> shu qiymatda turadi.</p>

<h2>Asosiy vosita va joriy xarajat</h2>

<p>Muhim farq: <a href="/blog/capex-va-opex">kapital xarajat (capex)</a> — asosiy vosita (uzoq ishlaydi, taqsimlanadi); <em>joriy xarajat (opex)</em> — darhol ishlatiladi (xomashyo, ijara, oylik — darhol yoziladi). Chegara ba'zan nozik: katta ta'mir (uskunani yangilaydi) — capex; oddiy ta'mir (ishlashda ushlab turadi) — joriy xarajat.</p>

<h2>Asosiy vositalarni kuzatish</h2>

<p>Asosiy vositalar ro'yxati (registri) kerak: nima, qachon olingan, dastlabki qiymat, amortizatsiya, balans qiymati, qayerda. Bu <a href="/blog/aktivlarni-boshqarish">aktiv boshqaruviga</a> yordam beradi: qaysi uskuna eskirdi, qaysi biri almashtirishni talab qiladi, qaysi biri bo'sh turibdi. Registrsiz biznes o'z asosiy vositalaridan ayrilib qoladi.</p>

<h2>Sotish va hisobdan chiqarish</h2>

<p>Asosiy vosita sotilsa yoki ishdan chiqsa, uning balans qiymati hisobdan chiqariladi. Agar sotuv narxi balans qiymatidan yuqori bo'lsa — foyda (lekin bu <a href="/blog/foyda-sifati">bir martalik foyda</a>, asosiy faoliyat emas); past bo'lsa — zarar. Buni to'g'ri yozish foydani real va <a href="/blog/foyda-sifati">sifatli</a> qiladi.</p>

<h2>Ta'mir yoki yaxshilash: qaysi biri?</h2>

<p>Ko'p tadbirkorni chalg'itadigan savol: uskunaga sarflangan pul joriy xarajatmi yoki asosiy vositaga qo'shiladimi? Qoida oddiy: <em>ta'mir</em> (uskunani ishlashda ushlab turadi) — joriy xarajat, darhol yoziladi. <em>Yaxshilash</em> (uskunani yangilaydi, quvvatini yoki umrini oshiradi) — asosiy vositaga qo'shiladi va amortizatsiya qilinadi.</p>

<p>Masalan: mashina moyini almashtirish — ta'mir (joriy). Mashina dvigatelini yangi, kuchliroqga almashtirish — yaxshilash (kapital). Bu farq foydaga ta'sir qiladi: ta'mirni darhol yozib foyda pasayadi, yaxshilashni yillarga taqsimlab foyda tekis bo'ladi. Buni to'g'ri ajratish har yil foydani real ko'rsatadi.</p>

<h2>Xulosa</h2>

<p>Asosiy vositalar — uzoq ishlaydigan qimmat aktivlar (uskuna, bino, transport). Ular darhol xarajat emas — <a href="/blog/amortizatsiya-nima">amortizatsiya</a> orqali yillarga taqsimlanadi (<a href="/blog/xarajatni-tan-olish">moslashtirish prinsipi</a>). Balans qiymati ularning qolgan qiymatini ko'rsatadi.</p>

<p>Amaliy maslahat: asosiy vositalar registrini yuriting — har aktiv, uning qiymati, amortizatsiyasi va balans qiymati. Yangi uskuna olganda, uni darhol xarajat deb emas, amortizatsiya orqali yillarga taqsimlang — bu foydani har yil real ko'rsatadi. Va aktiv eskirganda, uni o'z vaqtida hisobdan chiqarib, yangilashni rejalashtiring.</p>
`.trim(),
};
