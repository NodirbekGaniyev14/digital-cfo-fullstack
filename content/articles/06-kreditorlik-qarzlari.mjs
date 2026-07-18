// Kreditorlik qarzlari (Accounts Payable) · standard · kw: "kreditorlik qarzlari"
export default {
  title: "Kreditorlik qarzlarini boshqarish: to'lovni qanday optimallashtirasiz?",
  slug: "kreditorlik-qarzlari",
  category: "Working Capital",
  focus_keyword: "kreditorlik qarzlari",
  seo_title: "Kreditorlik qarzlari — DPO, to'lov muddati va aylanma kapital",
  seo_description:
    "Kreditorlik qarzlari nima, DPO ko'rsatkichi nimani ko'rsatadi va yetkazib beruvchilarga to'lovni qanday oqilona boshqarasiz? Amaliy maslahatlar.",
  excerpt:
    "Kreditorlik qarzi — bu sizning yetkazib beruvchilarga qarzingiz, ya'ni bepul qisqa muddatli moliyalashtirish. Uni oqilona boshqarish kassangizni bo'shatadi. Qanday qilishni ko'rib chiqamiz.",
  cover_alt: "Kreditorlik qarzlarini boshqarish — to'lov muddatlari va DPO",
  tags: [
    "kreditorlik qarzlari", "accounts payable", "DPO", "aylanma kapital",
    "yetkazib beruvchi", "to'lov muddati", "pul oqimi", "moliyalashtirish",
    "likvidlik", "debitorlik qarzlari", "moliyaviy boshqaruv", "CFO",
  ],
  faqs: [
    {
      question: "DPO ko'rsatkichi nima?",
      answer:
        "<p>DPO (Days Payable Outstanding) — siz yetkazib beruvchilarga o'rtacha necha kunda to'lashingizni ko'rsatadi. Formula: (Kreditorlik ÷ Tovar tannarxi) × kunlar. DPO yuqori bo'lsa — pul uzoqroq sizda qoladi.</p>",
    },
    {
      question: "To'lovni imkon qadar kechiktirish yaxshimi?",
      answer:
        "<p>Ma'lum darajagacha ha — bu bepul moliyalashtirish. Lekin haddan oshsa: yetkazib beruvchi bilan munosabat buziladi, chegirmalardan mahrum bo'lasiz va obro' tushadi. Muvozanat kerak.</p>",
    },
    {
      question: "Kreditorlik ko'p bo'lsa yaxshimi yoki yomonmi?",
      answer:
        "<p>Ikkalasi ham bo'lishi mumkin. Muddatida to'lanadigan kreditorlik — sog'lom moliyalashtirish. Lekin muddati o'tgan, to'lay olmaydigan kreditorlik — likvidlik muammosi belgisi. Kontekst muhim.</p>",
    },
    {
      question: "Erta to'lash chegirmasi arziydimi?",
      answer:
        "<p>Ko'pincha ha. \"10 kunda to'lasangiz 2%\" taklifi yillik hisobda 30%+ foydaga teng bo'lishi mumkin — bu bank depozitidan ancha yuqori. Agar kassangizda bo'sh pul bo'lsa, bunday chegirmalardan foydalaning.</p>",
    },
  ],
  content: `
<p>Debitorlik — bu sizga qarzdorlar. <strong>Kreditorlik</strong> esa aksincha — bu siz qarzdorsiz. Va g'alati tuyulsa-da, kreditorlik qarzi — biznes uchun ko'pincha <em>foydali</em> narsa: u bepul qisqa muddatli moliyalashtirish.</p>

<p>Gap uni to'g'ri boshqarishda: juda tez to'lasangiz kassa bo'shaydi, juda kech to'lasangiz munosabat buziladi. Keling, muvozanatni topamiz.</p>

<h2>Kreditorlik qarzi nima?</h2>

<p><strong>Kreditorlik qarzi</strong> (Accounts Payable) — bu siz yetkazib beruvchilar, pudratchilar va boshqa hamkorlarga tovar yoki xizmat uchun to'lashingiz kerak bo'lgan, lekin hali to'lanmagan summa.</p>

<blockquote>
<p>Yetkazib beruvchi sizga 30 kun muddat bergani — bu 30 kunlik bepul kredit. Uni oqilona ishlatgan biznes kassasini kuchaytiradi.</p>
</blockquote>

<h2>Nega kreditorlik "foydali" bo'lishi mumkin?</h2>

<p>Tovarni oldingiz, lekin 30 kundan keyin to'laysiz. Shu 30 kun ichida siz tovarni sotib, pul ishlab topishingiz mumkin. Ya'ni yetkazib beruvchining puli hisobiga biznes yuritasiz — bu <strong>aylanma kapital</strong>ni yaxshilaydi.</p>

<h2>DPO: kreditorlikni o'lchash</h2>

<p>Asosiy ko'rsatkich — <strong>DPO</strong> (Days Payable Outstanding), ya'ni siz o'rtacha necha kunda to'laysiz:</p>

<p><strong>DPO = (Kreditorlik ÷ Tovar tannarxi) × Kunlar soni</strong></p>

<p>DPO yuqori bo'lsa, pul uzoqroq sizda qoladi. Lekin uni <a href="/blog/debitorlik-qarzlari">DSO</a> (mijozlar to'lash muddati) bilan birga ko'rish kerak.</p>

<h2>Oltin qoida: DPO va DSO muvozanati</h2>

<table>
<thead>
<tr><th>Holat</th><th>Natija</th></tr>
</thead>
<tbody>
<tr><td>DPO > DSO</td><td>Yaxshi 🟢 — mijozdan pul olib, keyin yetkazib beruvchiga to'laysiz</td></tr>
<tr><td>DPO ≈ DSO</td><td>Muvozanat 🟡 — pul kelib-ketishi teng</td></tr>
<tr><td>DPO < DSO</td><td>Xavf 🔴 — yetkazib beruvchiga to'laysiz, lekin mijozdan hali pul yo'q</td></tr>
</tbody>
</table>

<p>Ideal holat: mijozlardan pulni tez oling (past DSO), yetkazib beruvchiga oqilona kech to'lang (yuqoriroq DPO). Bu "pul aylanish sikli"ni qisqartiradi.</p>

<h2>Kreditorlikni oqilona boshqarish</h2>

<ol>
<li><strong>To'lov muddatini kelishib oling.</strong> Yetkazib beruvchi bilan 30–60 kunlik muddat so'rang — bu ko'pincha muzokara masalasi.</li>
<li><strong>Muddatni to'liq ishlating.</strong> Erta to'lash uchun sabab bo'lmasa (chegirma), muddat oxirigacha to'lamang.</li>
<li><strong>Chegirmani hisoblang.</strong> Erta to'lov chegirmasi katta bo'lsa — undan foydalaning; kichik bo'lsa — muddatni ishlatang.</li>
<li><strong>Muddatni buzmang.</strong> Doimiy kechikish — chegirmalardan mahrum qiladi va munosabatni buzadi.</li>
<li><strong>To'lov jadvalini tuzing.</strong> Qaysi to'lov qachon — buni <a href="/blog/pul-oqimi-hisoboti">pul oqimi</a> rejasiga bog'lang.</li>
</ol>

<h2>Xavf belgilari</h2>

<ul>
<li>Kreditorlik tez o'syapti, lekin sotuv o'smayapti</li>
<li>Muddati o'tgan qarzlar ko'payyapti</li>
<li>Yetkazib beruvchilar oldindan to'lov talab qila boshladi (ishonch tushdi)</li>
<li>Yangi tovarni faqat eski qarzni to'lab olyapsiz</li>
</ul>

<h2>Xulosa</h2>

<p>Kreditorlik boshqaruvi — bu "qachon to'lash" san'ati. Juda erta to'lasangiz — bepul moliyalashtirishdan voz kechasiz; juda kech to'lasangiz — ishonchni yo'qotasiz.</p>

<p>Amaliy maslahat: DPO va DSO ni birga kuzating. Maqsad — mijozdan pulni yetkazib beruvchiga to'lashdan <em>oldin</em> olish. Bu erishilsa, biznesingiz o'z o'sishini o'zi moliyalashtira boshlaydi.</p>
`.trim(),
};
