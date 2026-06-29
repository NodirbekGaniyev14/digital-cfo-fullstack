import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useApp } from "@/lib/i18n";

// Raqam/ikonka/ohang sobit; matn (bench, desc) t() dan keladi.
const KPI_META = [
  { label: "Current Ratio", value: "2.41", tone: "good", Trend: TrendingUp },
  { label: "Quick Ratio", value: "1.83", tone: "good", Trend: TrendingUp },
  { label: "Debt Ratio", value: "0.38", tone: "good", Trend: Minus },
  { label: "Net Profit Margin", value: "18.5%", tone: "good", Trend: TrendingUp },
  { label: "Operating Margin", value: "24.2%", tone: "good", Trend: TrendingUp },
  { label: "Cash Flow Stress", value: "12.3%", tone: "warn", Trend: TrendingDown },
  { label: "Risk Score", value: "23", tone: "good", Trend: TrendingDown },
  { label: "Financial Health", value: "87", tone: "good", Trend: TrendingUp },
];

const TONE = {
  good: { badge: "text-emerald-400 bg-emerald-500/15", trend: "text-emerald-400" },
  warn: { badge: "text-amber-400 bg-amber-500/15", trend: "text-amber-400" },
};

export default function KPIAnalytics() {
  const { t } = useApp();
  const items = t("kpi.items");
  const KPIS = KPI_META.map((k, i) => ({ ...k, bench: items[i].bench, desc: items[i].desc }));
  return (
    <section id="kpi" className="relative overflow-hidden bg-navy px-6 py-[90px]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-[50px] max-w-[700px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-300">
            {t("kpi.eyebrow")}
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em] text-white">
            {t("kpi.title")}
          </h2>
          <p className="mt-3.5 text-[17px] text-slate-400">
            {t("kpi.subtitle")}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-1.5 text-[12px] font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("kpi.sample")}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.05)}
          className="grid grid-cols-2 gap-[18px] lg:grid-cols-4"
        >
          {KPIS.map((k) => {
            const tone = TONE[k.tone];
            return (
              <motion.div
                key={k.label}
                variants={fadeUp}
                className="dark-glass rounded-[18px] p-[22px]"
              >
                <div className="mb-3.5 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-slate-400">
                    {k.label}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${tone.badge}`}>
                    {k.bench}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-mono text-[34px] font-bold leading-none text-white">
                    {k.value}
                  </span>
                  <k.Trend className={`h-[22px] w-[22px] ${tone.trend}`} />
                </div>
                <p className="mt-3 text-[12.5px] leading-snug text-slate-500">
                  {k.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
