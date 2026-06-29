import { motion } from "framer-motion";
import {
  LayoutGrid,
  UploadCloud,
  CreditCard,
  Calculator,
  Brain,
  FileText,
  FlaskConical,
  Rocket,
  Dot,
} from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useApp } from "@/lib/i18n";

const PHASE_META = [
  { Icon: LayoutGrid, tint: "azure" },
  { Icon: UploadCloud, tint: "emerald" },
  { Icon: CreditCard, tint: "azure" },
  { Icon: Calculator, tint: "emerald" },
  { Icon: Brain, tint: "azure" },
  { Icon: FileText, tint: "emerald" },
  { Icon: FlaskConical, tint: "azure" },
  { Icon: Rocket, tint: "emerald" },
];

const TINT = {
  azure: { border: "border-azure/25", bg: "bg-azure/[.04]", iconBg: "bg-azure/10", text: "text-azure" },
  emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/[.04]", iconBg: "bg-emerald-500/10", text: "text-emerald-500" },
};

export default function Roadmap() {
  const { t } = useApp();
  const PHASES = t("rm.phases").map((p, i) => ({ ...p, ...PHASE_META[i] }));
  return (
    <section id="roadmap" className="bg-white px-6 py-[90px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-10"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-azure">
            {t("rm.eyebrow")}
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            {t("rm.title")}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="no-scrollbar overflow-x-auto pb-3.5"
        >
          <div className="flex min-w-max gap-[18px]">
            {PHASES.map((p) => {
              const tint = TINT[p.tint];
              return (
                <div
                  key={p.label}
                  className={`w-[236px] flex-none rounded-[18px] border ${tint.border} ${tint.bg} p-[22px]`}
                >
                  <div className={`mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-xl ${tint.iconBg} ${tint.text}`}>
                    <p.Icon className="h-[21px] w-[21px]" />
                  </div>
                  <div className={`font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] ${tint.text}`}>
                    {p.label}
                  </div>
                  <h3 className="mb-3.5 mt-1.5 font-heading text-[18px] font-bold">
                    {p.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {p.items.map((it) => (
                      <div
                        key={it}
                        className="flex items-start gap-2 text-[13.5px] leading-snug text-slate-500"
                      >
                        <Dot className="h-4 w-4 flex-none text-slate-400" />
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
