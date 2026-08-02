import { createContext, useContext, useEffect, useState } from "react";

/**
 * Sayt holati: til (uz/ru/en) + kontakt modal ochiq/yopiq.
 * t(key) — joriy til bo'yicha qiymat (matn, massiv yoki obyekt); topilmasa uz.
 */

export const LANGS = [
  { code: "uz", label: "O'zbekcha", short: "Uz" },
  { code: "ru", label: "Русский", short: "Ru" },
  { code: "en", label: "English", short: "En" },
];

const DICT = {
  // ======================= O'ZBEKCHA =======================
  uz: {
    "nav.home": "Bosh sahifa", "nav.how": "Qanday ishlaydi", "nav.free": "Bepul tahlil",
    "nav.services": "Xizmatlar", "nav.kpi": "KPI Tahlil", "nav.pricing": "Narxlar",
    "nav.faq": "FAQ", "nav.demo": "Demo", "nav.articles": "Maqolalar",
    "nav.contact": "Biz bilan bog'lanish",

    "modal.title": "Mutaxassis bilan bog'lanish",
    "modal.heroTitle": "Digital CFO — biznesingizning AI moliyaviy direktori.",
    "modal.heroText": "Korxonangiz moliyaviy holatini avtomatik tahlil qilamiz: 1C hisobotlaringizdan 20+ ko'rsatkich, risk diagnostikasi va amaliy tavsiyalar bilan CFO darajasidagi PDF hisobotni bir necha daqiqada qaytaramiz. Savollaringiz bo'lsa — mutaxassisimiz yordam beradi.",
    "modal.feat1": "40+ moliyaviy KPI bo'yicha chuqur tahlil va risk diagnostikasi",
    "modal.feat2": "Bir necha daqiqada tayyor professional PDF hisobot",
    "modal.feat3": "Ma'lumotlaringiz xavfsiz va maxfiy saqlanadi",
    "modal.name": "Ismingiz", "modal.namePh": "To'liq ismingiz",
    "modal.contactLabel": "Siz bilan qanday bog'lanish mumkin? Kamida bittasini to'ldiring",
    "modal.email": "Elektron pochta", "modal.phone": "Telefon raqami", "modal.telegram": "Telegram nikingiz",
    "modal.message": "Xabar", "modal.messagePh": "Sizga qanday yordam bera olamiz?",
    "modal.submit": "Ariza yuborish", "modal.sending": "Yuborilmoqda…",
    "modal.successTitle": "Arizangiz qabul qilindi!",
    "modal.successText": "Raqamingiz: {ref}. Mutaxassisimiz tez orada siz bilan bog'lanadi.",
    "modal.errName": "Iltimos, ismingizni kiriting",
    "modal.errContact": "Kamida bitta bog'lanish usulini to'ldiring",
    "modal.errGeneric": "Yuborib bo'lmadi. Birozdan so'ng qayta urinib ko'ring.",
    "modal.another": "Yana ariza yuborish",

    "hero.badge": "AI-powered moliyaviy tahlil",
    "hero.titleA": "Moliyaviy Kelajagingizni ", "hero.titleB": "AI Boshqaruviga", "hero.titleC": " Topshiring",
    "hero.subtitle": "Balans va moliyaviy hisobotingizni yuboring — biz ularni chuqur tahlil qilib, KPI'lar va amaliy tavsiyalar bilan tayyor CFO darajasidagi hisobotni qaytaramiz.",
    "hero.ctaStart": "Bepul boshlash", "hero.ctaDemo": "Demo ko'rish",
    "hero.trust": ["Xavfsiz", "AI tahlil", "Tez natija", "PDF hisobot"],
    "hero.sample": "Namuna", "hero.monthly": "OYLIK DINAMIKA",
    "hero.aiDone": "AI tahlil tugallandi", "hero.pdfReady": "PDF tayyor",
    "hero.aiCard": "AI Tahlil", "hero.aiCardSub": "Real vaqtda",
    "hero.pdfCard": "PDF Hisobot", "hero.pdfCardSub": "Yuklab olishga tayyor",

    "ps.eyebrow": "Nega Digital CFO", "ps.title": "Eski usullarni unuting",
    "ps.problemsTitle": "Hozirgi muammolar", "ps.solutionsTitle": "Digital CFO yechimi",
    "ps.problems": ["Murakkab va tushunarsiz moliyaviy hisobotlar", "Tahlil juda ko'p vaqt talab qiladi", "Qo'lda hisoblashda xatoliklar ko'p", "Malakali CFO tahliliga erishish qiyin va qimmat", "Qaror qabul qilish jarayoni sekin"],
    "ps.solutions": ["Faylni bir necha soniyada yuklash", "Avtomatik tekshiruv va validatsiya", "Aniq KPI ko'rsatkichlarini hisoblash", "AI tomonidan chuqur moliyaviy tahlil", "Tayyor professional PDF hisobot", "Amaliy va aniq tavsiyalar"],

    "how.eyebrow": "Jarayon", "how.title": "Qanday ishlaydi",
    "how.subtitle": "Faylni yuklashdan tayyor hisobotgacha — atigi besh qadam.",
    "how.steps": [
      { title: "Faylni yuklang", desc: "Excel (.xlsx/.xls) moliyaviy faylingizni tizimga yuklang." },
      { title: "Validatsiya", desc: "Tizim ma'lumotlarni avtomatik tekshiradi va tozalaydi." },
      { title: "KPI hisoblash", desc: "Barcha asosiy moliyaviy ko'rsatkichlar hisoblanadi." },
      { title: "AI tahlil", desc: "Sun'iy intellekt natijalarni chuqur tahlil qiladi." },
      { title: "PDF hisobot", desc: "Tayyor professional hisobotni yuklab oling." },
    ],
    "how.dlLabel": "Namuna fayllar:",
    "how.dlBalans": "Shakl 1 — Balans",
    "how.dlMoliya": "Shakl 2 — Moliyaviy natijalar",
    "how.dlPdf": "Namuna hisobot (PDF)",

    "ia.eyebrow": "Bepul tahlil", "ia.title": "Faylingizni hoziroq sinab ko'ring",
    "ia.subA": "Balans va Moliyaviy hisobotni yuklang — umumiy ball va ",
    "ia.subBold": "5 ta asosiy ko'rsatkich", "ia.subB": " bepul ko'rinadi. To'liq tahlil (~50 ko'rsatkich + PDF hisobot) Telegram botda.",
    "ia.subFree": "Saytda bir marta bepul · faylingiz saqlanmaydi.",
    "ia.balans": "1. Balans (Shakl 1)", "ia.moliyaviy": "2. Moliyaviy natijalar (Shakl 2)",
    "ia.pick": "Faylni tanlang (.xlsx, .xls)", "ia.analyze": "Tahlil qilish", "ia.analyzing": "Tahlil qilinmoqda...",
    "ia.usedHead": "Bepul tahlildan foydalandingiz",
    "ia.usedText": "Saytdagi bepul tahlil bir martalik. Cheksiz tahlil, barcha ~50 ko'rsatkich va to'liq PDF hisobotlar uchun Telegram botimizdan foydalaning.",
    "ia.toGoBot": "Telegram botga o'tish",
    "ia.report": "Moliyaviy tahlil", "ia.period": "Davr", "ia.verdict": "Umumiy baho",
    "ia.good": "Yaxshi", "ia.warn": "Chegaraviy", "ia.bad": "Past",
    "ia.mainInd": "Asosiy ko'rsatkichlar", "ia.open": "ochiq",
    "ia.lockedMore": "Yana {n} ta ko'rsatkich yopiq",
    "ia.lockedText": "Likvidlik, barqarorlik, rentabellik, aylanuvchanlik va o'sishning barcha ko'rsatkichlari, pul oqimi tahlili, xulosa-tavsiyalar va",
    "ia.fullPdf": " to'liq PDF hisobot", "ia.botPart": " — Telegram botda.",
    "ia.botFull": "Telegram botda to'liq ko'rish",
    "ia.noPl": "Shakl 2 (Moliyaviy natijalar) topilmadi — ba'zi ko'rsatkichlar hisoblanmadi. To'liq tahlil uchun ikkala shaklni yuklang.",
    "ia.tOnlyExcel": "Faqat .xlsx yoki .xls qabul qilinadi", "ia.tMax": "Fayl 15 MB dan oshmasligi kerak",
    "ia.tPickFirst": "Avval fayl(lar)ni tanlang", "ia.tReady": "Asosiy ko'rsatkichlar tayyor!", "ia.tFail": "Tahlil amalga oshmadi",
    "ia.lockedNames": ["Tezkor likvidlik", "Avtonomiya koeffitsienti", "Sof rentabellik (ROS)", "Aktivlar aylanuvchanligi", "Debitorlik aylanishi (kun)", "Sotuv o'sish sur'ati"],

    "rm.eyebrow": "Yo'l xaritasi", "rm.title": "Mahsulot bosqichlari",
    "rm.phases": [
      { label: "01-bosqich", title: "Asos", items: ["Arxitektura", "UI dizayn", "Ma'lumotlar bazasi"] },
      { label: "02-bosqich", title: "Yuklash tizimi", items: ["Fayl yuklash", "Format tekshirish", "Saqlash"] },
      { label: "03-bosqich", title: "To'lov", items: ["Payme / Click", "Tariflar", "Cheklar"] },
      { label: "04-bosqich", title: "KPI Engine", items: ["Likvidlik", "Rentabellik", "Risk hisob"] },
      { label: "05-bosqich", title: "AI Engine", items: ["Tahlil modeli", "Tavsiyalar", "Benchmark"] },
      { label: "06-bosqich", title: "PDF Hisobot", items: ["Shablon", "Grafiklar", "Eksport"] },
      { label: "07-bosqich", title: "Sinov", items: ["Beta test", "Xatolar", "Optimallash"] },
      { label: "08-bosqich", title: "Ishga tushirish", items: ["Marketing", "Qo'llab-quvvatlash", "Kengaytirish"] },
    ],

    "sv.eyebrow": "Xizmatlar", "sv.title": "Biz nima taklif qilamiz",
    "sv.services": [
      { title: "Moliyaviy fayl tahlili", desc: "Excel (.xlsx/.xls) fayllarini avtomatik o'qish va qayta ishlash." },
      { title: "KPI Dashboard", desc: "Barcha ko'rsatkichlar bitta interaktiv panelda." },
      { title: "AI CFO hisobot", desc: "Sun'iy intellekt asosida chuqur moliyaviy tahlil." },
      { title: "Risk diagnostikasi", desc: "Moliyaviy risklarni aniqlash va baholash." },
      { title: "PDF hisobot yaratish", desc: "Professional ko'rinishdagi tayyor hisobotlar." },
      { title: "Konsalting", desc: "Tajribali mutaxassislar bilan maslahat." },
      { title: "Oylik monitoring", desc: "Biznesingizni doimiy kuzatib borish." },
      { title: "Biznes maslahat", desc: "Strategik qarorlar uchun amaliy tavsiyalar." },
    ],

    "kpi.eyebrow": "KPI Tahlil", "kpi.title": "Avtomatik hisoblangan ko'rsatkichlar",
    "kpi.subtitle": "AI har bir moliyaviy nisbatni hisoblaydi va benchmark bilan solishtiradi.",
    "kpi.sample": "Namuna ma'lumotlar — haqiqiy ko'rsatkichlar sizning faylingiz asosida hisoblanadi",
    "kpi.items": [
      { bench: "YAXSHI", desc: "Joriy likvidlik me'yordan yuqori." },
      { bench: "YAXSHI", desc: "Tezkor likvidlik barqaror." },
      { bench: "YAXSHI", desc: "Qarz darajasi past va xavfsiz." },
      { bench: "YAXSHI", desc: "Sof foyda marjasi o'smoqda." },
      { bench: "YAXSHI", desc: "Operatsion samaradorlik yuqori." },
      { bench: "DIQQAT", desc: "Pul oqimida ozgina bosim bor." },
      { bench: "YAXSHI", desc: "Umumiy risk darajasi past." },
      { bench: "A'LO", desc: "100 balldan moliyaviy salomatlik." },
    ],

    "pdf.eyebrow": "PDF Hisobot", "pdf.title": "Professional hisobot tarkibi",
    "pdf.subtitle": "Har bir hisobot tahlilchi tomonidan tayyorlangandek aniq va to'liq — bir tugma bilan yuklab oling.",
    "pdf.items": ["Boshqaruv xulosasi (Executive Summary)", "Asosiy KPI ko'rsatkichlari jadvali", "Likvidlik va to'lov qobiliyati tahlili", "Rentabellik va foyda dinamikasi", "Risk diagnostikasi va baholash", "AI tavsiyalari va xulosalar"],
    "pdf.view": "Namuna ko'rish", "pdf.download": "Namunani yuklab olish",
    "pdf.docTitle": "Moliyaviy Tahlil Hisoboti",

    "demo.title": "Namunaviy hisobot", "demo.close": "Yopish",
    "demo.fallback": "Brauzeringiz PDF'ni shu yerda ko'rsata olmadi — namunaviy hisobotni yuklab olib ko'ring.",
    "demo.videoTitle": "Demo video", "demo.videoSub": "Digital CFO · Namuna",

    "tm.eyebrow": "Sharhlar", "tm.title": "Mijozlarimiz fikri",
    "tm.sample": "Namuna sharhlar — tez orada haqiqiy mijoz fikrlari bilan to'ldiriladi",
    "tm.reviews": [
      { role: "Direktor, savdo kompaniyasi", text: "Avval hisobotlarni tushunish uchun buxgalterga murojaat qilardik. Endi faylni yuklasak — KPI va tavsiyalar tayyor. Vaqtni juda tejadik." },
      { role: "Moliyaviy menejer, ishlab chiqarish", text: "Likvidlik va risk ko'rsatkichlari aniq ko'rsatilgan. Rahbariyatga taqdimot qilish ancha osonlashdi." },
      { role: "Tadbirkor, xizmat ko'rsatish", text: "PDF hisobot professional ko'rinishda chiqadi. Investorlar bilan suhbatda aynan shu hujjat yordam berdi." },
    ],

    "pr.eyebrow": "Narxlar", "pr.title": "Sizga mos tarif",
    "pr.name": "Bir martalik tahlil", "pr.per": "1 ta tahlil uchun",
    "pr.note": "🎉 Aksiya narxi", "pr.badge": "Aksiya", "pr.sum": "so'm", "pr.cta": "Hoziroq boshlash",
    "pr.features": ["Moliyaviy fayl tahlili", "To'liq KPI hisoblash", "AI CFO hisoboti", "Risk diagnostikasi", "Professional PDF hisobot"],

    "faq.eyebrow": "FAQ", "faq.title": "Ko'p so'raladigan savollar",
    "faq.items": [
      { q: "Qaysi fayl formatlari qabul qilinadi?", a: "Tizim .xlsx va .xls formatdagi moliyaviy fayllarni qabul qiladi. Fayl avtomatik tekshiriladi va validatsiyadan o'tkaziladi." },
      { q: "Tahlil qancha vaqt oladi?", a: "Tahlilni atigi 1 daqiqada yetkazamiz — faylni yuborishingiz bilan hisobot tayyor bo'ladi." },
      { q: "Xizmat pullikmi?", a: "Hozirda barcha tahlillar to'liq bepul. Pullik tariflar joriy etilganda saytda va botda oldindan e'lon qilamiz." },
      { q: "Tahlil ishonchliligi qanchalik?", a: "Har bir hisobot tajribali mutaxassis nazoratidan o'tadi va natijalar benchmark ko'rsatkichlar bilan solishtirib tekshiriladi." },
      { q: "Hisobotni yuklab olsa bo'ladimi?", a: "Ha, har bir tahlil yakunida professional PDF hisobotni bir tugma bilan yuklab olishingiz mumkin." },
      { q: "Ma'lumotlarim xavfsizmi?", a: "Ma'lumotlaringiz himoyalangan (HTTPS) ulanish orqali uzatiladi, faqat tahlil maqsadida ishlatiladi va uchinchi shaxslarga berilmaydi." },
    ],

    "db.eyebrow": "Statistika", "db.title": "Boshqaruv paneli",
    "db.live": "Jonli statistika · har kuni 03:00 da yangilanadi",
    "db.sampleStatus": "Interfeys namunasi — tez orada jonli statistika",
    "db.users": "Foydalanuvchilar", "db.visits": "Murojaatlar", "db.reports": "Tahlillar", "db.todayActive": "Bugun faol",
    "db.composition": "Foydalanuvchilar tarkibi", "db.phoneShared": "Telefon ulashgan", "db.premiumUsers": "Premium foydalanuvchilar",
    "db.brief": "Qisqacha", "db.totalReports": "Jami tahlillar",
    "db.lastUpdate": "Oxirgi yangilanish", "db.updatedDaily": "Statistika har kuni 03:00 da yangilanadi",
    "db.agent": "AI Sotuv agenti", "db.funnel": "Konversiya voronkasi",
    "db.fStartPhone": "Start → Telefon", "db.fPhoneReport": "Telefon → Hisobot", "db.fReportPremium": "Hisobot → Premium",
    "db.aConversations": "Suhbatlar", "db.aMessages": "AI xabarlari", "db.aVideos": "Videolar", "db.aReminders": "Eslatmalar",

    "ft.about": "AI yordamida moliyaviy tahlil va hisobot — biznesingiz uchun raqamli moliyaviy direktor.",
    "ft.links": "Havolalar", "ft.servicesTitle": "Xizmatlar", "ft.contactTitle": "Aloqa",
    "ft.services": ["Moliyaviy tahlil", "KPI Dashboard", "AI hisobot", "Risk diagnostika", "Konsalting"],
    "ft.rights": "© 2026 Digital CFO. Barcha huquqlar himoyalangan.",
    "ft.privacy": "Maxfiylik siyosati", "ft.terms": "Foydalanish shartlari",
  },

  // ======================= РУССКИЙ =======================
  ru: {
    "nav.home": "Главная", "nav.how": "Как работает", "nav.free": "Бесплатный анализ",
    "nav.services": "Услуги", "nav.kpi": "KPI анализ", "nav.pricing": "Цены",
    "nav.faq": "FAQ", "nav.demo": "Демо", "nav.articles": "Статьи",
    "nav.contact": "Связаться с нами",

    "modal.title": "Связаться со специалистом",
    "modal.heroTitle": "Digital CFO — AI финансовый директор вашего бизнеса.",
    "modal.heroText": "Мы автоматически анализируем финансовое состояние вашей компании: из отчётов 1С — 20+ показателей, диагностика рисков и практические рекомендации в виде PDF-отчёта уровня CFO за несколько минут. Есть вопросы — наш специалист поможет.",
    "modal.feat1": "Глубокий анализ по 40+ финансовым KPI и диагностика рисков",
    "modal.feat2": "Готовый профессиональный PDF-отчёт за несколько минут",
    "modal.feat3": "Ваши данные в безопасности и конфиденциальны",
    "modal.name": "Ваше имя", "modal.namePh": "Полное имя",
    "modal.contactLabel": "Как с вами связаться? Заполните хотя бы одно",
    "modal.email": "Электронная почта", "modal.phone": "Номер телефона", "modal.telegram": "Ник в Telegram",
    "modal.message": "Сообщение", "modal.messagePh": "Чем мы можем помочь?",
    "modal.submit": "Отправить заявку", "modal.sending": "Отправка…",
    "modal.successTitle": "Заявка принята!",
    "modal.successText": "Ваш номер: {ref}. Наш специалист скоро свяжется с вами.",
    "modal.errName": "Пожалуйста, укажите имя",
    "modal.errContact": "Заполните хотя бы один способ связи",
    "modal.errGeneric": "Не удалось отправить. Попробуйте позже.",
    "modal.another": "Отправить ещё заявку",

    "hero.badge": "Финансовый анализ на базе AI",
    "hero.titleA": "Доверьте Финансовое Будущее ", "hero.titleB": "AI-Управлению", "hero.titleC": "",
    "hero.subtitle": "Отправьте баланс и финансовый отчёт — мы глубоко проанализируем их и вернём готовый отчёт уровня CFO с KPI и практическими рекомендациями.",
    "hero.ctaStart": "Начать бесплатно", "hero.ctaDemo": "Смотреть демо",
    "hero.trust": ["Безопасно", "AI анализ", "Быстрый результат", "PDF отчёт"],
    "hero.sample": "Образец", "hero.monthly": "ДИНАМИКА ПО МЕСЯЦАМ",
    "hero.aiDone": "AI анализ завершён", "hero.pdfReady": "PDF готов",
    "hero.aiCard": "AI Анализ", "hero.aiCardSub": "В реальном времени",
    "hero.pdfCard": "PDF Отчёт", "hero.pdfCardSub": "Готов к скачиванию",

    "ps.eyebrow": "Почему Digital CFO", "ps.title": "Забудьте старые методы",
    "ps.problemsTitle": "Текущие проблемы", "ps.solutionsTitle": "Решение Digital CFO",
    "ps.problems": ["Сложные и непонятные финансовые отчёты", "Анализ занимает слишком много времени", "Много ошибок при ручном расчёте", "Качественный анализ CFO труднодоступен и дорог", "Медленный процесс принятия решений"],
    "ps.solutions": ["Загрузка файла за несколько секунд", "Автоматическая проверка и валидация", "Точный расчёт KPI-показателей", "Глубокий финансовый анализ от AI", "Готовый профессиональный PDF-отчёт", "Практические и точные рекомендации"],

    "how.eyebrow": "Процесс", "how.title": "Как это работает",
    "how.subtitle": "От загрузки файла до готового отчёта — всего пять шагов.",
    "how.steps": [
      { title: "Загрузите файл", desc: "Загрузите финансовый файл Excel (.xlsx/.xls) в систему." },
      { title: "Валидация", desc: "Система автоматически проверяет и очищает данные." },
      { title: "Расчёт KPI", desc: "Рассчитываются все основные финансовые показатели." },
      { title: "AI анализ", desc: "Искусственный интеллект глубоко анализирует результаты." },
      { title: "PDF отчёт", desc: "Скачайте готовый профессиональный отчёт." },
    ],
    "how.dlLabel": "Образцы файлов:",
    "how.dlBalans": "Форма 1 — Баланс",
    "how.dlMoliya": "Форма 2 — Фин. результаты",
    "how.dlPdf": "Образец отчёта (PDF)",

    "ia.eyebrow": "Бесплатный анализ", "ia.title": "Попробуйте свой файл прямо сейчас",
    "ia.subA": "Загрузите баланс и финансовый отчёт — общий балл и ",
    "ia.subBold": "5 основных показателей", "ia.subB": " видны бесплатно. Полный анализ (~50 показателей + PDF-отчёт) в Telegram-боте.",
    "ia.subFree": "Один раз бесплатно на сайте · ваш файл не сохраняется.",
    "ia.balans": "1. Баланс (Форма 1)", "ia.moliyaviy": "2. Финансовые результаты (Форма 2)",
    "ia.pick": "Выберите файл (.xlsx, .xls)", "ia.analyze": "Анализировать", "ia.analyzing": "Анализируется...",
    "ia.usedHead": "Вы воспользовались бесплатным анализом",
    "ia.usedText": "Бесплатный анализ на сайте — разовый. Для безлимитного анализа, всех ~50 показателей и полных PDF-отчётов используйте наш Telegram-бот.",
    "ia.toGoBot": "Перейти в Telegram-бот",
    "ia.report": "Финансовый анализ", "ia.period": "Период", "ia.verdict": "Общая оценка",
    "ia.good": "Хорошо", "ia.warn": "Пограничный", "ia.bad": "Низкий",
    "ia.mainInd": "Основные показатели", "ia.open": "открыто",
    "ia.lockedMore": "Ещё {n} показателей закрыто",
    "ia.lockedText": "Все показатели ликвидности, устойчивости, рентабельности, оборачиваемости и роста, анализ денежного потока, выводы-рекомендации и",
    "ia.fullPdf": " полный PDF-отчёт", "ia.botPart": " — в Telegram-боте.",
    "ia.botFull": "Смотреть полностью в Telegram-боте",
    "ia.noPl": "Форма 2 (Финансовые результаты) не найдена — часть показателей не рассчитана. Для полного анализа загрузите обе формы.",
    "ia.tOnlyExcel": "Принимаются только .xlsx или .xls", "ia.tMax": "Файл не должен превышать 15 МБ",
    "ia.tPickFirst": "Сначала выберите файл(ы)", "ia.tReady": "Основные показатели готовы!", "ia.tFail": "Анализ не выполнен",
    "ia.lockedNames": ["Быстрая ликвидность", "Коэффициент автономии", "Чистая рентабельность (ROS)", "Оборачиваемость активов", "Оборачиваемость дебиторки (дни)", "Темп роста продаж"],

    "rm.eyebrow": "Дорожная карта", "rm.title": "Этапы продукта",
    "rm.phases": [
      { label: "Этап 01", title: "Основа", items: ["Архитектура", "UI дизайн", "База данных"] },
      { label: "Этап 02", title: "Система загрузки", items: ["Загрузка файлов", "Проверка формата", "Хранение"] },
      { label: "Этап 03", title: "Оплата", items: ["Payme / Click", "Тарифы", "Чеки"] },
      { label: "Этап 04", title: "KPI Engine", items: ["Ликвидность", "Рентабельность", "Расчёт рисков"] },
      { label: "Этап 05", title: "AI Engine", items: ["Модель анализа", "Рекомендации", "Бенчмарк"] },
      { label: "Этап 06", title: "PDF Отчёт", items: ["Шаблон", "Графики", "Экспорт"] },
      { label: "Этап 07", title: "Тестирование", items: ["Бета-тест", "Ошибки", "Оптимизация"] },
      { label: "Этап 08", title: "Запуск", items: ["Маркетинг", "Поддержка", "Расширение"] },
    ],

    "sv.eyebrow": "Услуги", "sv.title": "Что мы предлагаем",
    "sv.services": [
      { title: "Анализ финансовых файлов", desc: "Автоматическое чтение и обработка файлов Excel (.xlsx/.xls)." },
      { title: "KPI Dashboard", desc: "Все показатели на одной интерактивной панели." },
      { title: "AI CFO отчёт", desc: "Глубокий финансовый анализ на базе AI." },
      { title: "Диагностика рисков", desc: "Выявление и оценка финансовых рисков." },
      { title: "Создание PDF-отчёта", desc: "Готовые отчёты профессионального вида." },
      { title: "Консалтинг", desc: "Консультации с опытными специалистами." },
      { title: "Ежемесячный мониторинг", desc: "Постоянное наблюдение за вашим бизнесом." },
      { title: "Бизнес-консультация", desc: "Практические рекомендации для стратегических решений." },
    ],

    "kpi.eyebrow": "KPI анализ", "kpi.title": "Автоматически рассчитанные показатели",
    "kpi.subtitle": "AI рассчитывает каждый финансовый коэффициент и сравнивает с бенчмарком.",
    "kpi.sample": "Образец данных — реальные показатели рассчитываются на основе вашего файла",
    "kpi.items": [
      { bench: "ХОРОШО", desc: "Текущая ликвидность выше нормы." },
      { bench: "ХОРОШО", desc: "Быстрая ликвидность стабильна." },
      { bench: "ХОРОШО", desc: "Уровень долга низкий и безопасный." },
      { bench: "ХОРОШО", desc: "Чистая маржа прибыли растёт." },
      { bench: "ХОРОШО", desc: "Операционная эффективность высокая." },
      { bench: "ВНИМАНИЕ", desc: "В денежном потоке небольшое давление." },
      { bench: "ХОРОШО", desc: "Общий уровень риска низкий." },
      { bench: "ОТЛИЧНО", desc: "Финансовое здоровье из 100 баллов." },
    ],

    "pdf.eyebrow": "PDF Отчёт", "pdf.title": "Содержание профессионального отчёта",
    "pdf.subtitle": "Каждый отчёт точен и полон, как от аналитика — скачайте одной кнопкой.",
    "pdf.items": ["Управленческое резюме (Executive Summary)", "Таблица ключевых KPI", "Анализ ликвидности и платёжеспособности", "Рентабельность и динамика прибыли", "Диагностика и оценка рисков", "Рекомендации и выводы AI"],
    "pdf.view": "Смотреть образец", "pdf.download": "Скачать образец",
    "pdf.docTitle": "Отчёт финансового анализа",

    "demo.title": "Образец отчёта", "demo.close": "Закрыть",
    "demo.fallback": "Ваш браузер не может показать PDF здесь — скачайте образец отчёта.",
    "demo.videoTitle": "Демо-видео", "demo.videoSub": "Digital CFO · Пример",

    "tm.eyebrow": "Отзывы", "tm.title": "Мнения наших клиентов",
    "tm.sample": "Образцы отзывов — скоро будут заполнены реальными мнениями клиентов",
    "tm.reviews": [
      { role: "Директор, торговая компания", text: "Раньше для понимания отчётов мы обращались к бухгалтеру. Теперь загружаем файл — KPI и рекомендации готовы. Сильно сэкономили время." },
      { role: "Финансовый менеджер, производство", text: "Показатели ликвидности и риска показаны чётко. Делать презентации руководству стало намного проще." },
      { role: "Предприниматель, услуги", text: "PDF-отчёт выглядит профессионально. Именно этот документ помог в разговоре с инвесторами." },
    ],

    "pr.eyebrow": "Цены", "pr.title": "Подходящий тариф",
    "pr.name": "Разовый анализ", "pr.per": "за 1 анализ",
    "pr.note": "🎉 Акционная цена", "pr.badge": "Акция", "pr.sum": "сум", "pr.cta": "Начать сейчас",
    "pr.features": ["Анализ финансового файла", "Полный расчёт KPI", "AI CFO отчёт", "Диагностика рисков", "Профессиональный PDF-отчёт"],

    "faq.eyebrow": "FAQ", "faq.title": "Часто задаваемые вопросы",
    "faq.items": [
      { q: "Какие форматы файлов принимаются?", a: "Система принимает финансовые файлы в форматах .xlsx и .xls. Файл автоматически проверяется и проходит валидацию." },
      { q: "Сколько времени занимает анализ?", a: "Анализ доставляем всего за 1 минуту — как только вы отправите файл, отчёт будет готов." },
      { q: "Сервис платный?", a: "Сейчас все анализы полностью бесплатны. О введении платных тарифов мы заранее объявим на сайте и в боте." },
      { q: "Насколько надёжен анализ?", a: "Каждый отчёт проходит контроль опытного специалиста, а результаты сверяются с эталонными показателями." },
      { q: "Можно ли скачать отчёт?", a: "Да, по завершении каждого анализа вы можете скачать профессиональный PDF-отчёт одной кнопкой." },
      { q: "Мои данные в безопасности?", a: "Ваши данные передаются через защищённое (HTTPS) соединение, используются только для анализа и не передаются третьим лицам." },
    ],

    "db.eyebrow": "Статистика", "db.title": "Панель управления",
    "db.live": "Живая статистика · обновляется ежедневно в 03:00",
    "db.sampleStatus": "Образец интерфейса — скоро живая статистика",
    "db.users": "Пользователи", "db.visits": "Обращения", "db.reports": "Анализы", "db.todayActive": "Активны сегодня",
    "db.composition": "Состав пользователей", "db.phoneShared": "Поделились телефоном", "db.premiumUsers": "Premium-пользователи",
    "db.brief": "Кратко", "db.totalReports": "Всего анализов",
    "db.lastUpdate": "Последнее обновление", "db.updatedDaily": "Статистика обновляется ежедневно в 03:00",
    "db.agent": "AI агент продаж", "db.funnel": "Воронка конверсии",
    "db.fStartPhone": "Старт → Телефон", "db.fPhoneReport": "Телефон → Отчёт", "db.fReportPremium": "Отчёт → Premium",
    "db.aConversations": "Диалоги", "db.aMessages": "AI сообщения", "db.aVideos": "Видео", "db.aReminders": "Напоминания",

    "ft.about": "Финансовый анализ и отчёты с помощью AI — цифровой финансовый директор для вашего бизнеса.",
    "ft.links": "Ссылки", "ft.servicesTitle": "Услуги", "ft.contactTitle": "Контакты",
    "ft.services": ["Финансовый анализ", "KPI Dashboard", "AI отчёт", "Диагностика рисков", "Консалтинг"],
    "ft.rights": "© 2026 Digital CFO. Все права защищены.",
    "ft.privacy": "Политика конфиденциальности", "ft.terms": "Условия использования",
  },

  // ======================= ENGLISH =======================
  en: {
    "nav.home": "Home", "nav.how": "How it works", "nav.free": "Free analysis",
    "nav.services": "Services", "nav.kpi": "KPI Analysis", "nav.pricing": "Pricing",
    "nav.faq": "FAQ", "nav.demo": "Demo", "nav.articles": "Articles",
    "nav.contact": "Contact us",

    "modal.title": "Contact a specialist",
    "modal.heroTitle": "Digital CFO — the AI financial director for your business.",
    "modal.heroText": "We automatically analyze your company's financial health: from your 1C reports we deliver 20+ metrics, risk diagnostics and practical recommendations in a CFO-level PDF report — in minutes. Have questions? Our specialist will help.",
    "modal.feat1": "Deep analysis across 40+ financial KPIs with risk diagnostics",
    "modal.feat2": "A ready professional PDF report in minutes",
    "modal.feat3": "Your data stays secure and confidential",
    "modal.name": "Your name", "modal.namePh": "Full name",
    "modal.contactLabel": "How can we reach you? Fill in at least one",
    "modal.email": "Email", "modal.phone": "Phone number", "modal.telegram": "Telegram username",
    "modal.message": "Message", "modal.messagePh": "How can we help you?",
    "modal.submit": "Send request", "modal.sending": "Sending…",
    "modal.successTitle": "Request received!",
    "modal.successText": "Your reference: {ref}. Our specialist will contact you shortly.",
    "modal.errName": "Please enter your name",
    "modal.errContact": "Fill in at least one contact method",
    "modal.errGeneric": "Could not send. Please try again later.",
    "modal.another": "Send another request",

    "hero.badge": "AI-powered financial analysis",
    "hero.titleA": "Hand Your Financial Future to ", "hero.titleB": "AI Management", "hero.titleC": "",
    "hero.subtitle": "Send your balance sheet and financial report — we analyze them in depth and return a CFO-level report with KPIs and practical recommendations.",
    "hero.ctaStart": "Start free", "hero.ctaDemo": "Watch demo",
    "hero.trust": ["Secure", "AI analysis", "Fast results", "PDF report"],
    "hero.sample": "Sample", "hero.monthly": "MONTHLY DYNAMICS",
    "hero.aiDone": "AI analysis complete", "hero.pdfReady": "PDF ready",
    "hero.aiCard": "AI Analysis", "hero.aiCardSub": "Real time",
    "hero.pdfCard": "PDF Report", "hero.pdfCardSub": "Ready to download",

    "ps.eyebrow": "Why Digital CFO", "ps.title": "Forget the old ways",
    "ps.problemsTitle": "Current problems", "ps.solutionsTitle": "The Digital CFO solution",
    "ps.problems": ["Complex, confusing financial reports", "Analysis takes too much time", "Manual calculations are error-prone", "Quality CFO analysis is hard and expensive to get", "Slow decision-making process"],
    "ps.solutions": ["Upload a file in seconds", "Automatic checks and validation", "Accurate KPI calculation", "Deep financial analysis by AI", "A ready professional PDF report", "Practical, precise recommendations"],

    "how.eyebrow": "Process", "how.title": "How it works",
    "how.subtitle": "From uploading a file to a ready report — just five steps.",
    "how.steps": [
      { title: "Upload the file", desc: "Upload your Excel (.xlsx/.xls) financial file to the system." },
      { title: "Validation", desc: "The system automatically checks and cleans the data." },
      { title: "KPI calculation", desc: "All key financial metrics are computed." },
      { title: "AI analysis", desc: "AI analyzes the results in depth." },
      { title: "PDF report", desc: "Download the ready professional report." },
    ],
    "how.dlLabel": "Sample files:",
    "how.dlBalans": "Form 1 — Balance sheet",
    "how.dlMoliya": "Form 2 — Income statement",
    "how.dlPdf": "Sample report (PDF)",

    "ia.eyebrow": "Free analysis", "ia.title": "Try your file right now",
    "ia.subA": "Upload the balance sheet and financial report — the overall score and ",
    "ia.subBold": "5 key metrics", "ia.subB": " are shown for free. The full analysis (~50 metrics + PDF report) is in the Telegram bot.",
    "ia.subFree": "Free once on the site · your file is not stored.",
    "ia.balans": "1. Balance sheet (Form 1)", "ia.moliyaviy": "2. Financial results (Form 2)",
    "ia.pick": "Choose a file (.xlsx, .xls)", "ia.analyze": "Analyze", "ia.analyzing": "Analyzing...",
    "ia.usedHead": "You've used the free analysis",
    "ia.usedText": "The free analysis on the site is one-time. For unlimited analysis, all ~50 metrics and full PDF reports, use our Telegram bot.",
    "ia.toGoBot": "Open the Telegram bot",
    "ia.report": "Financial analysis", "ia.period": "Period", "ia.verdict": "Overall score",
    "ia.good": "Good", "ia.warn": "Borderline", "ia.bad": "Low",
    "ia.mainInd": "Key metrics", "ia.open": "open",
    "ia.lockedMore": "{n} more metrics locked",
    "ia.lockedText": "All liquidity, stability, profitability, turnover and growth metrics, cash-flow analysis, conclusions and recommendations, and",
    "ia.fullPdf": " the full PDF report", "ia.botPart": " — in the Telegram bot.",
    "ia.botFull": "See the full report in the Telegram bot",
    "ia.noPl": "Form 2 (Financial results) was not found — some metrics were not calculated. Upload both forms for the full analysis.",
    "ia.tOnlyExcel": "Only .xlsx or .xls are accepted", "ia.tMax": "File must not exceed 15 MB",
    "ia.tPickFirst": "Choose file(s) first", "ia.tReady": "Key metrics ready!", "ia.tFail": "Analysis failed",
    "ia.lockedNames": ["Quick ratio", "Autonomy coefficient", "Net profitability (ROS)", "Asset turnover", "Receivables turnover (days)", "Sales growth rate"],

    "rm.eyebrow": "Roadmap", "rm.title": "Product phases",
    "rm.phases": [
      { label: "Phase 01", title: "Foundation", items: ["Architecture", "UI design", "Database"] },
      { label: "Phase 02", title: "Upload system", items: ["File upload", "Format check", "Storage"] },
      { label: "Phase 03", title: "Payment", items: ["Payme / Click", "Plans", "Receipts"] },
      { label: "Phase 04", title: "KPI Engine", items: ["Liquidity", "Profitability", "Risk scoring"] },
      { label: "Phase 05", title: "AI Engine", items: ["Analysis model", "Recommendations", "Benchmark"] },
      { label: "Phase 06", title: "PDF Report", items: ["Template", "Charts", "Export"] },
      { label: "Phase 07", title: "Testing", items: ["Beta test", "Bugs", "Optimization"] },
      { label: "Phase 08", title: "Launch", items: ["Marketing", "Support", "Scaling"] },
    ],

    "sv.eyebrow": "Services", "sv.title": "What we offer",
    "sv.services": [
      { title: "Financial file analysis", desc: "Automatic reading and processing of Excel (.xlsx/.xls) files." },
      { title: "KPI Dashboard", desc: "All metrics on one interactive panel." },
      { title: "AI CFO report", desc: "Deep financial analysis powered by AI." },
      { title: "Risk diagnostics", desc: "Identify and assess financial risks." },
      { title: "PDF report generation", desc: "Ready, professional-looking reports." },
      { title: "Consulting", desc: "Advice from experienced specialists." },
      { title: "Monthly monitoring", desc: "Continuous tracking of your business." },
      { title: "Business advice", desc: "Practical recommendations for strategic decisions." },
    ],

    "kpi.eyebrow": "KPI Analysis", "kpi.title": "Automatically computed metrics",
    "kpi.subtitle": "AI computes each financial ratio and compares it against a benchmark.",
    "kpi.sample": "Sample data — real metrics are computed from your file",
    "kpi.items": [
      { bench: "GOOD", desc: "Current ratio is above the norm." },
      { bench: "GOOD", desc: "Quick ratio is stable." },
      { bench: "GOOD", desc: "Debt level is low and safe." },
      { bench: "GOOD", desc: "Net profit margin is growing." },
      { bench: "GOOD", desc: "Operating efficiency is high." },
      { bench: "CAUTION", desc: "Slight pressure in the cash flow." },
      { bench: "GOOD", desc: "Overall risk level is low." },
      { bench: "EXCELLENT", desc: "Financial health out of 100." },
    ],

    "pdf.eyebrow": "PDF Report", "pdf.title": "Professional report contents",
    "pdf.subtitle": "Every report is as precise and complete as one made by an analyst — download with one click.",
    "pdf.items": ["Executive Summary", "Key KPI metrics table", "Liquidity and solvency analysis", "Profitability and profit dynamics", "Risk diagnostics and assessment", "AI recommendations and conclusions"],
    "pdf.view": "View sample", "pdf.download": "Download sample",
    "pdf.docTitle": "Financial Analysis Report",

    "demo.title": "Sample report", "demo.close": "Close",
    "demo.fallback": "Your browser can't display the PDF here — download the sample report instead.",
    "demo.videoTitle": "Demo video", "demo.videoSub": "Digital CFO · Sample",

    "tm.eyebrow": "Reviews", "tm.title": "What our clients say",
    "tm.sample": "Sample reviews — to be filled with real client feedback soon",
    "tm.reviews": [
      { role: "Director, trading company", text: "We used to ask an accountant to understand the reports. Now we upload a file — KPIs and recommendations are ready. We saved a lot of time." },
      { role: "Finance manager, manufacturing", text: "Liquidity and risk metrics are shown clearly. Presenting to management became much easier." },
      { role: "Entrepreneur, services", text: "The PDF report looks professional. That very document helped in a conversation with investors." },
    ],

    "pr.eyebrow": "Pricing", "pr.title": "A plan that fits you",
    "pr.name": "One-time analysis", "pr.per": "for 1 analysis",
    "pr.note": "🎉 Promo price", "pr.badge": "Promo", "pr.sum": "UZS", "pr.cta": "Start now",
    "pr.features": ["Financial file analysis", "Full KPI calculation", "AI CFO report", "Risk diagnostics", "Professional PDF report"],

    "faq.eyebrow": "FAQ", "faq.title": "Frequently asked questions",
    "faq.items": [
      { q: "Which file formats are accepted?", a: "The system accepts financial files in .xlsx and .xls formats. The file is checked and validated automatically." },
      { q: "How long does the analysis take?", a: "We deliver the analysis in just 1 minute — as soon as you send the file, the report is ready." },
      { q: "Is the service paid?", a: "All analyses are currently completely free. We'll announce paid plans on the site and in the bot before introducing them." },
      { q: "How reliable is the analysis?", a: "Every report is reviewed by an experienced specialist, and results are checked against benchmark metrics." },
      { q: "Can I download the report?", a: "Yes, at the end of each analysis you can download a professional PDF report with one click." },
      { q: "Is my data safe?", a: "Your data is transmitted over a secure (HTTPS) connection, used only for analysis, and never shared with third parties." },
    ],

    "db.eyebrow": "Statistics", "db.title": "Dashboard",
    "db.live": "Live statistics · updated daily at 03:00",
    "db.sampleStatus": "Interface preview — live statistics soon",
    "db.users": "Users", "db.visits": "Requests", "db.reports": "Analyses", "db.todayActive": "Active today",
    "db.composition": "User composition", "db.phoneShared": "Shared phone", "db.premiumUsers": "Premium users",
    "db.brief": "Summary", "db.totalReports": "Total analyses",
    "db.lastUpdate": "Last update", "db.updatedDaily": "Statistics updated daily at 03:00",
    "db.agent": "AI Sales agent", "db.funnel": "Conversion funnel",
    "db.fStartPhone": "Start → Phone", "db.fPhoneReport": "Phone → Report", "db.fReportPremium": "Report → Premium",
    "db.aConversations": "Conversations", "db.aMessages": "AI messages", "db.aVideos": "Videos", "db.aReminders": "Reminders",

    "ft.about": "AI-powered financial analysis and reporting — a digital financial director for your business.",
    "ft.links": "Links", "ft.servicesTitle": "Services", "ft.contactTitle": "Contact",
    "ft.services": ["Financial analysis", "KPI Dashboard", "AI report", "Risk diagnostics", "Consulting"],
    "ft.rights": "© 2026 Digital CFO. All rights reserved.",
    "ft.privacy": "Privacy policy", "ft.terms": "Terms of use",
  },
};

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // URL tilni belgilaydi va localStorage'dan ustun turadi: /ru ga kirgan
    // (yoki Google'dan kelgan) foydalanuvchi ruscha sahifani ko'rishi kerak,
    // ilgari boshqa til tanlagan bo'lsa ham. Aks holda SSR bergan ruscha matn
    // React yuklangach o'zbekchaga almashib ketardi.
    try {
      if (typeof location !== "undefined" && location.pathname.startsWith("/ru")) return "ru";
      const s = localStorage.getItem("lang");
      return LANGS.some((l) => l.code === s) ? s : "uz";
    } catch {
      return "uz";
    }
  });
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  // t(key) -> string | array | object. Matn bo'lsa {var} almashtiriladi.
  const t = (key, vars) => {
    let v = DICT[lang]?.[key];
    if (v === undefined) v = DICT.uz[key];
    if (v === undefined) return key;
    if (typeof v === "string" && vars) {
      for (const k in vars) v = v.replace(`{${k}}`, vars[k]);
    }
    return v;
  };

  return (
    <AppCtx.Provider value={{ lang, setLang, t, contactOpen, setContactOpen }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
