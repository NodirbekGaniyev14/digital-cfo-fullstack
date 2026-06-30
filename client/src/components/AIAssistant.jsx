import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { useApp } from "@/lib/i18n";

/**
 * AIAssistant — "Maliya", Digital CFO AI yordamchisi.
 * Suzuvchi chat: namunaviy savollar, typing animatsiya, avto-javoblar.
 * Bilim bazasi (KB) 3 tilda (uz/ru/en) — sayt tiliga moslashadi va sayt FAQ
 * bilan sinxron (tahlil 1 daqiqada, faqat .xlsx/.xls). Offline, xarajatsiz.
 * To'liq ochiq AI uchun keyinchalik /api/chat (Claude) ga ulash mumkin.
 */

// --- TOP-25 savol (kalit so'zlar + javob), har til uchun ----------------------
const KB = {
  uz: [
    { k: ["salom", "assalom", "hello", "hi", "privet", "hayrli"], a: "Assalomu alaykum! Men Maliya — Digital CFO AI yordamchisiman 👋 Savolingizni yozing yoki yuqoridagi namunaviy savollardan tanlang." },
    { k: ["digital cfo nima", "xizmat", "platforma", "tanishtir", "bu nima"], a: "Digital CFO — korxonangiz moliyaviy hisobotlarini avtomatik tahlil qiladigan AI platforma. 1C'dan fayl yuborasiz, biz 20+ ko'rsatkich va amaliy tavsiyalar bilan CFO darajasidagi hisobotni qaytaramiz." },
    { k: ["qanday boshla", "boshla", "qadam", "start", "ishlay"], a: "3 oddiy qadam: 1) Telegram botimizni oching va telefon raqamingizni ulang. 2) 1C'dan Forma 1 (Balans) va Forma 2 (Moliyaviy natijalar) fayllarini yuboring. 3) 1 daqiqada hisobotni oling 📊" },
    { k: ["telefon", "raqam", "nomer", "phone"], a: "Telefon raqami hisobot tayyorligi haqida xabar berish va akkauntingizni identifikatsiya qilish uchun kerak. Boshqa maqsadda ishlatilmaydi." },
    { k: ["qanday fayl", "qaysi fayl", "format", "excel", "forma", "balans", "yubor"], a: "1C'dan eksport qilingan 2 ta fayl kerak: Forma 1 (Buxgalteriya balansi) va Forma 2 (Moliyaviy natijalar), .xlsx yoki .xls formatida. Namuna: /namuna." },
    { k: ["1c", "eksport", "chiqar", "yuklab", "8.2", "8.3"], a: "1C'dan chiqarish: hisobotni oching → 'Saqlash'/'Eksport' → Excel (.xlsx). Versiyangiz 8.2 yoki 8.3 bo'lsa ayting — aniq yo'riqnoma beraman." },
    { k: ["qancha vaqt", "necha daqiqa", "qachon tayyor", "tez"], a: "Tahlilni atigi 1 daqiqada yetkazamiz — faylni yuborishingiz bilan hisobot tayyor bo'ladi." },
    { k: ["korsatkich", "koeffitsient", "indikator", "nechta"], a: "Likvidlik, rentabellik, barqarorlik va faollik — jami 20+ koeffitsient hamda Altman Z-Score (bankrotlik xavfi). Har biriga ball va tavsiya beriladi." },
    { k: ["hisobotda nima", "hisobot ichida", "bo'lim", "nimalar bo'l"], a: "Hisobotda: boshqaruv xulosasi, KPI jadvali, likvidlik va to'lov qobiliyati, rentabellik, risk diagnostikasi (Altman Z) va AI tavsiyalari bo'ladi." },
    { k: ["premium", "tarif", "obuna", "abonement"], a: "Premium: cheksiz hisobotlar, shaxsiy moliyaviy maslahat (oyiga 2 marta), haftalik monitoring, soliq va risklarga oid to'liq tahlil." },
    { k: ["narx", "qancha turadi", "narxi", "qimmat", "price"], a: "Narxlar individual belgilanadi. To'liq ma'lumot uchun mutaxassisimiz bilan Telegram botda bog'lanishingiz mumkin: @Moliyaviy_Tahlilchi_bot." },
    { k: ["bepul", "tekin", "pulsiz", "free", "sinab"], a: "Ha, asosiy tahlilni bepul sinab ko'rishingiz mumkin. To'liq kengaytirilgan tahlil (20+ ko'rsatkich, doimiy monitoring) Premium tarifda." },
    { k: ["maxfiy", "xavfsiz", "malumot", "himoya", "sir"], a: "Ma'lumotlaringiz xavfsiz: fayllar faqat tahlil uchun ishlatiladi, uchinchi shaxslarga berilmaydi, hisobot faqat sizga yuboriladi." },
    { k: ["ai nima", "suniy", "intellekt", "robot", "ai qil"], a: "AI moliyaviy holatingizni baholaydi, kuchli va zaif tomonlarni ko'rsatadi va amaliy tavsiyalar beradi — yakuniy qaror sizniki." },
    { k: ["altman", "bankrot", "z-score", "z score", "xavf zona"], a: "Altman Z-Score — bankrotlik xavfini baholaydigan xalqaro model. Biz uni hisoblab, 'barqaror', 'ehtiyot' yoki 'xavf' zonasini ko'rsatamiz." },
    { k: ["til", "tilda", "rus tili", "ingliz", "qaysi til"], a: "Platforma va hisobotlar o'zbek, rus va ingliz tillarida. Telegram botda /language orqali tilni o'zgartirasiz." },
    { k: ["versiya", "qaysi 1c", "boshqa dastur", "didox", "qaysi dastur"], a: "1C 8.2 va 8.3 dan eksport qilingan .xlsx/.xls fayllar mos keladi. Boshqa dasturdan bo'lsa ham yuboring — ko'rib chiqamiz." },
    { k: ["namuna", "demo", "misol", "qanday korinadi"], a: "Saytdagi 'Namuna ko'rish' yoki 'Namunani yuklab olish' tugmasi orqali to'liq namunaviy hisobotni ko'rasiz. Sizniki ham xuddi shunday bo'ladi." },
    { k: ["kimga", "kim uchun", "moljallangan", "tadbirkor", "biznes"], a: "Kichik va o'rta biznes egalari, tadbirkorlar, moliyachi va buxgalterlar uchun — korxona holatini tez va tushunarli bilmoqchi bo'lganlar uchun." },
    { k: ["buxgalter kerak", "ozim qila", "bilim kerak", "tushunmasam"], a: "Maxsus bilim shart emas — siz faqat fayllarni yuborasiz, qolganini AI bajaradi va natijani oddiy tilda izohlaydi." },
    { k: ["aniqmi", "ishonch", "ishonsa", "togrimi", "xato qil"], a: "Tahlil haqiqiy raqamlaringizga va xalqaro modellarga (Altman Z, likvidlik) asoslanadi — ishonchli. Yakuniy qaror sizniki." },
    { k: ["boglan", "aloqa", "operator", "kontakt", "yordam kerak"], a: "Biz bilan Telegram bot orqali bog'lanishingiz mumkin: @Moliyaviy_Tahlilchi_bot. Murakkab savolда mutaxassis ham yordam beradi." },
    { k: ["tolov usul", "qanday tolay", "karta", "click", "payme", "naqd"], a: "To'lov usullari individual kelishiladi — mutaxassisimiz qulay variantni aytadi: @Moliyaviy_Tahlilchi_bot." },
    { k: ["bir nechta", "kop kompaniya", "har oy", "har chorak", "dinamika"], a: "Ha, turli davrlar (oy, chorak, yil) fayllarini yuborib dinamikani kuzatishingiz mumkin. Premiumда ko'p kompaniya va doimiy monitoring bor." },
    { k: ["xato", "qabul qilmadi", "ishlamadi", "notogri", "muammo bold"], a: "Xavotir olmang — format noto'g'ri bo'lsa, bot buni aytadi va to'g'ri namunani ko'rsatadi. Forma 1 va Forma 2 ni .xlsx ko'rinishida qayta yuboring." },
    { k: ["botga kir", "qanday kira", "telegram bot", "botingiz", "botga qanday"], a: "Telegram'da @Moliyaviy_Tahlilchi_bot ni qidiring yoki saytdagi 'Boshlash' tugmasini bosing → /start → tilni tanlang → telefon ulang." },
    { k: ["rahmat", "tashakkur", "thanks", "spasibo"], a: "Arzimaydi! 🙂 Yana savolingiz bo'lsa — bemalol yozing." },
  ],
  ru: [
    { k: ["привет", "здравств", "салам", "hello", "hi", "добр"], a: "Здравствуйте! Я Малия — AI-помощник Digital CFO 👋 Напишите вопрос или выберите один из примеров выше." },
    { k: ["digital cfo", "что это", "услуг", "платформ", "расскаж"], a: "Digital CFO — AI-платформа, которая автоматически анализирует финансовые отчёты. Вы отправляете файлы из 1С, мы возвращаем отчёт уровня CFO с 20+ показателями и рекомендациями." },
    { k: ["как нач", "начать", "шаг", "start", "с чего"], a: "3 простых шага: 1) Откройте наш Telegram-бот и подключите номер. 2) Отправьте Форму 1 (баланс) и Форму 2 (фин. результаты) из 1С. 3) Получите отчёт за 1 минуту 📊" },
    { k: ["телефон", "номер", "phone"], a: "Номер телефона нужен для уведомления о готовности отчёта и идентификации аккаунта. Для других целей не используется." },
    { k: ["какой файл", "формат", "excel", "форм", "баланс", "отправ"], a: "Нужны 2 файла из 1С: Форма 1 (бухгалтерский баланс) и Форма 2 (финансовые результаты), в формате .xlsx или .xls." },
    { k: ["1с", "1c", "выгруз", "экспорт", "8.2", "8.3"], a: "Выгрузка из 1С: откройте отчёт → 'Сохранить'/'Экспорт' → Excel (.xlsx). Скажите версию (8.2 или 8.3) — дам точную инструкцию." },
    { k: ["сколько врем", "сколько минут", "когда готов", "быстро"], a: "Анализ доставляем всего за 1 минуту — как только вы отправите файл, отчёт будет готов." },
    { k: ["показател", "коэффициент", "индикатор", "сколько"], a: "Ликвидность, рентабельность, устойчивость и активность — всего 20+ коэффициентов и Altman Z-Score (риск банкротства). По каждому — балл и рекомендация." },
    { k: ["что в отчёт", "что в отчет", "раздел", "что внутри"], a: "В отчёте: управленческое резюме, таблица KPI, ликвидность и платёжеспособность, рентабельность, диагностика рисков (Altman Z) и рекомендации AI." },
    { k: ["премиум", "premium", "тариф", "подписк"], a: "Premium: безлимитные отчёты, личная финансовая консультация (2 раза в месяц), еженедельный мониторинг, полный анализ налогов и рисков." },
    { k: ["цена", "сколько стоит", "стоимост", "дорого", "price"], a: "Цены определяются индивидуально. Полную информацию даст наш специалист в Telegram: @Moliyaviy_Tahlilchi_bot." },
    { k: ["бесплат", "free", "попроб"], a: "Да, базовый анализ можно попробовать бесплатно. Полный расширенный анализ (20+ показателей, мониторинг) — в тарифе Premium." },
    { k: ["конфиденц", "безопас", "данные", "защит", "секрет"], a: "Ваши данные в безопасности: файлы используются только для анализа, не передаются третьим лицам, отчёт отправляется только вам." },
    { k: ["что делает ai", "искусствен", "интеллект", "робот", "ии"], a: "AI оценивает ваше финансовое состояние, показывает сильные и слабые стороны и даёт рекомендации — окончательное решение за вами." },
    { k: ["altman", "банкрот", "z-score", "z score", "риск зон"], a: "Altman Z-Score — международная модель оценки риска банкротства. Мы рассчитываем её и показываем зону: 'устойчиво', 'осторожно' или 'риск'." },
    { k: ["язык", "на каком язык", "русск", "англ"], a: "Платформа и отчёты доступны на узбекском, русском и английском. В Telegram-боте язык меняется через /language." },
    { k: ["верси", "какая 1с", "другая программ", "didox"], a: "Подходят файлы .xlsx/.xls, выгруженные из 1С 8.2 и 8.3. Если из другой программы — всё равно пришлите, посмотрим." },
    { k: ["образец", "демо", "пример", "как выглядит"], a: "На сайте кнопка 'Смотреть образец' / 'Скачать образец' покажет полный пример отчёта. Ваш будет выглядеть так же." },
    { k: ["для кого", "кому подход", "предприним", "малый бизнес"], a: "Для владельцев малого и среднего бизнеса, предпринимателей, финансистов и бухгалтеров — кто хочет быстро понять состояние компании." },
    { k: ["нужен бухгалтер", "сам смогу", "нужны знания", "не пойму"], a: "Специальные знания не нужны — вы только отправляете файлы, остальное делает AI и объясняет результат простым языком." },
    { k: ["точн", "надёжн", "надежн", "доверя", "ошиб"], a: "Анализ основан на ваших реальных цифрах и международных моделях (Altman Z, ликвидность) — он надёжен. Окончательное решение за вами." },
    { k: ["связ", "контакт", "оператор", "помощь нужна"], a: "Связаться можно через Telegram-бот: @Moliyaviy_Tahlilchi_bot. По сложным вопросам поможет наш специалист." },
    { k: ["способ оплат", "как оплат", "карта", "click", "payme", "наличн"], a: "Способы оплаты согласовываются индивидуально — специалист подскажет удобный вариант: @Moliyaviy_Tahlilchi_bot." },
    { k: ["несколько", "много компан", "каждый месяц", "квартал", "динамик"], a: "Да, можно отправлять файлы за разные периоды (месяц, квартал, год) и отслеживать динамику. В Premium — несколько компаний и мониторинг." },
    { k: ["ошибк", "не принял", "не работ", "неправильн", "проблем"], a: "Не волнуйтесь — если формат неверный, бот сообщит и покажет правильный образец. Пришлите Форму 1 и Форму 2 в .xlsx." },
    { k: ["как зайти в бот", "как войти", "телеграм бот", "ваш бот", "где бот"], a: "Найдите в Telegram @Moliyaviy_Tahlilchi_bot или нажмите 'Начать' на сайте → /start → выберите язык → подключите номер." },
    { k: ["спасибо", "благодар", "thanks"], a: "Пожалуйста! 🙂 Если будут вопросы — пишите." },
  ],
  en: [
    { k: ["hello", "hi", "hey", "good "], a: "Hello! I'm Maliya — the Digital CFO AI assistant 👋 Type your question or pick one of the samples above." },
    { k: ["what is digital cfo", "service", "platform", "tell me", "what is this"], a: "Digital CFO is an AI platform that automatically analyzes your financial reports. You send files from 1C, and we return a CFO-level report with 20+ metrics and recommendations." },
    { k: ["how to start", "get started", "step", "begin"], a: "3 simple steps: 1) Open our Telegram bot and connect your phone. 2) Send Form 1 (balance sheet) and Form 2 (financial results) from 1C. 3) Get the report in 1 minute 📊" },
    { k: ["phone", "number"], a: "Your phone number is used to notify you when the report is ready and to identify your account. It's not used for anything else." },
    { k: ["which file", "what file", "format", "excel", "form", "balance", "send"], a: "Two files from 1C are needed: Form 1 (balance sheet) and Form 2 (financial results), in .xlsx or .xls format." },
    { k: ["1c", "export", "download from", "8.2", "8.3"], a: "Export from 1C: open the report → 'Save'/'Export' → Excel (.xlsx). Tell me your version (8.2 or 8.3) and I'll give exact steps." },
    { k: ["how long", "how many minutes", "when ready", "fast"], a: "We deliver the analysis in just 1 minute — as soon as you send the file, the report is ready." },
    { k: ["metric", "ratio", "indicator", "how many"], a: "Liquidity, profitability, stability and activity — 20+ ratios plus the Altman Z-Score (bankruptcy risk). Each gets a score and a recommendation." },
    { k: ["what's in the report", "whats in", "section", "what inside"], a: "The report includes: executive summary, KPI table, liquidity and solvency, profitability, risk diagnostics (Altman Z) and AI recommendations." },
    { k: ["premium", "plan", "subscription"], a: "Premium: unlimited reports, personal financial consultation (twice a month), weekly monitoring, and full tax & risk analysis." },
    { k: ["price", "cost", "how much", "expensive"], a: "Pricing is set individually. Our specialist will share full details on Telegram: @Moliyaviy_Tahlilchi_bot." },
    { k: ["free", "try"], a: "Yes, you can try the basic analysis for free. The full extended analysis (20+ metrics, monitoring) is in the Premium plan." },
    { k: ["confidential", "secure", "data", "safe", "privacy"], a: "Your data is safe: files are used only for analysis, never shared with third parties, and the report goes only to you." },
    { k: ["what does ai do", "artificial", "intelligence", "robot"], a: "AI assesses your financial health, highlights strengths and weaknesses, and gives recommendations — the final decision is always yours." },
    { k: ["altman", "bankrupt", "z-score", "z score", "risk zone"], a: "The Altman Z-Score is an international bankruptcy-risk model. We compute it and show your zone: 'stable', 'caution' or 'risk'." },
    { k: ["language", "what language", "russian", "english"], a: "The platform and reports are available in Uzbek, Russian and English. In the Telegram bot you can switch via /language." },
    { k: ["version", "which 1c", "other software", "didox"], a: ".xlsx/.xls files exported from 1C 8.2 and 8.3 work. If it's from other software, send it anyway — we'll take a look." },
    { k: ["sample", "demo", "example", "how it looks"], a: "On the site, the 'View sample' / 'Download sample' button shows a full example report. Yours will look the same." },
    { k: ["who is it for", "for whom", "entrepreneur", "small business"], a: "For small and medium business owners, entrepreneurs, finance staff and accountants — anyone who wants to quickly understand their company's health." },
    { k: ["need an accountant", "do it myself", "need knowledge", "don't understand"], a: "No special knowledge needed — you just send the files, AI does the rest and explains the result in plain language." },
    { k: ["accurate", "reliable", "trust", "mistake"], a: "The analysis is based on your real numbers and international models (Altman Z, liquidity) — it's reliable. The final decision is yours." },
    { k: ["contact", "reach you", "operator", "need help"], a: "You can reach us via the Telegram bot: @Moliyaviy_Tahlilchi_bot. For complex questions, our specialist will help." },
    { k: ["payment method", "how to pay", "card", "click", "payme", "cash"], a: "Payment methods are agreed individually — our specialist will suggest a convenient option: @Moliyaviy_Tahlilchi_bot." },
    { k: ["multiple", "many companies", "every month", "quarter", "dynamic"], a: "Yes, you can send files for different periods (month, quarter, year) and track dynamics. Premium adds multiple companies and monitoring." },
    { k: ["error", "not accepted", "didn't work", "wrong", "problem"], a: "Don't worry — if the format is wrong, the bot will tell you and show the correct sample. Re-send Form 1 and Form 2 in .xlsx." },
    { k: ["how to open the bot", "how to enter", "telegram bot", "your bot", "where is the bot"], a: "Find @Moliyaviy_Tahlilchi_bot in Telegram or click 'Start' on the site → /start → choose a language → connect your phone." },
    { k: ["thank", "thanks", "thx"], a: "You're welcome! 🙂 If you have more questions, just write." },
  ],
};

