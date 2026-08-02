// Obuna biznes modeli moliyasi · standard · kw: "obuna biznes modeli"
export default {
  title: "Obuna biznes modeli: barqaror daromadni qanday quriladi?",
  slug: "obuna-biznes-modeli",
  category: "Financial Analysis",
  focus_keyword: "obuna biznes modeli",
  seo_title: "Obuna biznes modeli — MRR, churn va barqaror daromad moliyasi",
  seo_description:
    "Obuna (subscription) biznes modeli nima, MRR va churn qanday o'lchanadi va bashorat qilinadigan daromadni qanday quriladi? Amaliy ko'rsatkichlar bilan.",
  excerpt:
    "Bir martalik sotuv har oy noldan boshlanadi. Obuna modeli esa har oy takrorlanadigan, bashorat qilinadigan daromad quradi. Uning moliyasini, MRR va churn ko'rsatkichlarini ko'ramiz.",
  cover_alt: "Obuna biznes modeli — takrorlanadigan daromad va churn",
  tags: [
    "obuna biznes modeli", "subscription", "MRR", "churn", "takrorlanadigan daromad",
    "LTV", "CAC", "unit economics", "pul oqimi", "moliyaviy model",
    "barqaror daromad", "CFO",
  ],
  faqs: [
    {
      question: "Obuna modeli nima?",
      answer:
        "<p>Bu mijoz mahsulot yoki xizmat uchun bir marta emas, muntazam (oylik/yillik) to'laydigan model. Uning kuchi — bashorat qilinadigan, takrorlanadigan daromad: har oy noldan boshlamaysiz, mavjud obunachilar bazasi ustiga qurasiz.</p>",
    },
    {
      question: "MRR nima?",
      answer:
        "<p>MRR (Monthly Recurring Revenue) — oylik takrorlanadigan daromad, ya'ni barcha faol obunalardan har oy keladigan barqaror summa. U obuna biznesining eng muhim ko'rsatkichi va uning o'sishi biznes sog'ligini ko'rsatadi.</p>",
    },
    {
      question: "Churn nima va nega muhim?",
      answer:
        "<p>Churn — obunani bekor qilgan mijozlar ulushi. U obuna biznesining eng katta dushmani: yuqori churn yangi mijoz jalb qilishni \"teshik chelakni to'ldirish\"ga aylantiradi. Churnni kamaytirish ko'pincha yangi mijoz jalb qilishdan muhimroq.</p>",
    },
    {
      question: "Obuna modeli pul oqimiga qanday ta'sir qiladi?",
      answer:
        "<p>Ijobiy: barqaror, bashorat qilinadigan pul kirimi rejalashtirishni osonlashtiradi. Ayniqsa yillik oldindan to'lov kuchli — u <a href=\"/blog/aylanma-kapital-nima\">aylanma kapitalni</a> yaxshilaydi. Lekin oldindan to'lov daromad emas, majburiyat ekanini unutmang.</p>",
    },
  ],
  content: `
<p>Bir martalik sotuvga asoslangan biznesda har oy bir xil muammo: oy boshida daromad noldan boshlanadi. Kecha qancha sotgan bo'lsangiz ham, bugun yana qaytadan sotishingiz kerak. <strong>Obuna biznes modeli</strong> bu muammoni hal qiladi — u har oy takrorlanadigan, bashorat qilinadigan daromad quradi.</p>

<p>Aynan shuning uchun obuna modeli so'nggi yillarda ko'p sohaga tarqaldi: dasturiy ta'minot, ta'lim, xizmatlar, hatto tovar yetkazish. Lekin uning o'ziga xos moliyasi bor — an'anaviy sotuv ko'rsatkichlari bu yerda yetarli emas.</p>

<h2>Obuna modeli nima uchun kuchli?</h2>

<p>Uning asosiy kuchi bitta so'zda — <strong>bashorat qilinadiganlik</strong>. Bir martalik biznesda kelasi oy daromadi noma'lum. Obuna biznesida esa mavjud obunachilar bazasi kelasi oy daromadini oldindan ko'rsatadi. Bu:</p>
<ul>
<li>Rejalashtirishni osonlashtiradi</li>
<li>Pul oqimini barqarorlashtiradi</li>
<li>Biznes qiymatini oshiradi (barqaror daromad qimmatroq baholanadi)</li>
</ul>

<blockquote>
<p>Bir martalik sotuv — har oy qaytadan tog'ga chiqish. Obuna — bir marta chiqib, cho'qqida qurilgan uy. Har oy noldan emas, mavjud balandlikdan boshlaysiz.</p>
</blockquote>

<h2>Asosiy ko'rsatkich: MRR</h2>

<p><strong>MRR</strong> (Monthly Recurring Revenue, oylik takrorlanadigan daromad) — obuna biznesining yuragi. U barcha faol obunalardan har oy keladigan barqaror summa. MRR uch omildan o'sadi:</p>
<ul>
<li><strong>Yangi obunachilar</strong> — yangi MRR qo'shadi</li>
<li><strong>Kengayish</strong> — mavjud mijoz ko'proq to'lay boshlaydi (upsell)</li>
<li><strong>Churn</strong> — ketgan mijozlar MRR'ni kamaytiradi (manfiy)</li>
</ul>

<p>Sof MRR o'sishi = yangi + kengayish − churn. Bu formula obuna biznesining sog'ligini bir qarashda ko'rsatadi.</p>

<h2>Eng katta dushman: churn</h2>

<p><strong>Churn</strong> — obunani bekor qilgan mijozlar ulushi. U obuna biznesining eng jiddiy muammosi, chunki yuqori churn butun modelni buzadi. Tasavvur qiling: har oy 100 yangi mijoz jalb qilasiz, lekin 90 tasi ketadi — sof o'sish atigi 10. Bu "teshik chelakni to'ldirish".</p>

<table>
<thead>
<tr><th>Churn (oylik)</th><th>Natija</th></tr>
</thead>
<tbody>
<tr><td>2% dan past</td><td>Ajoyib — mijozlar uzoq qoladi</td></tr>
<tr><td>2–5%</td><td>Normal — kuzatuv kerak</td></tr>
<tr><td>5–10%</td><td>Yuqori — jiddiy muammo</td></tr>
<tr><td>10% dan yuqori</td><td>Model buzilgan — o'sish imkonsiz</td></tr>
</tbody>
</table>

<p>Muhim tushuncha: churnni 1% kamaytirish ko'pincha yangi mijozni 10% oshirishdan foydaliroq. Chunki mijozni ushlab qolish uni jalb qilishdan arzon.</p>

<h2>LTV va CAC obuna modelida</h2>

<p>Obuna modelida <a href="/blog/unit-economics">LTV va CAC</a> ayniqsa muhim. LTV bevosita churnga bog'liq: mijoz o'rtacha 1÷churn oy qoladi. Masalan, 5% churn — mijoz o'rtacha 20 oy qoladi. Churn past bo'lsa, LTV katta, model kuchli. LTV/CAC nisbati kamida 3 bo'lishi kerak.</p>

<h2>Pul oqimi va oldindan to'lov</h2>

<p>Obuna modeli pul oqimiga ijobiy ta'sir qiladi — barqaror kirim. Ayniqsa yillik oldindan to'lov kuchli: mijoz butun yil uchun oldindan to'laydi, bu <a href="/blog/aylanma-kapital-nima">aylanma kapitalni</a> yaxshilaydi. Lekin muhim eslatma: bu oldindan to'lov <em>daromad emas, majburiyat</em>. U har oy tegishli qismi bilan daromadga aylanadi — <a href="/blog/daromadni-tan-olish">daromadni tan olish</a> tamoyili bo'yicha.</p>

<h2>Obuna biznesini qanday kuzatish kerak</h2>

<ol>
<li><strong>MRR</strong> va uning o'sishi (yangi + kengayish − churn)</li>
<li><strong>Churn</strong> darajasi — eng muhim signal</li>
<li><strong>LTV/CAC</strong> nisbati</li>
<li><strong>Obunachilar soni</strong> dinamikasi</li>
</ol>

<p>Bu ko'rsatkichlarni <a href="/blog/moliyaviy-dashboard">dashboardda</a> muntazam kuzatib, obuna biznesini "his" emas, raqam bilan boshqarasiz.</p>

<h2>Churnni qanday kamaytirish mumkin?</h2>

<p>Churn eng muhim ko'rsatkich bo'lgani uchun, uni kamaytirish alohida e'tibor talab qiladi. Bir necha amaliy yo'nalish bor:</p>
<ul>
<li><strong>Onboarding.</strong> Mijoz birinchi kunlarda mahsulot qiymatini ko'rmasa, tez ketadi. Yaxshi kirish jarayoni churnni sezilarli kamaytiradi.</li>
<li><strong>Muntazam qiymat.</strong> Mijoz har oy nima uchun to'layotganini his qilishi kerak — yangilik, yaxshilanish, g'amxo'rlik.</li>
<li><strong>Ketish sabablarini so'rang.</strong> Har bekor qilgan mijozdan "nega" deb so'rang. Bu ma'lumot eng qimmat.</li>
<li><strong>Yillik reja taklif qiling.</strong> Yillik obuna oylikdan kam churn beradi — mijoz uzoqroq bog'lanadi.</li>
</ul>

<h2>Amaliy misol: MRR o'sishini o'qish</h2>

<p>Faraz qiling, oy boshida MRR 10 000 birlik edi. Oy davomida: yangi obunachilar 2 000 qo'shdi, mavjud mijozlar upsell orqali 500 qo'shdi, lekin churn 1 500 olib ketdi. Oy oxiri MRR = 10 000 + 2 000 + 500 − 1 500 = 11 000. Sof o'sish 1 000, ya'ni 10%.</p>

<p>Bu oddiy hisob ko'p narsani ochadi. Agar churn 1 500 o'rniga 500 bo'lganida, sof o'sish 2 000 (20%) bo'lar edi — yangi mijoz jalb qilishni oshirmasdan. Aynan shu misol churnning nega eng kuchli richag ekanini ko'rsatadi: teshikni yopish, ko'proq quyishdan arzon.</p>

<h2>Narx darajalari (tiers)</h2>

<p>Obuna modelining kuchli tomoni — narxni darajalarga bo'lish. Uch daraja (masalan, bazaviy, standart, premium) turli mijozga mos keladi va kengayish (upsell) imkonini beradi. Mijoz kichik rejadan boshlab, ehtiyoji o'sganda yuqoriga o'tadi — bu MRR'ni yangi mijoz jalb qilmasdan oshiradi. Narx darajalarini <a href="/blog/narxlash-strategiyasi">narxlash strategiyasi</a> bilan puxta ishlab chiqing: har daraja aniq qiymat farqiga ega bo'lsin, aks holda mijoz eng arzonini tanlaydi.</p>

<h2>Xulosa</h2>

<p>Obuna biznes modeli — bir martalik sotuvdan barqaror, bashorat qilinadigan daromadga o'tish. Uning moliyasi an'anaviy sotuvdan farq qiladi: MRR, churn va LTV asosiy ko'rsatkichlar bo'ladi.</p>

<p>Amaliy maslahat: agar obuna modelida ishlasangiz yoki unga o'tmoqchi bo'lsangiz, birinchi navbatda churnni o'lchang va kuzating. U obuna biznesining eng katta dushmani va eng katta imkoniyati. Churnni kamaytirish — mijozni ushlab qolish, sifat, g'amxo'rlik — ko'pincha o'sishning eng arzon va samarali yo'li. Buni <a href="/blog/unit-economics">birlik iqtisodiyoti</a> bilan birga tahlil qiling.</p>
`.trim(),
};
