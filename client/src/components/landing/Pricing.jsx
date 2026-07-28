import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useApp } from "@/lib/i18n";

export default function Pricing() {
  const { t } = useApp();
  const PLAN = {
    name: t("pr.name"), oldPrice: "249 000", price: "0", per: t("pr.per"),
    note: t("pr.note"), badge: t("pr.badge"), features: t("pr.features"), cta: t("pr.cta"),
  };
  return (
    <section
      id="pricing"
      className="px-6 py-[90px]"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 0%, rgba(59,130,246,.1), transparent 60%), var(--page)",
      }}
    >
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-[50px] max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-azure">
            {t("pr.eyebrow")}
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            {t("pr.title")}
          </h2>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="relative w-full max-w-[460px] rounded-[22px] border-[1.5px] border-emerald-500 bg-white p-9 shadow-[0_24px_54px_rgba(16,185,129,.18)]"
          >
            <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-[#0f172a] shadow-[0_8px_18px_rgba(16,185,129,.4)]">
              {PLAN.badge}
            </div>

            <h3 className="font-heading text-[22px] font-bold">{PLAN.name}</h3>

            <div className="mt-4 font-mono text-[17px] text-slate-400 line-through decoration-red-500">
              {PLAN.oldPrice} {t("pr.sum")}
            </div>
            <div className="mb-2.5 mt-1.5 flex items-end gap-2">
              <span className="font-mono text-[44px] font-bold leading-none text-emerald-500">
                {PLAN.price}
              </span>
              <span className="mb-1.5 text-base font-semibold text-slate-600">{t("pr.sum")}</span>
            </div>
            <div className="mb-2.5 text-[13.5px] text-slate-400">{PLAN.per}</div>
            <div className="mb-6 inline-block rounded-full bg-emerald-500/10 px-3.5 py-1 text-[12.5px] font-bold text-emerald-700 dark:text-emerald-400">
              {PLAN.note}
            </div>

            <div className="mb-7 flex flex-col gap-3">
              {PLAN.features.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2.5 text-[14.5px] leading-snug text-slate-600"
                >
                  <Check className="mt-px h-[18px] w-[18px] flex-none text-emerald-500" />
                  {f}
                </div>
              ))}
            </div>

            <Button asChild variant="emerald" className="w-full" size="lg">
              <a href="https://t.me/Moliyaviy_Tahlilchi_bot" target="_blank" rel="noreferrer">{PLAN.cta}</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
