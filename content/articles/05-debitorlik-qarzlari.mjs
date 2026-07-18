// Debitorlik qarzlari (Accounts Receivable) · standard · kw: "debitorlik qarzlari"
export default {
  title: "Debitorlik qarzlarini boshqarish: pulingizni qanday qaytarasiz?",
  slug: "debitorlik-qarzlari",
  category: "Working Capital",
  focus_keyword: "debitorlik qarzlari",
  seo_title: "Debitorlik qarzlarini boshqarish — DSO, muddat nazorati va inkasso",
  seo_description:
    "Debitorlik qarzlari nima, DSO ko'rsatkichi qanday hisoblanadi va mijozlardan pulni o'z vaqtida qanday undirasiz? Amaliy boshqaruv usullari.",
  excerpt:
    "Sotdingiz, lekin pul kelmadi — debitorlik qarzi ana shu. U katta bo'lsa, foyda bor-u kassa bo'sh bo'ladi. Debitorlikni qanday o'lchash va nazorat qilishni ko'rib chiqamiz.",
  cover_alt: "Debitorlik qarzlarini boshqarish — to'lov muddatlari va DSO",
  tags: [
    "debitorlik qarzlari", "accounts receivable", "DSO", "aylanma kapital",
    "to'lov muddati", "inkasso", "pul oqimi", "likvidlik", "qarz undirish",
    "mijoz to'lovi", "moliyaviy boshqaruv", "CFO",
  ],
  faqs: [
    {
      question: "DSO ko'rsatkichi nima?",
      answer:
        "<p>DSO (Days Sales Outstanding) — mijozlar o'rtacha necha kunda to'lashini ko'rsatadi. Formula: (Debitorlik ÷ Daromad) × kunlar soni. DSO qancha kichik bo'lsa, pul shuncha tez qaytadi.</p>",
    },
    {
      question: "Debitorlik qancha bo'lsa normal?",
      answer:
        "<p>Universal me'yor yo'q — bu tarmoq va to'lov shartlariga bog'liq. Muhimi: DSO to'lov muddatidan (masalan, 30 kun) sezilarli oshmasin va vaqt o'tishi bilan o'smasin.</p>",
    },
    {
      question: "Mijoz to'lamasa nima qilish kerak?",
      answer:
        "<p>Bosqichma-bosqich: muddatdan oldin eslatma → muddatda muloyim so'rov → kechikkanda rasmiy xat → jiddiy kechikishda to'lov rejasi yoki yuridik yo'l. Eng muhimi — kechikishni <em>e'tiborsiz qoldirmaslik</em>.</p>",
    },
    {
      question: "Debitorlikni qanday kamaytiraman?",
      answer:
        "<p>Oldindan to'lov yoki bo'nak talab qilish, to'lov muddatini qisqartirish, erta to'lovga chegirma taklif qilish va yangi mijozlarni tekshirish. Diversifikatsiya ham muhim — bitta mijozga qaram bo'lmang.</p>",
    },
  ],
  content: `
<p>Savdo bo'ldi, hisob-faktura yuborildi, foyda hisobotida daromad paydo bo'ldi. Ammo pul hali bank hisobingizda emas — u mijozda. Bu — <strong>debitorlik qarzi</strong>, va u biznesning eng "sokin" muammolaridan biri.</p>

<p>Debitorlik katta bo'lsa, hisobotda foyda ko'rinadi, lekin kassa bo'sh bo'ladi. Keling, uni qanday boshqarishni o'rganamiz.</p>

<h2>Debitorlik qarzi nima?</h2>

<p><strong>Debitorlik qarzi</strong> (Accounts Receivable) — bu mijozlar sizga tovar yoki xizmat uchun to'lashi kerak bo'lgan, lekin hali to'lanmagan summa. Boshqacha aytganda — bu sizning puluingiz, lekin vaqtincha boshqalarda.</p>

<blockquote>
<p>Sotuv — bu sovg'a emas, qarz. Pul bank hisobingizga tushmaguncha, savdo yakunlanmagan.</p>
</blockquote>

<h2>Nega debitorlikni nazorat qilish muhim?</h2>

<ul>
<li><strong>Pul kassada emas.</strong> Katta debitorlik = katta "muzlagan" pul. Uni ish haqi yoki yetkazib beruvchiga ishlata olmaysiz.</li>
<li><strong>Likvidlik riski.</strong> Foyda bor, lekin to'lash uchun pul yo'q — <a href="/blog/pul-oqimi-hisoboti">pul oqimi</a> muammosining asosiy sababi.</li>
<li><strong>Yo'qotish xavfi.</strong> Qarz qancha eski bo'lsa, uni undirish shuncha qiyin.</li>
</ul>

<h2>DSO: debitorlikni o'lchash</h2>

<p>Asosiy ko'rsatkich — <strong>DSO</strong> (Days Sales Outstanding), ya'ni mijozlar o'rtacha necha kunda to'laydi:</p>

<p><strong>DSO = (Debitorlik ÷ Daromad) × Kunlar soni</strong></p>

<p>Misol: Debitorlik 150 mln, yillik daromad 1 200 mln bo'lsa:</p>
<p>DSO = (150 ÷ 1200) × 365 = <strong>~46 kun</strong></p>

<p>Ya'ni pul o'rtacha 46 kunda qaytadi. Agar to'lov shartingiz 30 kun bo'lsa — 16 kunlik kechikish bor, buni tekshirish kerak.</p>

<h2>Debitorlikni "yoshi" bo'yicha tahlil qilish</h2>

<p>Barcha qarzni birga ko'rmang — uni muddat bo'yicha guruhlang (aging report):</p>

<table>
<thead>
<tr><th>Muddat</th><th>Summa</th><th>Xavf darajasi</th></tr>
</thead>
<tbody>
<tr><td>Muddati kelmagan</td><td>90 mln</td><td>Normal 🟢</td></tr>
<tr><td>1–30 kun kechikkan</td><td>35 mln</td><td>Kuzatuv 🟡</td></tr>
<tr><td>31–60 kun kechikkan</td><td>18 mln</td><td>Faol ishlash 🟠</td></tr>
<tr><td>60+ kun kechikkan</td><td>7 mln</td><td>Yuqori xavf 🔴</td></tr>
</tbody>
</table>

<p>Eski qarzlar (60+ kun) alohida e'tibor talab qiladi — ular ko'pincha umuman qaytmaydigan qarzga aylanadi.</p>

<h2>Debitorlikni kamaytirish usullari</h2>

<ol>
<li><strong>Yangi mijozni tekshiring.</strong> Yirik qarzga sotishdan oldin mijozning to'lov qobiliyatini baholang.</li>
<li><strong>Aniq shartlar qo'ying.</strong> To'lov muddati, kechikish jarimasi shartnomada yozilsin.</li>
<li><strong>Bo'nak oling.</strong> Ayniqsa yirik yoki yangi buyurtmalarda oldindan qisman to'lov.</li>
<li><strong>Erta to'lovni rag'batlantiring.</strong> "10 kunda to'lasangiz 2% chegirma" — pulni tezlashtiradi.</li>
<li><strong>Muntazam eslating.</strong> Muddat kelishidan oldin do'stona eslatma yuboring — ko'p kechikish shunchaki unutishdan.</li>
<li><strong>Kechikkanni darhol ishlang.</strong> Kechikish qancha uzoq — undirish shuncha qiyin.</li>
</ol>

<h2>Xulosa</h2>

<p>Debitorlik boshqaruvi — bu "sotdim, ish tugadi" degan fikrdan "pul keldi, ish tugadi" degan fikrga o'tish. Sog'lom biznes tez sotadi va tez pul oladi.</p>

<p>Amaliy maslahat: har oy DSO ko'rsatkichini hisoblang va debitorlikni yoshi bo'yicha ko'ring. Agar DSO o'sib borsa — bu kassa muammosining birinchi ogohlantirishi. Debitorlik va <a href="/blog/kreditorlik-qarzlari">kreditorlik</a> muvozanati aylanma kapital sog'ligini belgilaydi.</p>
`.trim(),
};
