// Kapital byudjeti jarayoni · standard · kw: "kapital byudjeti"
export default {
  title: "Kapital byudjeti: yirik investitsiyalarni qanday tanlaysiz?",
  slug: "kapital-byudjeti",
  category: "Financial Analysis",
  focus_keyword: "kapital byudjeti",
  seo_title: "Kapital byudjeti jarayoni — yirik investitsiyalarni baholash va tanlash",
  seo_description:
    "Kapital byudjeti nima, yirik investitsiyalar (uskuna, filial, loyiha) qanday baholanadi va tanlanadi? NPV, IRR, qoplanish muddati va jarayon.",
  excerpt:
    "Cheklangan pul, ko'p investitsiya imkoniyati — qaysi birini tanlash? Kapital byudjeti jarayoni yirik xarajatlarni tizimli baholab, eng foydalisini tanlashga yordam beradi.",
  cover_alt: "Kapital byudjeti — investitsiya loyihalarini baholash va tanlash",
  tags: [
    "kapital byudjeti", "investitsiya", "NPV", "IRR", "qoplanish muddati",
    "CAPEX", "loyiha bahosi", "moliyaviy model", "kapital xarajat",
    "moliyaviy rejalashtirish", "CFO", "resurs taqsimoti",
  ],
  faqs: [
    {
      question: "Kapital byudjeti nima?",
      answer:
        "<p>Bu yirik, uzoq muddatli investitsiyalarni (uskuna, filial, katta loyiha) rejalashtirish, baholash va tanlash jarayoni. Cheklangan kapitalni eng yuqori qiymat yaratadigan loyihalarga yo'naltirishga yordam beradi.</p>",
    },
    {
      question: "Investitsiyalarni qanday baholanadi?",
      answer:
        "<p>Uch asosiy usul: <a href=\"/blog/npv-va-irr\">NPV</a> (sof joriy qiymat), IRR (ichki daromadlilik) va qoplanish muddati. NPV eng ishonchli — u pulning vaqt qiymatini hisobga oladi va mutlaq qiymat beradi.</p>",
    },
    {
      question: "Qoplanish muddati yetarlimi?",
      answer:
        "<p>Yo'q, u faqat boshlang'ich mo'ljal. Qoplanish muddati pulning vaqt qiymatini va qoplanishdan keyingi daromadni hisobga olmaydi. Uni <a href=\"/blog/npv-va-irr\">NPV</a> bilan to'ldiring.</p>",
    },
    {
      question: "Bir necha loyiha bo'lsa qaysi birini tanlayman?",
      answer:
        "<p>NPV eng yuqori bo'lganini — u eng ko'p qiymat yaratadi. Agar kapital cheklangan bo'lsa, har so'mga eng ko'p NPV beruvchilarni tanlang (NPV/investitsiya nisbati bo'yicha saralang).</p>",
    },
  ],
  content: `
<p>Biznes o'sdi va endi bir necha yirik investitsiya imkoniyati bor: yangi uskuna, ikkinchi filial, ishlab chiqarish liniyasini kengaytirish. Lekin pul cheklangan — hammasini qilib bo'lmaydi. Qaysi birini tanlash? Aynan shu savolga <strong>kapital byudjeti</strong> jarayoni javob beradi.</p>

<p>Kapital byudjeti — yirik, uzoq muddatli xarajatlarni "sezgi" emas, tizimli hisob bilan tanlash usuli. U cheklangan kapitalni eng ko'p qiymat yaratadigan joyga yo'naltiradi.</p>

<h2>Kapital byudjeti nima?</h2>

<p><strong>Kapital byudjeti</strong> (capital budgeting) — bu uzoq muddatli, yirik investitsiya (<a href="/blog/capex-va-opex">CAPEX</a>) qarorlarini rejalashtirish, baholash va tanlash jarayoni. Oddiy operatsion byudjetdan farqli, u bir necha yilga ta'sir qiladigan qarorlar bilan ishlaydi.</p>

<blockquote>
<p>Operatsion byudjet — bu yilgi xarajatlar. Kapital byudjeti — kelasi yillarni shakllantiradigan qarorlar. Xatosi ham uzoq davom etadi.</p>
</blockquote>

<h2>Nega alohida jarayon kerak?</h2>

<ul>
<li><strong>Katta pul.</strong> Xato qimmatga tushadi.</li>
<li><strong>Uzoq ta'sir.</strong> Qaror yillar davom etadi, oson qaytarib bo'lmaydi.</li>
<li><strong>Cheklangan resurs.</strong> Hammani qilib bo'lmaydi — tanlash kerak.</li>
<li><strong>Xavf.</strong> Kelajakga tayanadi, noaniqlik bor.</li>
</ul>

<h2>Baholash usullari</h2>

<table>
<thead>
<tr><th>Usul</th><th>Nima o'lchaydi</th><th>Kuchli/zaif</th></tr>
</thead>
<tbody>
<tr><td>Qoplanish muddati</td><td>Investitsiya necha yilda qaytadi</td><td>Oddiy, lekin vaqt qiymatini e'tiborsiz</td></tr>
<tr><td><a href="/blog/npv-va-irr">NPV</a></td><td>Yaratilgan sof qiymat (pulda)</td><td>Eng ishonchli</td></tr>
<tr><td>IRR</td><td>Loyihaning daromadliligi (%)</td><td>Tushunarli, ba'zan chalg'ıtadi</td></tr>
</tbody>
</table>

<h3>NPV — oltin standart</h3>
<p>NPV pulning vaqt qiymatini hisobga oladi va mutlaq qiymat (qancha pul) beradi. NPV musbat bo'lsa — loyiha qiymat yaratadi. Bir necha loyiha orasida eng yuqori NPV'lini tanlang.</p>

<h2>Kapital byudjeti jarayoni: 6 qadam</h2>

<ol>
<li><strong>Imkoniyatlarni yig'ing.</strong> Barcha investitsiya g'oyalari ro'yxati.</li>
<li><strong>Pul oqimini prognoz qiling.</strong> Har loyiha qancha pul talab qiladi va qancha keltiradi.</li>
<li><strong>Baholang.</strong> Har loyiha uchun <a href="/blog/npv-va-irr">NPV va IRR</a>.</li>
<li><strong>Xavfni hisobga oling.</strong> <a href="/blog/stsenariy-tahlili">Stsenariy tahlili</a> — yomon holatda nima bo'ladi.</li>
<li><strong>Saralang va tanlang.</strong> Kapital cheklangan bo'lsa, har so'mga eng ko'p NPV beruvchilarni.</li>
<li><strong>Kuzating.</strong> Amalga oshgach, real natija prognozga mos keldimi.</li>
</ol>

<h2>Cheklangan kapital: ustuvorlik</h2>

<p>Agar barcha yaxshi loyihaga pul yetmasa, ustuvorlik kerak. Oddiy raqamga emas, <em>samaradorlikka</em> qarang:</p>

<table>
<thead>
<tr><th>Loyiha</th><th>Investitsiya</th><th>NPV</th><th>NPV/Investitsiya</th></tr>
</thead>
<tbody>
<tr><td>A</td><td>500 mln</td><td>150 mln</td><td>0,30</td></tr>
<tr><td>B</td><td>200 mln</td><td>80 mln</td><td>0,40 🏆</td></tr>
<tr><td>C</td><td>300 mln</td><td>60 mln</td><td>0,20</td></tr>
</tbody>
</table>

<p>Mutlaq NPV bo'yicha A yetakchi (150 mln). Lekin har so'mga nisbatda B eng samarali (0,40). Cheklangan kapitalda B va boshqa yuqori nisbatli loyihalarga ustuvorlik bering.</p>

<h2>Xavfni unutmang</h2>

<p>NPV bitta stsenariyga asoslanadi. Lekin kelajak noaniq. Har loyihani <a href="/blog/stsenariy-tahlili">uch stsenariyda</a> ko'ring — pessimistik holatda ham omon qolasizmi? Yuqori NPV, lekin yuqori xavfli loyiha — past NPV, lekin xavfsiz loyixadan yomonroq bo'lishi mumkin.</p>

<h2>Keng tarqalgan xatolar</h2>

<ul>
<li><strong>Faqat qoplanish muddatiga qarash.</strong> Pulning vaqt qiymatini e'tiborsiz.</li>
<li><strong>Optimistik pul oqimi.</strong> Kelajak daromadni oshirib ko'rsatish.</li>
<li><strong>Xavfni hisobga olmaslik.</strong> Bir stsenariy — yolg'on aniqlik.</li>
<li><strong>"Sezgi bilan" tanlash.</strong> Raqamsiz qaror.</li>
<li><strong>Kuzatmaslik.</strong> Amalga oshgach, natijani tekshirmaslik.</li>
</ul>

<h2>Strategik va majburiy investitsiyalar</h2>

<p>Barcha kapital investitsiyani faqat NPV bilan baholab bo'lmaydi. Ular uch turga bo'linadi. Birinchisi — daromad keltiruvchi (yangi uskuna, filial): bularni NPV bilan baholang. Ikkinchisi — majburiy (xavfsizlik, qonun talabi, muhim ta'mir): bular NPV bermasa ham bajarilishi shart, savol faqat qanday arzonroq qilishda.</p>

<p>Uchinchisi — strategik (raqobat uchun zarur, kelajak imkoniyati): bularning foydasini raqamda aniq o'lchash qiyin, lekin ular biznesning uzoq muddatli mavqeini belgilaydi. Bu uch turni ajratish muhim — majburiy va strategik investitsiyani sof NPV bilan rad etish qisqa muddatli fikrdir. Kapital byudjetida har uch tur uchun alohida yondashuv bo'lsin.</p>

<h2>Investitsiyadan keyin: natijani tekshirish</h2>

<p>Kapital byudjeti jarayonining eng ko'p qoldirib ketiladigan qismi — <em>keyingi tekshiruv</em> (post-audit). Ya'ni investitsiya amalga oshgandan keyin, uning real natijasi prognozga mos keldimi? Ko'p biznes qaror qabul qiladi, pul sarflaydi va boshqa ishga o'tadi — real natijani hech qachon prognozga solishtirmasdan.</p>

<p>Bu tekshiruv ikki foyda beradi. Birinchidan, u joriy loyihani nazorat qiladi — agar u prognozdan orqada bo'lsa, tuzatish choralarini ko'rish mumkin. Ikkinchidan, u kelajakdagi prognozlarni yaxshilaydi: agar siz doim optimistik prognoz qilib, real natija pastroq chiqsa — buni bilib, keyingi baholashda konservativroq bo'lasiz. Bu "o'rganuvchi" jarayon vaqt o'tishi bilan kapital qarorlaringiz sifatini sezilarli oshiradi. Natijalarni <a href="/blog/oylik-moliyaviy-yopish">muntazam hisobot</a> tarkibiga qo'shing.</p>

<h2>Kichik biznesda soddalashtirilgan yondashuv</h2>

<p>To'liq kapital byudjeti jarayoni yirik kompaniyalar uchun tuyulishi mumkin, lekin uning mantig'i har biznesga foydali. Kichik biznes uchun soddalashtirilgan versiya yetarli: yirik xarid oldida uni oddiy NPV bilan tekshiring — bu aktiv qancha qo'shimcha daromad keltiradi va o'zini oqlaydimi.</p>

<p><a href="/blog/excel-moliyachi-uchun">Excelda</a> NPV va IRR funksiyalari tayyor — bir necha kirish (investitsiya, yillik pul oqimi, diskont stavkasi) bilan javob olasiz. Va agar bir necha imkoniyat bo'lsa, ularni bir jadvalda solishtiring va eng yuqori NPV beruvchisini tanlang. Bu oddiy tartib "arziydi shekilli" degan sezgiga asoslangan qarordan ancha ustun. Yirik xarajat — bu yirik xavf; uni raqam bilan tekshirish sizni ko'p qimmat xatolardan saqlaydi. Muhimi — boshlash: hatto oddiy NPV hisobi ham hech qanday tahlilsiz qaror qabul qilishdan yaxshiroq.</p>

<h2>Xulosa</h2>

<p>Kapital byudjeti — yirik investitsiyalarni sezgi emas, tizimli hisob bilan tanlash. NPV, xavf tahlili va ustuvorlik cheklangan kapitalni eng ko'p qiymat yaratadigan joyga yo'naltiradi.</p>

<p>Amaliy maslahat: keyingi yirik investitsiyani "arziydi shekilli" deb emas, <a href="/blog/npv-va-irr">NPV</a> hisoblab tanlang. Bir necha imkoniyat bo'lsa, har so'mga eng ko'p qiymat beruvchisini oling va uni <a href="/blog/stsenariy-tahlili">pessimistik stsenariyda</a> ham tekshiring. Bu jarayon katta xatolarni
 oldini oladi va kapitalingizni eng foydali joyga yo'naltiradi.</p>
`.trim(),
};
