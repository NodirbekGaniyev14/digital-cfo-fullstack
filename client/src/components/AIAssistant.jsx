import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Sparkles } from "lucide-react";

/**
 * AIAssistant — "Maliya", Digital CFO AI yordamchisi.
 * Suzuvchi chat oynasi: namunaviy savollar, typing animatsiya, avto-javoblar.
 * Bilim bazasi (KB) — eng ko'p so'raladigan 25 ta savol. Offline ishlaydi,
 * xarajatsiz. Keyinchalik /api/chat orqali haqiqiy Claude AI ga ulash mumkin.
 */

// --- Bilim bazasi: TOP-25 savol (kalit so'zlar -> javob) ----------------------
const KB = [
  // 0 — Salom (suhbat)
  {
    k: ["salom", "assalom", "hello", "hi", "privet", "hayrli", "kun yaxshi"],
    a: "Assalomu alaykum! Men Maliya — Digital CFO AI yordamchisiman 👋 "
      + "Korxonangiz moliyasini tahlil qilishda yordam beraman. Savolingizni "
      + "yozing yoki yuqoridagi namunaviy savollardan tanlang.",
  },
  // 1 — Digital CFO nima?
  {
    k: ["digital cfo nima", "xizmat", "platforma", "tanishtir", "nima taklif",
        "bu nima", "loyiha nima"],
    a: "Digital CFO — korxonangiz moliyaviy hisobotlarini avtomatik tahlil "
      + "qiladigan AI platforma. 1C'dan fayllaringizni yuborasiz, biz 20+ "
      + "ko'rsatkich bo'yicha to'liq tahlil va amaliy tavsiyalar bilan CFO "
      + "darajasidagi hisobotni bir necha daqiqada qaytaramiz.",
  },
  // 2 — Qanday boshlayman?
  {
    k: ["qanday boshla", "boshla", "qadam", "start", "ishlay", "qanday foydalan",
        "nimadan boshla"],
    a: "3 ta oddiy qadam: 1) Telegram botimizni oching va telefon raqamingizni "
      + "ulang. 2) 1C'dan Forma 1 (Balans) va Forma 2 (Moliyaviy natijalar) "
      + "Excel fayllarini yuboring. 3) Bir necha daqiqada to'liq hisobotni oling 📊",
  },
  // 3 — Telefon nega kerak?
  {
    k: ["telefon", "raqam", "nomer", "phone"],
    a: "Telefon raqami hisobot tayyorligi haqida xabar berish va akkauntingizni "
      + "identifikatsiya qilish uchun kerak. Boshqa maqsadda ishlatilmaydi va "
      + "uchinchi shaxslarga berilmaydi.",
  },
  // 4 — Qanday fayl?
  {
    k: ["qanday fayl", "qaysi fayl", "format", "excel", "forma", "balans", "yubor"],
    a: "1C'dan eksport qilingan 2 ta standart fayl kerak: Forma 1 (Buxgalteriya "
      + "balansi) va Forma 2 (Moliyaviy natijalar), .xlsx formatida. Namuna botda "
      + "/namuna buyrug'i orqali ham mavjud.",
  },
  // 5 — 1C dan qanday chiqaraman?
  {
    k: ["1c", "eksport", "chiqar", "yuklab", "export", "8.2", "8.3", "1c dan"],
    a: "1C'dan chiqarish: kerakli hisobotni oching → 'Saqlash' yoki 'Eksport' → "
      + "Excel (.xlsx) formatini tanlang → saqlang. 1C 8.2 va 8.3 uchun qadamlar "
      + "biroz farq qiladi — versiyangizni ayting, aniq yo'riqnoma beraman.",
  },
  // 6 — Hisobot qancha vaqtda?
  {
    k: ["qancha vaqt", "necha daqiqa", "necha soniya", "qachon tayyor", "tayyor bo'l",
        "tez tayyor"],
    a: "Fayl to'g'ri bo'lsa, hisobot odatda 3–5 daqiqada tayyor bo'ladi. Fayl "
      + "katta bo'lsa 7–10 daqiqa ketishi mumkin.",
  },
  // 7 — Qanday ko'rsatkichlar?
  {
    k: ["ko'rsatkich", "korsatkich", "koeffitsient", "indikator", "50", "nechta korsat"],
    a: "Likvidlik, rentabellik, moliyaviy barqarorlik va faollik — jami 20+ asosiy "
      + "koeffitsient hamda Altman Z-Score (bankrotlik xavfi) hisoblanadi. Har "
      + "biriga umumiy ball va amaliy tavsiya beriladi.",
  },
  // 8 — Hisobotda nimalar bo'ladi?
  {
    k: ["hisobotda nima", "hisobot ichida", "bo'lim", "hisobot tarkibi", "nimalar bo'l",
        "qanday hisobot"],
    a: "Hisobotda: boshqaruv xulosasi (Executive Summary), asosiy KPI jadvali, "
      + "likvidlik va to'lov qobiliyati, rentabellik va foyda dinamikasi, risk "
      + "diagnostikasi (Altman Z) hamda AI tavsiyalari va xulosalar bo'ladi.",
  },
  // 9 — Premium nima beradi?
  {
    k: ["premium", "tarif", "obuna", "abonement", "imkoniyat"],
    a: "Premium tarif: cheksiz hisobotlar (oylik abonement), shaxsiy moliyaviy "
      + "maslahat (oyiga 2 marta), haftalik monitoring va ogohlantirish, soliqlar "
      + "va risklarga oid to'liq tahlil.",
  },
  // 10 — Narxi qancha?
  {
    k: ["narx", "qancha turadi", "narxi", "pul", "price", "qimmat"],
    a: "Narxlar so'rovga qarab individual belgilanadi. To'liq ma'lumot uchun "
      + "mutaxassisimiz bilan Telegram botimizda bog'lashingiz mumkin: "
      + "@Moliyaviy_Tahlilchi_bot.",
  },
  // 11 — Bepulmi?
  {
    k: ["bepul", "tekin", "pulsiz", "free", "sinab ko'r", "pul to'lamasdan"],
    a: "Ha, asosiy tahlilni bepul sinab ko'rishingiz mumkin — botga fayl yuboring "
      + "va asosiy ko'rsatkichlar bilan hisobot oling. To'liq kengaytirilgan tahlil "
      + "(20+ ko'rsatkich, doimiy monitoring) Premium tarifda.",
  },
  // 12 — Maxfiylik
  {
    k: ["maxfiy", "xavfsiz", "ma'lumot", "himoya", "security", "sir", "maxfiylik"],
    a: "Ma'lumotlaringiz xavfsiz. Fayllaringiz faqat tahlil uchun ishlatiladi, "
      + "uchinchi shaxslarga berilmaydi, hisobot esa faqat sizga yuboriladi.",
  },
  // 13 — AI nima qiladi?
  {
    k: ["ai nima", "sun'iy", "intellekt", "robot", "ai qanday", "ai qiladi"],
    a: "AI moliyaviy holatingizni baholaydi, kuchli va zaif tomonlarni ko'rsatadi "
      + "va amaliy tavsiyalar beradi — lekin yakuniy qaror har doim sizniki.",
  },
  // 14 — Altman Z / bankrotlik xavfi
  {
    k: ["altman", "bankrot", "z-score", "z score", "to'lovga qobiliyat", "xavf zona",
        "risk score"],
    a: "Altman Z-Score — korxonaning bankrotlik (to'lovga qobiliyatsizlik) xavfini "
      + "baholaydigan xalqaro model. Biz uni avtomatik hisoblab, 'barqaror', "
      + "'ehtiyot' yoki 'xavf' zonasini ko'rsatamiz va sabablarini tushuntiramiz.",
  },
  // 15 — Tillar
  {
    k: ["til", "tilda", "rus tili", "ingliz", "qaysi til", "language"],
    a: "Platforma va hisobotlar o'zbek, rus va ingliz tillarida mavjud. Telegram "
      + "botda /language buyrug'i orqali tilni o'zgartirishingiz mumkin.",
  },
  // 16 — Mosligi (1C versiyalari / boshqa dasturlar)
  {
    k: ["versiya", "qaysi 1c", "boshqa dastur", "didox", "saturn", "qaysi dastur",
        "mosmi"],
    a: "1C 8.2 va 8.3 dan eksport qilingan standart .xlsx fayllar qo'llab-"
      + "quvvatlanadi (Forma 1 va Forma 2). Boshqa buxgalteriya dasturidan bo'lsa "
      + "ham yuboring — ko'pchilik formatlar mos keladi, ko'rib chiqamiz.",
  },
  // 17 — Namuna / demo
  {
    k: ["namuna", "demo", "misol", "qanday ko'rinadi", "namunaviy", "ko'rsat"],
    a: "Albatta — saytimizda 'Namuna ko'rish' yoki 'Namunani yuklab olish' tugmasi "
      + "orqali to'liq namunaviy hisobotni ko'rishingiz mumkin. Sizning hisobotingiz "
      + "ham xuddi shunday ko'rinishda bo'ladi.",
  },
  // 18 — Kimga mo'ljallangan?
  {
    k: ["kimga", "kim uchun", "mo'ljallangan", "tadbirkor", "kichik biznes",
        "men uchun"],
    a: "Kichik va o'rta biznes egalari, tadbirkorlar, moliyachi va buxgalterlar "
      + "uchun. Korxonangiz moliyaviy holatini tez va tushunarli bilmoqchi bo'lsangiz "
      + "— bu siz uchun.",
  },
  // 19 — Buxgalter / bilim kerakmi?
  {
    k: ["buxgalter kerak", "o'zim qila", "bilim kerak", "tushunmasam", "moliyani bilm",
        "murakkab"],
    a: "Yo'q, maxsus moliyaviy bilim shart emas. Siz faqat 1C fayllarini yuborasiz "
      + "— qolganini AI bajaradi va natijani oddiy, tushunarli tilda izohlaydi. "
      + "Buxgalteringiz fayllarni chiqarishda yordam berishi mumkin.",
  },
  // 20 — Aniqmi / ishonsa bo'ladimi?
  {
    k: ["aniqmi", "ishonch", "ishonsa", "to'g'rimi", "xato qil", "qanchalik aniq",
        "haqiqiymi"],
    a: "Tahlil sizning haqiqiy hisobot raqamlaringizga va xalqaro moliyaviy "
      + "modellarga (Altman Z, likvidlik, rentabellik) asoslanadi — natija "
      + "ishonchli. Ammo yakuniy qaror sizniki; AI maslahat beradi, o'rningizga "
      + "qaror qilmaydi.",
  },
  // 21 — Bog'lanish / yordam
  {
    k: ["bog'lan", "boglan", "aloqa", "operator", "murojaat", "kontakt", "yordam kerak"],
    a: "Biz bilan Telegram bot orqali bog'lanishingiz mumkin: "
      + "@Moliyaviy_Tahlilchi_bot. Murakkab savollar bo'yicha mutaxassisimiz ham "
      + "yordam beradi.",
  },
  // 22 — To'lov usullari
  {
    k: ["to'lov usul", "qanday to'lay", "karta", "click", "payme", "naqd", "to'lash"],
    a: "To'lov shartlari va usullari individual kelishiladi — mutaxassisimiz qulay "
      + "variantni aytadi. Bog'lanish: @Moliyaviy_Tahlilchi_bot.",
  },
  // 23 — Bir nechta kompaniya / davr
  {
    k: ["bir nechta", "ko'p kompaniya", "har oy", "har chorak", "dinamika", "muntazam",
        "bir necha davr"],
    a: "Ha. Turli davrlar (oy, chorak, yil) fayllarini yuborib, korxona "
      + "dinamikasini kuzatishingiz mumkin. Premium tarifda bir nechta kompaniya "
      + "va doimiy monitoring imkoniyati bor.",
  },
  // 24 — Fayl xato bo'lsa
  {
    k: ["xato", "qabul qilmadi", "ishlamadi", "noto'g'ri", "muammo bo'ld", "fayl xato"],
    a: "Xavotir olmang — fayl formati noto'g'ri bo'lsa, bot buni aytadi va to'g'ri "
      + "namunani ko'rsatadi. 1C'dan Forma 1 va Forma 2 ni .xlsx ko'rinishida qayta "
      + "yuboring yoki men yordam beraman.",
  },
  // 25 — Telegram botga qanday kiraman?
  {
    k: ["botga kir", "qanday kira", "telegram bot", "botingiz", "bot manzili",
        "botga qanday", "botdan foydalan"],
    a: "Telegram'da @Moliyaviy_Tahlilchi_bot ni qidiring yoki saytdagi 'Boshlash' "
      + "tugmasini bosing. Botni oching → /start → tilni tanlang → telefon "
      + "raqamingizni ulang.",
  },
  // — Rahmat (suhbat)
  {
    k: ["rahmat", "tashakkur", "thanks", "spasibo"],
    a: "Arzimaydi! 🙂 Yana savollaringiz bo'lsa — bemalol yozing. Sizga yordam "
      + "berishdan mamnunman.",
  },
];

