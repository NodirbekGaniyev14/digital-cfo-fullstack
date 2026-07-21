// Gorizontal va vertikal tahlil · standard · kw: "gorizontal va vertikal tahlil"
export default {
  title: "Gorizontal va vertikal tahlil: hisobotni qanday o'qish kerak?",
  slug: "gorizontal-vertikal-tahlil",
  category: "Financial Analysis",
  focus_keyword: "gorizontal va vertikal tahlil",
  seo_title: "Gorizontal va vertikal tahlil — moliyaviy hisobotni o'qish usullari",
  seo_description:
    "Gorizontal (dinamika) va vertikal (tuzilma) tahlil nima, ular qanday hisoblanadi va moliyaviy hisobotdan qanday xulosa chiqariladi? Misollar bilan.",
  excerpt:
    "Xom raqamlar kam narsa aytadi. Gorizontal tahlil o'zgarishni, vertikal tahlil tuzilmani ochadi. Ikkalasi birga hisobotni ma'noli hikoyaga aylantiradi.",
  cover_alt: "Gorizontal va vertikal tahlil — dinamika va tuzilma",
  tags: [
    "gorizontal va vertikal tahlil", "gorizontal tahlil", "vertikal tahlil",
    "moliyaviy tahlil", "moliyaviy hisobot", "dinamika", "tuzilma",
    "balans tahlili", "foyda hisoboti", "koeffitsientlar", "trend", "CFO",
  ],
  faqs: [
    {
      question: "Gorizontal tahlil nima?",
      answer:
        "<p>Bu ko'rsatkichning davrlar bo'yicha o'zgarishini tahlil qilish (dinamika). Masalan, sotuv o'tgan yilga nisbatan necha foizga o'zgardi. U trendni va o'sish tezligini ko'rsatadi.</p>",
    },
    {
      question: "Vertikal tahlil nima?",
      answer:
        "<p>Bu bitta davr ichida har moddaning umumiy summadagi ulushini hisoblash (tuzilma). Masalan, tovar tannarxi daromadning necha foizi. U biznes tuzilmasini va samaradorlikni ko'rsatadi.</p>",
    },
    {
      question: "Qaysi biri muhimroq?",
      answer:
        "<p>Ikkalasi birga. Vertikal tahlil \"hozir qanday\" ekanini, gorizontal esa \"qayoqqa ketyapti\" ekanini ko'rsatadi. Bittasi yolg'iz to'liq rasm bermaydi.</p>",
    },
    {
      question: "Bu tahlillarni nimada qilaman?",
      answer:
        "<p><a href=\"/blog/excel-moliyachi-uchun\">Excel</a> yetarli: hisobot moddalarini ustunlarga qo'yib, foizlarni formula bilan hisoblang. 1C dan ma'lumotni Excelga chiqarib, shablon tuzsangiz — har oy avtomatik yangilanadi.</p>",
    },
  ],
  content: `
<p>Moliyaviy hisobotdagi xom raqamlar o'zicha kam narsa aytadi. "Sotuv 500 mln" — bu yaxshimi? Javob faqat taqqoslashda: o'tgan yilga nisbatan qanday va umumiy tuzilmada qanday o'rin egallaydi. Aynan shu ikki savolga <strong>gorizontal va vertikal tahlil</strong> javob beradi.</p>

<h2>Gorizontal tahlil — dinamika</h2>

<p><strong>Gorizontal tahlil</strong> ko'rsatkichning davrlar bo'yicha o'zgarishini o'lchaydi:</p>

<p><strong>O'zgarish % = (Joriy davr − Oldingi davr) ÷ Oldingi davr × 100%</strong></p>

<table>
<thead>
<tr><th>Modda</th><th>2025</th><th>2026</th><th>O'zgarish</th></tr>
</thead>
<tbody>
<tr><td>Daromad</td><td>800 mln</td><td>1 000 mln</td><td>+25%</td></tr>
<tr><td>Tovar tannarxi</td><td>480 mln</td><td>650 mln</td><td>+35% ⚠️</td></tr>
<tr><td>Yalpi foyda</td><td>320 mln</td><td>350 mln</td><td>+9%</td></tr>
</tbody>
</table>

<p>Xulosa darhol ko'rinadi: sotuv 25% o'sdi, lekin tannarx 35% — ya'ni tannarx sotuvdan tez o'syapti va <a href="/blog/yalpi-foyda-marjasi">marjani yeyapti</a>. Yalpi foyda faqat 9% o'sgan. Bu — tekshirish kerak bo'lgan signal.</p>

<h2>Vertikal tahlil — tuzilma</h2>

<p><strong>Vertikal tahlil</strong> har moddaning umumiydagi ulushini ko'rsatadi. Foyda hisobotida baza — daromad; balansda — jami aktivlar.</p>

<table>
<thead>
<tr><th>Modda</th><th>2025 (% daromaddan)</th><th>2026 (% daromaddan)</th></tr>
</thead>
<tbody>
<tr><td>Daromad</td><td>100%</td><td>100%</td></tr>
<tr><td>Tovar tannarxi</td><td>60%</td><td>65% ⚠️</td></tr>
<tr><td>Yalpi foyda</td><td>40%</td><td>35%</td></tr>
<tr><td>Operatsion xarajat</td><td>25%</td><td>24%</td></tr>
<tr><td>Operatsion foyda</td><td>15%</td><td>11%</td></tr>
</tbody>
</table>

<p>Bu yerda muammo aniq ko'rinadi: tannarx ulushi 60% dan 65% ga chiqqan — har sotuvdan 5% ko'proq tannarxga ketyapti. Operatsion foyda 15% dan 11% ga tushgan.</p>

<h2>Ikkalasi birga nima beradi?</h2>

<ul>
<li><strong>Vertikal:</strong> "biznes tuzilmasi qanday" — qayerga ko'p pul ketadi.</li>
<li><strong>Gorizontal:</strong> "qayoqqa ketyapti" — nima yaxshilanyapti, nima yomonlashyapti.</li>
</ul>

<p>Yuqoridagi misolda ikkalasi bir xil xulosaga olib keldi: tannarx nazoratdan chiqyapti. Endi keyingi savol — nega? Narx oshdimi, yetkazib beruvchi qimmatlashdimi, isrof ko'paydimi? Bu <a href="/blog/xarajatlarni-optimallashtirish">xarajat tahlili</a>ning ishi.</p>

<h2>Amaliy qo'llash tartibi</h2>

<ol>
<li>Hisobotni kamida 2–3 davr uchun yonma-yon qo'ying.</li>
<li>Vertikal foizlarni hisoblang (har modda / daromad).</li>
<li>Gorizontal o'zgarishni hisoblang (davrlar farqi %).</li>
<li>Eng katta og'ishlarni ajrating — hammasini emas, muhimini tekshiring.</li>
<li>Sababini toping va qaror qabul qiling.</li>
</ol>

<h2>Xulosa</h2>

<p>Gorizontal va vertikal tahlil — moliyaviy hisobotni o'qishning eng oddiy va eng kuchli usuli. Ular murakkab formulalar talab qilmaydi, lekin muammoni aniq ko'rsatadi.</p>

<p>Amaliy maslahat: <a href="/blog/excel-moliyachi-uchun">Excel</a>da bir marta shablon tuzing (moddalar qatorda, davrlar ustunda, foizlar formula bilan). Keyin har oy ma'lumotni yangilash yetarli — tahlil avtomatik chiqadi. Buni <a href="/blog/moliyaviy-hisobot-turlari">uchta hisobot</a>ning har biriga qo'llang.</p>
`.trim(),
};