const FALLBACK = {
  uz: "Bu savolga aniq javob berish uchun sizni mutaxassisimizga yoki Telegram botimizga (@Moliyaviy_Tahlilchi_bot) ulayman. Quyidagi namunaviy savollardan ham tanlashingiz mumkin 👇",
  ru: "Чтобы дать точный ответ, я подключу вас к специалисту или к нашему Telegram-боту (@Moliyaviy_Tahlilchi_bot). Можно также выбрать один из примеров ниже 👇",
  en: "To give you a precise answer, I'll connect you to our specialist or our Telegram bot (@Moliyaviy_Tahlilchi_bot). You can also pick one of the samples below 👇",
};

const GREETING = {
  uz: "Assalomu alaykum! Men Maliya — Digital CFO AI yordamchisiman 👋 Savolingizni yozing yoki yuqoridagi namunaviy savollardan birini tanlang.",
  ru: "Здравствуйте! Я Малия — AI-помощник Digital CFO 👋 Напишите вопрос или выберите один из примеров выше.",
  en: "Hello! I'm Maliya — the Digital CFO AI assistant 👋 Type your question or pick one of the samples above.",
};

const QUICK = {
  uz: ["Digital CFO nima?", "Qanday boshlayman?", "Qanday fayl yuborishim kerak?", "Hisobot qancha vaqtda tayyor bo'ladi?", "Hisobotda nimalar bo'ladi?", "Premium nima beradi?", "Narxi qancha?", "Bepulmi?"],
  ru: ["Что такое Digital CFO?", "Как начать?", "Какой файл отправлять?", "Сколько времени занимает анализ?", "Что в отчёте?", "Что даёт Premium?", "Сколько стоит?", "Это бесплатно?"],
  en: ["What is Digital CFO?", "How do I start?", "Which file should I send?", "How long does the analysis take?", "What's in the report?", "What does Premium give?", "How much does it cost?", "Is it free?"],
};

