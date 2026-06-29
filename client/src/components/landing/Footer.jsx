import { BarChart3, Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useApp } from "@/lib/i18n";

const NAV_LINKS = [
  { key: "nav.home", href: "#hero" },
  { key: "nav.how", href: "#how-it-works" },
  { key: "nav.services", href: "#services" },
  { key: "nav.kpi", href: "#kpi" },
  { key: "nav.pricing", href: "#pricing" },
  { key: "nav.faq", href: "#faq" },
];

export default function Footer() {
  const { t } = useApp();
  const SERVICES = t("ft.services");
  return (
    <footer className="bg-[#0b1220] px-6 pb-[30px] pt-16 text-slate-300">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-9 border-b border-white/[.08] pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3.5 flex items-center gap-2.5">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-white">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="font-heading text-[19px] font-bold text-white">
                Digital <span className="text-azure">CFO</span>
              </span>
            </div>
            <p className="max-w-[260px] text-[14px] leading-relaxed text-slate-400">
              {t("ft.about")}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-[15px] font-bold text-white">{t("ft.links")}</h4>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-[14px] text-slate-400 transition-colors hover:text-white">
                  {t(l.key)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-[15px] font-bold text-white">{t("ft.servicesTitle")}</h4>
            <div className="flex flex-col gap-2.5">
              {SERVICES.map((s) => (
                <span key={s} className="text-[14px] text-slate-400">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-[15px] font-bold text-white">{t("ft.contactTitle")}</h4>
            <div className="flex flex-col gap-[11px] text-[14px] text-slate-400">
              <a href="mailto:n.ganiyev2007@gmail.com" className="flex items-center gap-2.5 hover:text-white">
                <Mail className="h-4 w-4" /> n.ganiyev2007@gmail.com
              </a>
              <a href="tel:+998902392828" className="flex items-center gap-2.5 hover:text-white">
                <Phone className="h-4 w-4" /> +998 90 239 28 28
              </a>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4" /> Toshkent, O'zbekiston
              </div>
              <div className="mt-2 flex gap-2.5">
                <a
                  href="https://t.me/Moliyaviy_Tahlilchi_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/[.06] text-slate-300 transition-colors hover:bg-azure hover:text-white"
                  aria-label="Telegram"
                >
                  <Send className="h-[18px] w-[18px]" />
                </a>
                <a
                  href="https://wa.me/998911622545"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white/[.06] text-slate-300 transition-colors hover:bg-emerald-500 hover:text-white"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 pt-6 text-[13px] text-slate-500">
          <span>{t("ft.rights")}</span>
          <div className="flex gap-5">
            <a href="/maxfiylik.html" className="hover:text-white">{t("ft.privacy")}</a>
            <a href="/shartlar.html" className="hover:text-white">{t("ft.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
