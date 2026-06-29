import { createContext, useContext, useEffect, useState } from "react";

/**
 * Sayt holati: til (uz/ru/en) + kontakt modal ochiq/yopiq.
 * t(key) — joriy til bo'yicha matn; topilmasa uz, keyin key.
 */

export const LANGS = [
  { code: "uz", label: "O'zbekcha", short: "Uz" },
  { code: "ru", label: "Русский", short: "Ru" },
  { code: "en", label: "English", short: "En" },
];

const DICT = {
  uz: {
    "nav.home": "Bosh sahifa",
    "nav.how": "Qanday ishlaydi",
    "nav.free": "Bepul tahlil",
    "nav.services": "Xizmatlar",
    "nav.kpi": "KPI Tahlil",
    "nav.pricing": "Narxlar",
    "nav.faq": "FAQ",
    "nav.demo": "Demo",
    "nav.contact": "Biz bilan bog'lanish",

    "modal.title": "Mutaxassis bilan bog'lanish",
    "modal.heroTitle": "CFO.UZ — bu shunchaki avtomatlashtirish emas. Bu hisobdan boshqaruvga o'tishdir.",
    "modal.heroText": "CFO.UZ bilan boshqaruvini allaqachon avtomatlashtirgan yuzlab kompaniyalarga qo'shiling. Bugun hisobdan boshqaruvga o'tish yo'lingizni boshlang.",
    "modal.feat1": "Biznesning to'liq manzarasi real vaqtda",
    "modal.feat2": "Foyda va xarajatlarni 24/7 nazorat qilish",
    "modal.feat3": "Barcha darajalarda shaffoflik",

    "modal.name": "Ismingiz",
    "modal.namePh": "To'liq ismingiz",
    "modal.contactLabel": "Siz bilan qanday bog'lanish mumkin? Kamida bittasini to'ldiring",
    "modal.email": "Elektron pochta",
    "modal.phone": "Telefon raqami",
    "modal.telegram": "Telegram nikingiz",
    "modal.message": "Xabar",
    "modal.messagePh": "Sizga qanday yordam bera olamiz?",
    "modal.submit": "Ariza yuborish",
    "modal.sending": "Yuborilmoqda…",
    "modal.successTitle": "Arizangiz qabul qilindi!",
    "modal.successText": "Raqamingiz: {ref}. Mutaxassisimiz tez orada siz bilan bog'lanadi.",
    "modal.errName": "Iltimos, ismingizni kiriting",
    "modal.errContact": "Kamida bitta bog'lanish usulini to'ldiring",
    "modal.errGeneric": "Yuborib bo'lmadi. Birozdan so'ng qayta urinib ko'ring.",
    "modal.another": "Yana ariza yuborish",
  },
  ru: {
    "nav.home": "Главная",
    "nav.how": "Как работает",
    "nav.free": "Бесплатный анализ",
    "nav.services": "Услуги",
    "nav.kpi": "KPI анализ",
    "nav.pricing": "Цены",
    "nav.faq": "FAQ",
    "nav.demo": "Демо",
    "nav.contact": "Связаться с нами",

    "modal.title": "Связаться со специалистом",
    "modal.heroTitle": "CFO.UZ — это не просто автоматизация. Это переход от учёта к управлению.",
    "modal.heroText": "Присоединяйтесь к сотням компаний, которые уже автоматизировали управление с CFO.UZ. Начните свой путь от учёта к управлению уже сегодня.",
    "modal.feat1": "Полная картина бизнеса в реальном времени",
    "modal.feat2": "Контроль прибыли и расходов 24/7",
    "modal.feat3": "Прозрачность на всех уровнях",

    "modal.name": "Ваше имя",
    "modal.namePh": "Полное имя",
    "modal.contactLabel": "Как с вами связаться? Заполните хотя бы одно",
    "modal.email": "Электронная почта",
    "modal.phone": "Номер телефона",
    "modal.telegram": "Ник в Telegram",
    "modal.message": "Сообщение",
    "modal.messagePh": "Чем мы можем помочь?",
    "modal.submit": "Отправить заявку",
    "modal.sending": "Отправка…",
    "modal.successTitle": "Заявка принята!",
    "modal.successText": "Ваш номер: {ref}. Наш специалист скоро свяжется с вами.",
    "modal.errName": "Пожалуйста, укажите имя",
    "modal.errContact": "Заполните хотя бы один способ связи",
    "modal.errGeneric": "Не удалось отправить. Попробуйте позже.",
    "modal.another": "Отправить ещё заявку",
  },
  en: {
    "nav.home": "Home",
    "nav.how": "How it works",
    "nav.free": "Free analysis",
    "nav.services": "Services",
    "nav.kpi": "KPI Analysis",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.demo": "Demo",
    "nav.contact": "Contact us",

    "modal.title": "Contact a specialist",
    "modal.heroTitle": "CFO.UZ is not just automation. It's the shift from bookkeeping to management.",
    "modal.heroText": "Join hundreds of companies that have already automated their management with CFO.UZ. Start your journey from bookkeeping to management today.",
    "modal.feat1": "A full real-time picture of your business",
    "modal.feat2": "24/7 control of profit and expenses",
    "modal.feat3": "Transparency at every level",

    "modal.name": "Your name",
    "modal.namePh": "Full name",
    "modal.contactLabel": "How can we reach you? Fill in at least one",
    "modal.email": "Email",
    "modal.phone": "Phone number",
    "modal.telegram": "Telegram username",
    "modal.message": "Message",
    "modal.messagePh": "How can we help you?",
    "modal.submit": "Send request",
    "modal.sending": "Sending…",
    "modal.successTitle": "Request received!",
    "modal.successText": "Your reference: {ref}. Our specialist will contact you shortly.",
    "modal.errName": "Please enter your name",
    "modal.errContact": "Fill in at least one contact method",
    "modal.errGeneric": "Could not send. Please try again later.",
    "modal.another": "Send another request",
  },
};

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
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

  const t = (key, vars) => {
    let s = (DICT[lang] && DICT[lang][key]) || DICT.uz[key] || key;
    if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
    return s;
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
