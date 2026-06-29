import { motion } from "framer-motion";
import { CircleAlert, Sparkles, X, Check } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { useApp } from "@/lib/i18n";

export default function ProblemSolution() {
  const { t } = useApp();
  const PROBLEMS = t("ps.problems");
  const SOLUTIONS = t("ps.solutions");
  return (
    <section className="px-6 py-[90px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-[50px] max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-azure">
            {t("ps.eyebrow")}
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            {t("ps.title")}
          </h2>
        </motion.div>

        <div className="grid gap-[26px] md:grid-cols-2">
          {/* Problems */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.08)}
            className="rounded-[22px] border border-red-500/20 bg-gradient-to-b from-red-500/[.06] to-red-500/[.02] p-[34px]"
          >
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <CircleAlert className="h-[23px] w-[23px]" />
              </div>
              <h3 className="font-heading text-[22px] font-bold">
                {t("ps.problemsTitle")}
              </h3>
            </motion.div>
            <div className="flex flex-col gap-3.5">
              {PROBLEMS.map((p) => (
                <motion.div key={p} variants={fadeUp} className="flex items-start gap-3">
                  <div className="mt-px flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <X className="h-[15px] w-[15px]" />
                  </div>
                  <span className="text-[15.5px] leading-snug text-slate-600">
                    {p}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer(0.08)}
            className="rounded-[22px] border border-emerald-500/25 bg-gradient-to-b from-emerald-500/[.07] to-emerald-500/[.02] p-[34px]"
          >
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <Sparkles className="h-[23px] w-[23px]" />
              </div>
              <h3 className="font-heading text-[22px] font-bold">
                {t("ps.solutionsTitle")}
              </h3>
            </motion.div>
            <div className="flex flex-col gap-3.5">
              {SOLUTIONS.map((s) => (
                <motion.div key={s} variants={fadeUp} className="flex items-start gap-3">
                  <div className="mt-px flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
                    <Check className="h-[15px] w-[15px]" />
                  </div>
                  <span className="text-[15.5px] font-medium leading-snug text-slate-700">
                    {s}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
