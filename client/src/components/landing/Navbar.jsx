import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Menu, X, Globe, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useApp, LANGS } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// `href` — bosh sahifadagi bo'lim (anchor). `to` — alohida route (React Router).
const NAV_LINKS = [
  { key: "nav.home", href: "#hero" },
  { key: "nav.how", href: "#how-it-works" },
  { key: "nav.free", href: "#tahlil" },
  { key: "nav.services", href: "#services" },
  { key: "nav.kpi", href: "#kpi" },
  { key: "nav.pricing", href: "#pricing" },
  { key: "nav.articles", to: "/maqolalar" },
  { key: "nav.faq", href: "#faq" },
];

// Bo'lim havolasi bosh sahifadan tashqarida ham ishlashi uchun:
// bosh sahifada — oddiy anchor; boshqa sahifada — "/#bo'lim" ga o'tadi.
function NavItem({ link, isHome, className, onClick }) {
  if (link.to) {
    return (
      <Link to={link.to} className={className} onClick={onClick}>
        {link.label}
      </Link>
    );
  }
  const href = isHome ? link.href : `/${link.href}`;
  return (
    <a href={href} className={className} onClick={onClick}>
      {link.label}
    </a>
  );
}

export default function Navbar() {
  const { t, lang, setLang, setContactOpen } = useApp();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[200] border-b px-6 py-3.5 transition-all duration-300",
        scrolled
          ? "border-navy/[.06] bg-softbg/80 dark:border-white/[.07] dark:bg-[#070b16]/85 shadow-[0_4px_22px_rgba(15,23,42,.07)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-navy text-emerald-500 shadow-[0_6px_16px_rgba(15,23,42,.25)]">
            <BarChart3 className="h-[21px] w-[21px]" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            Digital <span className="text-azure">CFO</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavItem
              key={l.key}
              link={{ ...l, label: t(l.key) }}
              isHome={isHome}
              className="text-[14.5px] font-medium text-slate-600 transition-colors hover:text-navy dark:text-slate-300 dark:hover:text-white"
            />
          ))}
        </div>

        <div className="hidden items-center gap-2.5 lg:flex">
          <LangDropdown lang={lang} setLang={setLang} />
          <ThemeToggle />
          <Button variant="navy" size="sm" onClick={() => setContactOpen(true)}>
            <MessageCircle className="h-[16px] w-[16px]" /> {t("nav.contact")}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LangDropdown lang={lang} setLang={setLang} />
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-navy text-white"
            aria-label="Menyu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3.5 flex flex-col gap-1 rounded-2xl border border-navy/[.08] bg-white/95 dark:bg-[#0d182b]/95 p-3.5 shadow-[0_20px_40px_rgba(15,23,42,.12)] backdrop-blur-xl lg:hidden"
          >
            {NAV_LINKS.map((l) => (
              <NavItem
                key={l.key}
                link={{ ...l, label: t(l.key) }}
                isHome={isHome}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-3.5 py-3 text-[15px] font-semibold text-navy dark:text-slate-100"
              />
            ))}
            <Button variant="navy" className="mt-1.5"
              onClick={() => { setOpen(false); setContactOpen(true); }}>
              <MessageCircle className="h-[16px] w-[16px]" /> {t("nav.contact")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LangDropdown({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const cur = LANGS.find((l) => l.code === lang) || LANGS[0];
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-[10px] border border-navy/10 px-2.5 py-2 text-[13.5px] font-medium text-slate-600 transition-colors hover:text-navy dark:border-white/15 dark:text-slate-300 dark:hover:text-white"
        aria-label="Til"
      >
        <Globe className="h-[16px] w-[16px]" /> {cur.short}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 z-50 mt-1.5 w-[140px] overflow-hidden rounded-xl border border-navy/[.08] bg-white shadow-[0_16px_36px_rgba(15,23,42,.16)] dark:border-white/10 dark:bg-[#0d182b]"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[14px] transition-colors hover:bg-navy/[.04] dark:hover:bg-white/[.06] ${
                  l.code === lang ? "font-bold text-azure" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {l.label} <span className="font-mono text-[11px] opacity-60">{l.short}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
