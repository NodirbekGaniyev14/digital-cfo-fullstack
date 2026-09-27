// Investitsiya qaytarish muddati · standard · kw: "qaytarish muddati"
export default {
  title: "Investitsiya qaytarish muddati: pulingiz necha yilda qaytadi?",
  slug: "qaytarish-muddati",
  category: "Financial Analysis",
  focus_keyword: "qaytarish muddati",
  seo_title: "Investitsiya qaytarish muddati (payback) — hisoblash va cheklovlar",
  seo_description:
    "Investitsiya qaytarish muddati (payback period) nima, u qanday hisoblanadi, nega oddiy va tez usul va uning NPV oldidagi cheklovlari qaysilar?",
  excerpt:
    "Uskunaga pul qo'ydingiz — u necha yilda o'zini oqlaydi? Qaytarish muddati shu oddiy savolga javob beradi. Tez va tushunarli, lekin cheklovlari bor.",
  cover_alt: "Investitsiya qaytarish muddati — payback period",
  tags: [
    "qaytarish muddati", "payback", "investitsiya", "ROI", "NPV",
    "kapital byudjeti", "moliyaviy tahlil", "risk", "pul oqimi",
    "investitsiya qarori", "CFO", "rentabellik",
  ],
  faqs: [
    {
      question: "Qaytarish muddati nima?",
      answer:
        "<p>Bu investitsiya o'zini necha yilda (yoki oyda) qoplashini ko'rsatadi. Masalan, 100 mln uskuna yiliga 25 mln keltirsa, qaytarish muddati 4 yil. U investitsiyaning \"o'zini oqlash\" tezligini o'lchaydi.</p>",
    },
    {
      question: "U qanday hisoblanadi?",
      answer:
        "<p>Oddiy shakli: investitsiya summasi ÷ yillik pul oqimi. 100 mln ÷ 25 mln = 4 yil. Agar pul oqimi har yil turlicha bo'lsa, uni yig'indi investitsiyani qoplaguncha yil-yil qo'shib boriladi.</p>",
    },
    {
      question: "Qaytarish muddatining afzalligi nima?",
      answer:
        "<p>Oddiy, tez va tushunarli. U riskni ham ko'rsatadi — qisqa muddat kam riskli (pul tez qaytadi). Ayniqsa noaniq muhitda \"pulim tez qaytsin\" degan tadbirkor uchun foydali birinchi filtr.</p>",
    },
    {
      question: "Uning cheklovi nima?",
      answer:
        "<p>Ikki katta cheklov: u <a href=\"/blog/pul-vaqt-qiymati\">pul vaqt qiymatini</a> hisobga olmaydi va qaytgandan keyingi foydani e'tiborsiz qoldiradi. Shuning uchun u <a href=\"/blog/npv-va-irr\">NPV</a> bilan birga ishlatilishi kerak, yolg'iz emas.</p>",
    },
  ],
  content: `
<p>Yangi uskunaga, jihozga yoki loyihaga pul qo'ymoqchisiz. Birinchi va eng tabiiy savol: <em>bu pul necha yilda qaytadi?</em> Aynan shu savolga <strong>qaytarish muddati</strong> (payback period) javob beradi. U eng oddiy va eng ko'p ishlatiladigan investitsiya o'lchovi — lekin uning muhim cheklovlari ham bor.</p>

<h2>Qaytarish muddati nima?</h2>

<p>Qaytarish muddati — investitsiya o'zini necha yilda (yoki oyda) qoplashini ko'rsatadi. Ya'ni sarflangan pul qancha vaqtda qaytadigan pul oqimi bilan qoplanadi. U investitsiyaning "o'zini oqlash tezligini" o'lchaydi — qancha qisqa, shuncha yaxshi.</p>

<blockquote>
<p>Qaytarish muddati — "pulim qachon qaytadi?" degan tabiiy savolning raqamli javobi. Oddiy, tushunarli va tez — shu sabab u eng ko'p ishlatiladigan birinchi filtr.</p>
</blockquote>

<h2>Qanday hisoblanadi</h2>

<p>Oddiy shakli:</p>
<p><strong>Qaytarish muddati = Investitsiya ÷ Yillik pul oqimi</strong></p>

<p>Misol: 100 mln uskuna yiliga 25 mln <a href="/blog/pul-oqimi-hisoboti">pul oqimi</a> keltiradi. Qaytarish muddati = 100 ÷ 25 = <strong>4 yil</strong>. Agar pul oqimi har yil turlicha bo'lsa, uni yil-yil qo'shib, yig'indi investitsiyani qoplagan yilni topasiz.</p>

<h2>Nega qaytarish muddati foydali?</h2>

<ul>
<li><strong>Oddiy:</strong> hisoblash oson, tushunish oson.</li>
<li><strong>Risk ko'rsatkichi:</strong> qisqa muddat kam riskli — pul tez qaytadi, kelajak noaniqligiga kam duch keladi.</li>
<li><strong>Likvidlik:</strong> pul tez qaytsa, uni qayta ishlatasiz.</li>
</ul>
<p>Ayniqsa noaniq muhitda yoki pul tang bo'lganda, "pulim tez qaytsin" degan tadbirkor uchun u foydali birinchi filtr.</p>

<h2>Cheklovi 1: pul vaqt qiymati</h2>

<p>Qaytarish muddati <a href="/blog/pul-vaqt-qiymati">pul vaqt qiymatini</a> hisobga olmaydi — u 1-yilgi 25 mln va 4-yilgi 25 mlnni teng deb qaraydi. Aslida kelajakdagi pul arzonroq. Shuning uchun u taxminiy o'lchov. Buni tuzatish uchun "diskontlangan qaytarish muddati" bor, lekin u murakkabroq.</p>

<h2>Cheklovi 2: qaytgandan keyingi foyda</h2>

<p>Ikkinchi katta cheklov: qaytarish muddati faqat pul <em>qaytgangacha</em> qaraydi, undan keyingisini e'tiborsiz qoldiradi. Misol: A loyiha 3 yilda qaytadi, keyin to'xtaydi. B loyiha 4 yilda qaytadi, lekin keyin 10 yil foyda beradi. Qaytarish muddati A'ni afzal ko'rsatadi, lekin B ancha foydaliroq. Shu sabab u yolg'iz yetarli emas.</p>

<h2>NPV bilan birga ishlating</h2>

<p>Qaytarish muddati — yaxshi <em>birinchi</em> filtr, lekin oxirgi so'z emas. Uni <a href="/blog/npv-va-irr">NPV va IRR</a> bilan birga ishlating: qaytarish muddati tezlik va riskni, NPV esa to'liq qiymat va pul vaqt qiymatini ko'rsatadi. Ikkalasi birga to'liq investitsiya qarorini beradi. Qaytarish muddati bilan zaif loyihani tez filtrlab, qolganini NPV bilan chuqur baholang.</p>

<h2>Diskontlangan qaytarish muddati</h2>

<p>Oddiy qaytarish muddatining <a href="/blog/pul-vaqt-qiymati">pul vaqt qiymati</a> cheklovini qisman tuzatadigan variant bor — <em>diskontlangan qaytarish muddati</em>. Unda kelajak pul oqimlari avval bugungi qiymatga keltiriladi (diskontlanadi), keyin qaytarish muddati hisoblanadi.</p>

<p>Bu ancha aniqroq, chunki u kelajak pulning arzonligini hisobga oladi. Natijada diskontlangan qaytarish muddati oddiysidan har doim uzunroq chiqadi (chunki kelajak pul kamroq "hisoblanadi"). U murakkabroq, lekin muhim investitsiyalar uchun arziydi. Kichik qarorda oddiy qaytarish muddati yetarli; katta, uzoq muddatli loyihada diskontlangani yoki to'g'ridan <a href="/blog/npv-va-irr">NPV</a> yaxshiroq.</p>

<h2>Xulosa</h2>

<p>Investitsiya qaytarish muddati — pul necha yilda qaytishini ko'rsatadi. U oddiy, tez va riskni aks ettiradi, shu sabab yaxshi birinchi filtr. Lekin u pul vaqt qiymatini va qaytgandan keyingi foydani hisobga olmaydi — shuning uchun <a href="/blog/npv-va-irr">NPV</a> bilan birga ishlatilishi kerak.</p>

<p>Amaliy maslahat: har investitsiya oldidan qaytarish muddatini hisoblang — bu tez va tushunarli birinchi tekshiruv. O'zingizga qabul qilsa bo'ladigan maksimal muddatni belgilang (masalan, "3 yildan ko'p bo'lsa, ko'rib chiqmayman"). Lekin yakuniy qarorni faqat unga asoslamang — qaytarish muddati tez filtr, NPV esa chuqur baho. Ikkalasi birga eng to'g'ri qaror beradi.</p>
`.trim(),
};
