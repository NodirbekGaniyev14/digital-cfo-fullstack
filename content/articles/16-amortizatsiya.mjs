// Amortizatsiya (Depreciation) · standard · kw: "amortizatsiya"
export default {
  title: "Amortizatsiya nima va u foydaga qanday ta'sir qiladi?",
  slug: "amortizatsiya-nima",
  category: "Financial Analysis",
  focus_keyword: "amortizatsiya",
  seo_title: "Amortizatsiya nima? Hisoblash usullari va foydaga ta'siri",
  seo_description:
    "Amortizatsiya (depreciation) nima, qanday hisoblanadi va nega u \"pulsiz xarajat\" deb ataladi? Chiziqli va tezlashtirilgan usullar, misol bilan.",
  excerpt:
    "Amortizatsiya — asosiy vositaning qiymatini uning xizmat muddati davomida bosqichma-bosqich xarajatga o'tkazish. U foydani kamaytiradi, lekin kassadan pul chiqmaydi. Buni tushunamiz.",
  cover_alt: "Amortizatsiya — asosiy vosita qiymatining yillar bo'yicha taqsimlanishi",
  tags: [
    "amortizatsiya", "depreciation", "asosiy vositalar", "eskirish", "xarajat",
    "foyda", "chiziqli amortizatsiya", "moliyaviy hisobot", "EBITDA",
    "soliq", "buxgalteriya", "CFO",
  ],
  faqs: [
    {
      question: "Amortizatsiya nima uchun \"pulsiz xarajat\" deyiladi?",
      answer:
        "<p>Chunki uskuna uchun pul allaqachon (sotib olganda) to'langan. Amortizatsiya har yili foydani kamaytiradi, lekin o'sha yili kassadan pul chiqmaydi. Shuning uchun u \"pulsiz\" (non-cash) xarajat.</p>",
    },
    {
      question: "Chiziqli va tezlashtirilgan usul farqi nima?",
      answer:
        "<p>Chiziqli usulda qiymat har yili teng qismlarga bo'linadi. Tezlashtirilgan usulda dastlabki yillarda ko'proq amortizatsiya yoziladi. Chiziqli — oddiy va keng tarqalgan; tezlashtirilgan — tez eskiradigan texnologiya uchun.</p>",
    },
    {
      question: "Amortizatsiya EBITDA'ga kiradi mi?",
      answer:
        "<p>Yo'q — aynan shuning uchun EBITDA \"amortizatsiyadan oldingi\" foyda. <a href=\"/blog/ebitda-nima\">EBITDA</a> amortizatsiyani \"o'chiradi\", chunki u pulsiz xarajat. Bu turli kompaniyalarni solishtirishni osonlashtiradi.</p>",
    },
    {
      question: "Amortizatsiya soliqqa ta'sir qiladimi?",
      answer:
        "<p>Ha. Amortizatsiya foydani kamaytirgani uchun soliqqa tortiladigan bazani ham kamaytiradi. Shuning uchun soliq qonunchiligida amortizatsiya normalari alohida belgilanadi.</p>",
    },
  ],
  content: `
<p>Kompaniya 100 mln so'mga uskuna sotib oldi. Bu pulni o'sha yili bir yo'la xarajat deb yozish to'g'rimi? Yo'q — chunki uskuna bir necha yil ishlaydi va bir necha yil davomida daromad keltiradi. Aynan shu yerda <strong>amortizatsiya</strong> ishga tushadi.</p>

<h2>Amortizatsiya nima?</h2>

<p><strong>Amortizatsiya</strong> (Depreciation) — bu asosiy vositaning (uskuna, transport, bino) qiymatini uning foydali xizmat muddati davomida bosqichma-bosqich xarajatga o'tkazish jarayoni. Ya'ni 100 mln'lik uskuna 5 yil ishlaydi bo'lsa, uning qiymati 5 yilga taqsimlanadi.</p>

<blockquote>
<p>Amortizatsiya — bu "bugun to'langan pulni kelajakdagi foydaga to'g'ri taqsimlash" tamoyili. U hisobning eng muhim mantiqiy qoidalaridan biri.</p>
</blockquote>

<h2>Nega bir yo'la xarajat qilib bo'lmaydi?</h2>

<p>Agar 100 mln'ni birinchi yili to'liq xarajat qilsangiz: 1-yil katta zarar, keyingi 4 yil esa "bepul" uskuna bilan katta foyda ko'rinadi. Bu haqiqatni buzadi. Amortizatsiya har yili teng "yuk" qo'yib, foydani realistik ko'rsatadi — bu <a href="/blog/moliyaviy-hisobot-turlari">moliyaviy hisobot</a>ning to'g'riligini ta'minlaydi.</p>

<h2>"Pulsiz xarajat" nima degani?</h2>

<p>Bu amortizatsiyaning eng muhim xususiyati. Pul uskunani sotib olgan <em>o'sha kuni</em> chiqib ketgan. Keyingi yillardagi amortizatsiya esa faqat "qog'ozdagi" xarajat — u foydani kamaytiradi, lekin kassaga tegmaydi.</p>

<p>Shuning uchun <a href="/blog/pul-oqimi-hisoboti">pul oqimi hisobotida</a> amortizatsiya foydaga qaytadan qo'shiladi — chunki u haqiqiy pul chiqimi emas.</p>

<h2>Hisoblash usullari</h2>

<h3>1. Chiziqli usul (eng oddiy)</h3>
<p><strong>Yillik amortizatsiya = Qiymat ÷ Xizmat muddati</strong></p>
<p>Misol: 100 mln uskuna, 5 yil xizmat → yiliga 20 mln.</p>

<table>
<thead>
<tr><th>Yil</th><th>Amortizatsiya</th><th>Qoldiq qiymat</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>20 mln</td><td>80 mln</td></tr>
<tr><td>2</td><td>20 mln</td><td>60 mln</td></tr>
<tr><td>3</td><td>20 mln</td><td>40 mln</td></tr>
<tr><td>4</td><td>20 mln</td><td>20 mln</td></tr>
<tr><td>5</td><td>20 mln</td><td>0</td></tr>
</tbody>
</table>

<h3>2. Tezlashtirilgan usul</h3>
<p>Dastlabki yillarda ko'proq, keyin kamroq amortizatsiya. Tez eskiradigan texnika (kompyuter, telefon) uchun mos — chunki ular boshida tez qadrsizlanadi.</p>

<h2>Amortizatsiyaning ta'siri</h2>

<ul>
<li><strong>Foydani kamaytiradi.</strong> Har yili xarajat sifatida foydadan ayiriladi.</li>
<li><strong>Soliqni kamaytiradi.</strong> Kam foyda — kam soliq bazasi.</li>
<li><strong>Pulga tegmaydi.</strong> Kassa o'zgarmaydi — pul allaqachon ketgan.</li>
<li><strong>Aktiv qiymatini kamaytiradi.</strong> Balansda uskuna qoldiq qiymati tushib boradi.</li>
</ul>

<h2>Xulosa</h2>

<p>Amortizatsiya — bu "pul chiqmaydigan xarajat" degan ilk qarashda g'alati tuyuladigan, lekin juda mantiqiy tushuncha. U yirik xaridni uning haqiqiy foydali muddatiga to'g'ri taqsimlaydi.</p>

<p>Amaliy maslahat: foydangiz past bo'lsa-yu, amortizatsiya katta bo'lsa — biznesingiz aslida ko'proq pul ishlab topayotgan bo'lishi mumkin. Shuning uchun foydani <a href="/blog/pul-oqimi-hisoboti">pul oqimi</a> va <a href="/blog/ebitda-nima">EBITDA</a> bilan birga o'qing.</p>
`.trim(),
};
