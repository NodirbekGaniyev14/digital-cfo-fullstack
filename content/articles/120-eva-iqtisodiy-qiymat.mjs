// EVA — iqtisodiy qo'shilgan qiymat · standard · kw: "iqtisodiy qo'shilgan qiymat"
export default {
  title: "EVA (iqtisodiy qo'shilgan qiymat): biznes haqiqatan qiymat yaratyaptimi?",
  slug: "eva-iqtisodiy-qiymat",
  category: "Financial Analysis",
  focus_keyword: "iqtisodiy qo'shilgan qiymat",
  seo_title: "EVA — iqtisodiy qo'shilgan qiymat va haqiqiy foyda",
  seo_description:
    "EVA (iqtisodiy qo'shilgan qiymat) nima, u oddiy foydadan qanday farq qiladi va nega kapital narxini hisobga olib \"haqiqiy foyda\"ni ko'rsatadi? Amaliy misol.",
  excerpt:
    "Buxgalteriya foydasi ijobiy, lekin biznes qiymat yaratyaptimi? EVA kapital narxini ayirib, haqiqiy iqtisodiy foydani ko'rsatadi — ko'pincha kutilmagan javob bilan.",
  cover_alt: "EVA — iqtisodiy qo'shilgan qiymat va kapital narxi",
  tags: [
    "iqtisodiy qo'shilgan qiymat", "EVA", "kapital narxi", "haqiqiy foyda",
    "qiymat yaratish", "rentabellik", "moliyaviy tahlil", "WACC",
    "samaradorlik", "moliyaviy ko'rsatkichlar", "CFO", "investitsiya",
  ],
  faqs: [
    {
      question: "EVA nima?",
      answer:
        "<p>EVA (Economic Value Added, iqtisodiy qo'shilgan qiymat) — foydadan kapital narxini ayirib chiqadigan ko'rsatkich. U \"biznes kapital narxidan ortiq foyda topdimi\" degan savolga javob beradi. Musbat EVA — haqiqiy qiymat yaratish.</p>",
    },
    {
      question: "EVA oddiy foydadan qanday farq qiladi?",
      answer:
        "<p>Oddiy foyda kapital narxini hisobga olmaydi. EVA esa foydadan kapital narxini (WACC × kapital) ayiradi. Shuning uchun biznes \"foydali\" bo'lsa ham, agar foyda kapital narxidan past bo'lsa, EVA manfiy — qiymat yo'qotilmoqda.</p>",
    },
    {
      question: "Nega kapital narxini ayirish kerak?",
      answer:
        "<p>Chunki kapitalning ham narxi bor — u bepul emas. <a href=\"/blog/kapital-narxi\">Kapital narxi</a> egalar va kreditorlar kutgan daromad. Agar biznes shu narxni qoplamasa, u aslida qiymat yaratmaydi, balki resurslarni samarasiz ishlatadi.</p>",
    },
    {
      question: "EVA kichik biznesga foydali mi?",
      answer:
        "<p>Ha — hatto oddiy shakli fikrlashni o'zgartiradi. \"Foyda bor\" yetarli emas; \"foyda kapital narxidan ortiqmi\" — to'g'ri savol. Bu tushuncha kichik biznesni ham resurslarni samaraliroq ishlatishga undaydi.</p>",
    },
  ],
  content: `
<p>Biznesingiz 100 million foyda topdi — buxgalteriya bo'yicha ijobiy. Lekin biznes haqiqatan <em>qiymat yaratdimi</em>? G'aroyib savol, lekin muhim: agar o'sha 100 million topish uchun 800 million kapital ishlatilgan bo'lsa va o'sha kapital boshqa joyda 120 million keltirar edi — biznes aslida qiymat <em>yo'qotdi</em>. <strong>EVA</strong> (iqtisodiy qo'shilgan qiymat) aynan shuni o'lchaydi.</p>

<h2>Oddiy foydaning kamchiligi</h2>

<p>Buxgalteriya foydasi bir narsani hisobga olmaydi — <em>kapitalning narxi</em>. U daromaddan xarajatni ayiradi, lekin kapital (ega va kreditorlar puli) bepul deb hisoblaydi. Aslida kapitalning ham narxi bor: ega va kreditor evaziga daromad kutadi. Bu <a href="/blog/kapital-narxi">kapital narxi</a> (WACC).</p>

<blockquote>
<p>Oddiy foyda "xarajatdan keyin qancha qoldi" ni ko'rsatadi. EVA "kapital narxidan keyin ham qancha qoldi" ni ko'rsatadi. Ikkinchisi — haqiqiy iqtisodiy foyda.</p>
</blockquote>

<h2>EVA formulasi</h2>

<p><strong>EVA = Operatsion foyda − (Kapital narxi × Kapital)</strong></p>

<p>Ya'ni foydadan kapital "ijarasi"ni ayirasiz. Agar musbat qolsa — biznes kapital narxidan <em>ortiq</em> foyda topdi, haqiqiy qiymat yaratdi. Manfiy bo'lsa — foydali ko'rinsa ham, qiymat yo'qotdi.</p>

<h2>Misol bilan</h2>

<table>
<thead>
<tr><th></th><th>Biznes A</th><th>Biznes B</th></tr>
</thead>
<tbody>
<tr><td>Operatsion foyda</td><td>100</td><td>100</td></tr>
<tr><td>Kapital</td><td>400</td><td>800</td></tr>
<tr><td>Kapital narxi (20%)</td><td>80</td><td>160</td></tr>
<tr><td>EVA</td><td>+20</td><td>−60</td></tr>
</tbody>
</table>

<p>Ikkalasi ham 100 foyda topdi — teng ko'rinadi. Lekin A biznes 400 kapital bilan (EVA +20, qiymat yaratdi), B biznes 800 kapital bilan (EVA −60, qiymat yo'qotdi). Oddiy foyda buni ko'rsatmaydi — EVA ko'rsatadi.</p>

<h2>Nega bu muhim?</h2>

<p>EVA fikrlashni o'zgartiradi: "foyda bor" yetarli emas, "foyda kapital narxidan ortiqmi" — to'g'ri savol. Bu:</p>
<ul>
<li>Resurslarni samarali ishlatishga undaydi</li>
<li>Kapitalni behuda bog'lashdan saqlaydi</li>
<li>Haqiqiy qiymat yaratishni oddiy foydadan ajratadi</li>
</ul>

<h2>EVA'ni qanday oshirish</h2>

<ul>
<li><strong>Foydani oshiring:</strong> marja, samaradorlik (kapital o'zgarmasdan).</li>
<li><strong>Kapitalni kamaytiring:</strong> <a href="/blog/aktivlarni-boshqarish">bo'sh aktiv</a>ni ozod qiling, <a href="/blog/naqd-konversiya-sikli">sikl</a> qisqartiring.</li>
<li><strong>Kapital narxini tushiring:</strong> optimal <a href="/blog/qarz-kapital-nisbati">qarz-kapital</a> muvozanati.</li>
</ul>

<h2>EVA fikrlashni qanday o'zgartiradi</h2>

<p>EVA ning eng katta qiymati — u fikrlashni o'zgartiradi. "Foyda bor" degan xotirjamlikdan "kapital narxidan ortiq foyda bormi" degan qattiqroq savolga o'tkazadi. Bu fikr biznesni ikki narsaga undaydi: foydani oshirish <em>va</em> kapitalni samarali ishlatish.</p>

<p>An'anaviy foyda fikri kapitalni "bepul" deb ko'radi, shuning uchun menejerlar kapitalni behuda bog'laydi — ortiqcha zaxira, bo'sh aktiv, sekin debitorlik. EVA fikri esa har birlik kapitalning narxi borligini eslatadi, shuning uchun kapitalni ozod qilishga (bo'sh aktivni sotish, siklni qisqartirish) undaydi. Bu — resurslarni aqlli ishlatish madaniyati.</p>

<h2>EVA va boshqaruv qarorlari</h2>

<p>EVA qarorlarni ham to'g'rilaydi. Yangi investitsiya, yangi loyiha yoki kengaytirish EVA'ga qanday ta'sir qiladi? Agar u kapital narxidan ortiq keltirsa — EVA'ni oshiradi, qiymat yaratadi. Agar yo'q — EVA'ni tushiradi, garchi foyda ko'rinishda oshsa ham. Bu mezon <a href="/blog/kapital-taqsimoti">kapital taqsimoti</a> qarorlarini to'g'rilaydi: pulni eng ko'p EVA yaratadigan yo'nalishga yo'naltirasiz. EVA — "foydali ko'rinish"dan "haqiqiy qiymat"ga o'tishning kaliti.</p>

<h2>Xulosa</h2>

<p>EVA (iqtisodiy qo'shilgan qiymat) — foydadan kapital narxini ayirib, biznes haqiqatan qiymat yaratganini ko'rsatadi. Oddiy foydadan farqli, u kapitalning narxini hisobga oladi — shuning uchun "foydali" biznes ham EVA bo'yicha qiymat yo'qotayotgan bo'lishi mumkin.</p>

<p>Amaliy maslahat: o'z biznesingiz uchun taxminiy EVA'ni hisoblang — operatsion foydadan kapital narxingizni (WACC × kapital) ayiring. Agar natija manfiy bo'lsa, biznes foydali ko'rinsa ham, resurslarni samarasiz ishlatmoqda. Bu tushuncha sizni "foyda bor" fikrlashdan "kapital narxidan ortiq foyda topayapmanmi" fikrlashga ko'taradi — bu esa haqiqiy qiymat yaratishning kaliti.</p>
`.trim(),
};