const FALLBACK =
  "Bu savolga aniq javob berish uchun sizni mutaxassisimizga yoki Telegram "
  + "botimizga (@Moliyaviy_Tahlilchi_bot) ulayman. Quyidagi namunaviy savollardan "
  + "ham tanlashingiz mumkin 👇";

const QUICK = [
  "Digital CFO nima?",
  "Qanday boshlayman?",
  "Qanday fayl yuborishim kerak?",
  "Hisobot qancha vaqtda tayyor bo'ladi?",
  "Hisobotda nimalar bo'ladi?",
  "Premium nima beradi?",
  "Narxi qancha?",
  "Bepulmi?",
];

const GREETING =
  "Assalomu alaykum! Men Maliya — Digital CFO AI yordamchisiman 👋 "
  + "Savolingizni yozing yoki yuqoridagi namunaviy savollardan birini tanlang.";

// Matnni normallashtirib, bilim bazasidan eng mos javobni topadi.
const normalize = (s) =>
  s.toLowerCase().replace(/['’`ʻ]/g, "'").replace(/[^\p{L}\p{N}\s']/gu, " ").trim();

// Kalit so'z mosligi:
//  • ko'p so'zli kalit ("qancha turadi") -> butun ibora substring sifatida
//  • bitta so'zli kalit -> so'z BOSHI bilan (prefiks) — o'zbekcha qo'shimchalar
//    uchun ("narxi"~"narx", "telefoningiz"~"telefon"), ammo "bepulmi"≠"pul".
function matchKw(words, t, kw) {
  if (kw.includes(" ")) return t.includes(kw);        // ko'p so'zli -> ibora
  if (kw.length <= 2) return words.includes(kw);       // juda qisqa (hi, 1c) -> aniq so'z
  return words.some((w) => w.startsWith(kw));          // prefiks (qo'shimchaga bardosh)
}

function answerFor(text) {
  const t = normalize(text);
  const words = t.split(/\s+/).filter(Boolean);
  let best = null;
  let bestScore = 0;
  for (const item of KB) {
    let score = 0;
    for (const kw of item.k) if (matchKw(words, t, normalize(kw))) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best ? best.a : FALLBACK;
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: GREETING }]);
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

  function send(raw) {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setTyping(true);
    // Typing animatsiya — uzunlikka qarab tabiiy kechikish
    const delay = Math.min(1500, 500 + text.length * 18);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text: answerFor(text) }]);
    }, delay);
  }

  return (
    <>
      {/* Suzuvchi tugma (oyna yopiq bo'lsa) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label="AI yordamchi"
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

      {/* Chat oynasi */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed bottom-0 right-0 z-[300] flex h-[100dvh] w-full flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-navy sm:bottom-5 sm:right-5 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-2xl"
          >
            {/* Sarlavha */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-navy to-azure px-4 py-3.5 text-white">
              <div className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-heading text-[15px] font-bold leading-tight">
                  Maliya <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="text-[11.5px] text-white/70">
                  Digital CFO AI yordamchisi · onlayn
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Yopish"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Namunaviy savollar (tepada) */}
            <div className="flex flex-none gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-white/5 dark:bg-white/[.03] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="whitespace-nowrap rounded-full border border-azure/30 bg-azure/5 px-3 py-1.5 text-[12px] font-medium text-azure transition-colors hover:bg-azure/10 dark:border-azure/40 dark:text-blue-300"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Xabarlar */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 px-4 py-4 dark:bg-transparent"
            >
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.text} />
              ))}
              {typing && <TypingBubble />}
            </div>

            {/* Kiritish */}
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
                placeholder="Savolingizni yozing…"
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[14px] text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-azure focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                aria-label="Yuborish"
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
