// Zararsizlik nuqtasi (Break-even) · standard · kw: "zararsizlik nuqtasi"
export default {
  title: "Zararsizlik nuqtasi (Break-even) nima va qanday hisoblanadi?",
  slug: "zararsizlik-nuqtasi",
  category: "Financial Analysis",
  focus_keyword: "zararsizlik nuqtasi",
  seo_title: "Zararsizlik nuqtasi nima? Break-even formulasi va amaliy hisob",
  seo_description:
    "Zararsizlik nuqtasi (break-even) nima, qanday hisoblanadi va biznes qachon foyda ko'ra boshlaydi? Doimiy va o'zgaruvchan xarajat, formula va misol.",
  excerpt:
    "Zararsizlik nuqtasi — biznes na zarar, na foyda ko'radigan sotuv darajasi. Undan yuqorisi — foyda. Uni qanday hisoblash va qarorlarda qanday ishlatishni ko'rib chiqamiz.",
  cover_alt: "Zararsizlik nuqtasi grafigi — doimiy xarajat, daromad va foyda zonasi",
  tags: [
    "zararsizlik nuqtasi", "break-even", "doimiy xarajat", "o'zgaruvchan xarajat",
    "marjinal foyda", "narxlash", "moliyaviy rejalashtirish", "biznes reja",
    "foyda", "xarajat tahlili", "byudjet", "CFO",
  ],
  faqs: [
    {
      question: "Zararsizlik nuqtasi qanday hisoblanadi?",
      answer:
        "<p>Formula: Doimiy xarajatlar ÷ (Birlik narxi − Birlik o'zgaruvchan xarajati). Natija — foydaga chiqish uchun sotish kerak bo'lgan birliklar soni. Uni pulda ham hisoblash mumkin: Doimiy xarajat ÷ Marja foizi.</p>",
    },
    {
      question: "Doimiy va o'zgaruvchan xarajat farqi nima?",
      answer:
        "<p>Doimiy xarajat sotuvdan qat'i nazar o'zgarmaydi (ijara, ish haqi, amortizatsiya). O'zgaruvchan xarajat sotuv bilan o'zgaradi (xomashyo, tovar tannarxi, komissiya). Zararsizlik hisobida bu farq muhim.</p>",
    },
    {
      question: "Zararsizlik nuqtasi nima uchun kerak?",
      answer:
        "<p>U bir nechta savolga javob beradi: minimal qancha sotish kerak, narxni o'zgartirsam nima bo'ladi, yangi mahsulot arziydimi, chegirma qancha xavfli. Bu — narxlash va rejalashtirish uchun asosiy asbob.</p>",
    },
    {
      question: "Xavfsizlik marjasi nima?",
      answer:
        "<p>Bu joriy sotuv zararsizlik nuqtasidan qancha yuqori ekanini ko'rsatadi. Masalan, zararsizlik 700 birlik, siz 1000 sotasiz — xavfsizlik marjasi 30%. Sotuv 30% tushsa ham zarar ko'rmaysiz.</p>",
    },
  ],
  content: `
<p>Yangi biznes yoki mahsulot boshlashdan oldin har bir tadbirkor bitta savolga javob berishi kerak: <strong>"Foydaga chiqish uchun qancha sotishim kerak?"</strong> Aynan shu savolga <strong>zararsizlik nuqtasi</strong> javob beradi.</p>

<h2>Zararsizlik nuqtasi nima?</h2>

<p><strong>Zararsizlik nuqtasi</strong> (Break-even Point) — bu biznes na zarar, na foyda ko'radigan sotuv darajasi. Ya'ni bu nuqtada umumiy daromad umumiy xarajatga <em>aynan teng</em>. Undan yuqorisi — foyda zonasi, pastrog'i — zarar zonasi.</p>

<blockquote>
<p>Zararsizlik nuqtasi — bu biznesning "nol chizig'i". Uni bilmasangiz, siz foyda qilyapsizmi yoki yo'qmi — noaniqligicha qoladi.</p>
</blockquote>

<h2>Ikki turdagi xarajat</h2>

<p>Zararsizlikni tushunish uchun avval xarajatlarni ikkiga ajratish kerak:</p>

<table>
<thead>
<tr><th>Doimiy xarajat</th><th>O'zgaruvchan xarajat</th></tr>
</thead>
<tbody>
<tr><td>Sotuvdan qat'i nazar o'zgarmaydi</td><td>Sotuv bilan o'zgaradi</td></tr>
<tr><td>Ijara, ish haqi (ma'muriy)</td><td>Xomashyo, tovar tannarxi</td></tr>
<tr><td>Amortizatsiya, sug'urta</td><td>Sotuv komissiyasi, yetkazib berish</td></tr>
</tbody>
</table>

<h2>Formula va hisob</h2>

<p><strong>Zararsizlik (birlikda) = Doimiy xarajat ÷ (Narx − O'zgaruvchan xarajat)</strong></p>

<p>Maxrajdagi qism — <strong>marjinal foyda</strong> (har bir sotilgan birlik doimiy xarajatni qoplashga qancha hissa qo'shishi).</p>

<h3>Amaliy misol</h3>

<p>Aytaylik, siz mahsulot sotasiz:</p>
<ul>
<li>Birlik narxi: 50 000 so'm</li>
<li>Birlik o'zgaruvchan xarajati: 30 000 so'm</li>
<li>Oylik doimiy xarajat: 14 000 000 so'm</li>
</ul>

<p>Marjinal foyda = 50 000 − 30 000 = <strong>20 000 so'm</strong></p>
<p>Zararsizlik = 14 000 000 ÷ 20 000 = <strong>700 birlik</strong></p>

<p>Ya'ni oyiga 700 birlik sotsangiz — nol. 701-birlikdan boshlab har biri 20 000 so'm sof foyda beradi.</p>

<h2>Zararsizlik nuqtasidan qanday foydalanish mumkin?</h2>

<ul>
<li><strong>Maqsad qo'yish.</strong> "700 sotish kerak" — aniq, o'lchanadigan sotuv maqsadi.</li>
<li><strong>Narx qarorlari.</strong> Narxni oshirsangiz zararsizlik pasayadi, chegirma bersangiz oshadi. Oldindan hisoblang.</li>
<li><strong>Yangi mahsulot baholash.</strong> Yangi loyiha zararsizlikka qachon chiqadi? Bu — investitsiya qarorining asosi.</li>
<li><strong>Xavfni o'lchash.</strong> Joriy sotuv zararsizlikdan qancha yuqori — bu sizning xavfsizlik marjangiz.</li>
</ul>

<h2>Xavfsizlik marjasi</h2>

<p>Agar hozir oyiga 1000 birlik sotsangiz, zararsizlik esa 700 bo'lsa:</p>

<p><strong>Xavfsizlik marjasi = (1000 − 700) ÷ 1000 = 30%</strong></p>

<p>Ya'ni sotuvingiz 30% tushsa ham hali zarar ko'rmaysiz. Bu ko'rsatkich past bo'lsa — biznes zaif, kichik pasayish ham zararga olib keladi.</p>

<h2>Xulosa</h2>

<p>Zararsizlik nuqtasi — bu har bir tadbirkor bilishi shart bo'lgan raqam. U murakkab emas, lekin narxlash, rejalashtirish va xavf baholashda asosiy tayanch nuqta bo'lib xizmat qiladi.</p>

<p>Amaliy maslahat: bugun o'z biznesingiz uchun zararsizlik nuqtasini hisoblang. Agar joriy sotuvingiz unga yaqin bo'lsa — bu jiddiy ogohlantirish, xarajat yoki narx bo'yicha choralar ko'rish vaqti keldi. Bu tahlilni <a href="/blog/budjetlashtirish-nima">budjetlashtirish</a> jarayoniga ham qo'shing.</p>
`.trim(),
};
