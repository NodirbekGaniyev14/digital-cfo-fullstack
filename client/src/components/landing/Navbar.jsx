import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Bosh sahifa", href: "#hero" },
  { label: "Qanday ishlaydi", href: "#how-it-works" },
  { label: "Bepul tahlil", href: "#tahlil" },
  { label: "Xizmatlar", href: "#services" },
  { label: "KPI Tahlil", href: "#kpi" },
  { label: "Narxlar", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

// Sotuv CTA'lari kontakt formasi o'rniga Telegram botga yo'naltiriladi.
const BOT_URL = "https://t.me/Moliyaviy_Tahlilchi_bot";

export default function Navbar() {
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
        <a href="#hero" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-navy text-emerald-500 shadow-[0_6px_16px_rgba(15,23,42,.25)]">
            <BarChart3 className="h-[21px] w-[21px]" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            Digital <span className="text-azure">CFO</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14.5px] font-medium text-slate-600 transition-colors hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <a href="#dashboard">Demo</a>
          </Button>
          <Button asChild variant="navy" size="sm">
            <a href={BOT_URL} target="_blank" rel="noreferrer">Boshlash</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
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
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-3.5 py-3 text-[15px] font-semibold text-navy"
              >
                {l.label}
              </a>
            ))}
            <Button asChild variant="navy" className="mt-1.5">
              <a href={BOT_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                Boshlash
              </a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
