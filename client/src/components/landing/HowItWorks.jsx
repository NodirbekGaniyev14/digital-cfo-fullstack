import { motion } from "framer-motion";
import { Upload, ShieldCheck, BarChart3, Brain, FileText, Download } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useApp } from "@/lib/i18n";

const STEP_ICONS = [Upload, ShieldCheck, BarChart3, Brain, FileText];

// Qadam bo'yicha yuklab olinadigan namuna fayllar (public/ dan beriladi).
// 0-qadam ("Faylni yuklang") — 2 ta Excel; oxirgi ("PDF hisobot") — namuna PDF.
const STEP_DOWNLOADS = {
  0: [
    { href: "/Shakl_1_Balans_namuna.xlsx", labelKey: "how.dlBalans" },
    { href: "/Shakl_2_Moliyaviy_namuna.xlsx", labelKey: "how.dlMoliya" },
  ],
  4: [{ href: "/Namuna_Moliyaviy_Hisobot.pdf", labelKey: "how.dlPdf" }],
};

export default function HowItWorks() {
  const { t } = useApp();
  const STEPS = t("how.steps").map((s, i) => ({
    ...s, num: String(i + 1).padStart(2, "0"), Icon: STEP_ICONS[i],
  }));
  return (
    <section
      id="how-it-works"
      className="px-6 py-[90px]"
      style={{
        background:
          "radial-gradient(50% 50% at 80% 0%, rgba(59,130,246,.1), transparent 60%), var(--page)",
      }}
    >
      <div className="mx-auto max-w-[1000px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-14 max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-500">
            {t("how.eyebrow")}
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            {t("how.title")}
          </h2>
          <p className="mt-3.5 text-[17px] text-slate-600">
            {t("how.subtitle")}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-y-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-azure to-emerald-500 opacity-35 lg:block" />
          <div className="flex flex-col gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className={`flex ${i % 2 === 1 ? "lg:justify-end" : "lg:justify-start"}`}
              >
                <div className="glass-card flex w-full max-w-[440px] items-start gap-4 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(15,23,42,.07)]">
                  <div className="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-[14px] bg-navy text-emerald-500">
                    <s.Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="inline-block rounded-md bg-azure/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-azure">
                      {s.num}
                    </div>
                    <h3 className="mb-1.5 mt-2 font-heading text-[19px] font-bold">
                      {s.title}
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-slate-500">
                      {s.desc}
                    </p>
                    {STEP_DOWNLOADS[i] && (
                      <div className="mt-3.5">
                        <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                          {t("how.dlLabel")}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {STEP_DOWNLOADS[i].map((f) => (
                            <a
                              key={f.href}
                              href={f.href}
                              download
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/[.07] px-2.5 py-1.5 text-[12.5px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-400"
                            >
                              <Download className="h-3.5 w-3.5 flex-none" />
                              {t(f.labelKey)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