const UI = {
  uz: { subtitle: "Digital CFO AI yordamchisi · onlayn", placeholder: "Savolingizni yozing…", close: "Yopish", send: "Yuborish", open: "AI yordamchi" },
  ru: { subtitle: "AI-помощник Digital CFO · онлайн", placeholder: "Напишите вопрос…", close: "Закрыть", send: "Отправить", open: "AI-помощник" },
  en: { subtitle: "Digital CFO AI assistant · online", placeholder: "Type your question…", close: "Close", send: "Send", open: "AI assistant" },
};

// Matnni normallashtirib, mos javobni topadi (prefiks + qisqa kalit aniq so'z).
const normalize = (s) =>
  s.toLowerCase().replace(/['’`ʻ]/g, "'").replace(/[^\p{L}\p{N}\s']/gu, " ").trim();

function matchKw(words, t, kw) {
  if (kw.includes(" ")) return t.includes(kw);
  if (kw.length <= 2) return words.includes(kw);
  return words.some((w) => w.startsWith(kw));
}

function answerFor(text, kb, fallback) {
  const t = normalize(text);
  const words = t.split(/\s+/).filter(Boolean);
  let best = null;
  let bestScore = 0;
  for (const item of kb) {
    let score = 0;
    for (const kw of item.k) if (matchKw(words, t, normalize(kw))) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best ? best.a : fallback;
}

export default function AIAssistant() {
  const { lang } = useApp();
  const L = UI[lang] || UI.uz;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [{ role: "bot", text: GREETING[lang] || GREETING.uz }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  // Til o'zgarsa — suhbat boshlanmagan bo'lsa, salomni yangi tilga moslaymiz.
  useEffect(() => {
    setMessages((m) => (m.length <= 1 ? [{ role: "bot", text: GREETING[lang] || GREETING.uz }] : m));
  }, [lang]);

  function send(raw) {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setTyping(true);
    const delay = Math.min(1500, 500 + text.length * 18);
    setTimeout(() => {
      setTyping(false);
      const ans = answerFor(text, KB[lang] || KB.uz, FALLBACK[lang] || FALLBACK.uz);
      setMessages((m) => [...m, { role: "bot", text: ans }]);
    }, delay);
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label={L.open}
            className="group fixed bottom-5 right-5 z-[260] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-azure to-emerald-500 text-white shadow-[0_14px_34px_rgba(59,130,246,.5)] transition-transform hover:scale-105"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full pulse-glow" />
            <Bot className="h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed bottom-0 right-0 z-[300] flex h-[100dvh] w-full flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-navy sm:bottom-5 sm:right-5 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-2xl"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-navy to-azure px-4 py-3.5 text-white">
              <div className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-heading text-[15px] font-bold leading-tight">
                  Maliya <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="text-[11.5px] text-white/70">{L.subtitle}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={L.close}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-none gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-white/5 dark:bg-white/[.03] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(QUICK[lang] || QUICK.uz).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="whitespace-nowrap rounded-full border border-azure/30 bg-azure/5 px-3 py-1.5 text-[12px] font-medium text-azure transition-colors hover:bg-azure/10 dark:border-azure/40 dark:text-blue-300"
                >
                  {q}
                </button>
              ))}
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 px-4 py-4 dark:bg-transparent"
            >
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.text} />
              ))}
              {typing && <TypingBubble />}
            </div>

            <div className="flex flex-none items-end gap-2 border-t border-slate-200 bg-white px-3 py-3 dark:border-white/10 dark:bg-navy">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={L.placeholder}
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-azure focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                aria-label={L.send}
                className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl bg-azure text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-[18px] w-[18px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, text }) {
  const isBot = role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${isBot ? "" : "flex-row-reverse"}`}
    >
      {isBot && (
        <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-azure to-emerald-500 text-white">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
          isBot
            ? "rounded-bl-sm bg-white text-navy shadow-sm dark:bg-white/[.06] dark:text-slate-100"
            : "rounded-br-sm bg-azure text-white"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-azure to-emerald-500 text-white">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm dark:bg-white/[.06]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-300"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
