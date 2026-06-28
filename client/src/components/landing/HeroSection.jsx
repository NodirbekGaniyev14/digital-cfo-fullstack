import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Brain,
  Zap,
  FileText,
  FileCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUpDelay } from "@/lib/motion";

const TRUST = [
  { icon: ShieldCheck, label: "Xavfsiz" },
  { icon: Brain, label: "AI tahlil" },
  { icon: Zap, label: "Tez natija" },
  { icon: FileText, label: "PDF hisobot" },
];
const HERO_KPIS = [
  { label: "Likvidlik", value: "2.4", color: "#3B82F6" },
  { label: "Risk Score", value: "23", color: "#10B981" },
  { label: "Foyda", value: "18.5%", color: "#fff" },
];
const BARS = [40, 66, 52, 80, 58, 90, 70, 100, 62, 86, 76, 95];

export default function HeroSection() {
  return (
    // Hero — yuqori qism: sarlavha, CTA va dashboard mockup
    <section
      id="hero"
      className="hero-gradient relative overflow-hidden px-6 pb-[90px] pt-[140px]"
    >
      {/* Aurora — animatsiyali rangli fon */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-blob absolute -left-24 top-8 h-72 w-72 bg-azure/30" />
        <div className="aurora-blob absolute -right-10 top-36 h-80 w-80 bg-emerald-500/25 [animation-delay:-7s]" />
        <div className="aurora-blob absolute bottom-0 left-1/3 h-64 w-64 bg-azure/20 [animation-delay:-13s]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.035) 1px,transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-[54px] lg:grid-cols-2">
        {/* Left */}
        <div>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUpDelay(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-white/70 px-[15px] py-2 text-[13px] font-semibold text-emerald-700 backdrop-blur-md"
          >
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-emerald-500" />
            AI-powered moliyaviy tahlil
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUpDelay(0.05)}
            className="mt-[22px] font-heading text-[clamp(40px,5.4vw,64px)] font-extrabold leading-[1.04] tracking-[-0.03em]"
          >
            Moliyaviy Kelajagingizni{" "}
            <span className="gradient-text">AI Boshqaruviga</span> Topshiring
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUpDelay(0.12)}
            className="mt-[22px] max-w-[520px] text-[18px] leading-relaxed text-slate-600"
          >
            Balans va moliyaviy hisobotingizni yuboring — biz ularni chuqur
            tahlil qilib, KPI'lar va amaliy tavsiyalar bilan tayyor CFO
            darajasidagi hisobotni qaytaramiz.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUpDelay(0.18)}
            className="mt-[30px] flex flex-wrap gap-3"
          >
            <Button asChild variant="navy" size="lg">
              <a href="#contact">
                Bepul boshlash <ArrowRight className="h-[17px] w-[17px]" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#dashboard">Demo ko'rish</a>
            </Button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUpDelay(0.26)}
            className="mt-[34px] flex flex-wrap gap-[22px]"
          >
            {TRUST.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 text-[13px] font-medium text-slate-600"
              >
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-azure/10 text-azure">
                  <t.icon className="h-4 w-4" />
                </div>
                {t.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="float-animation rounded-[22px] border border-white/10 bg-gradient-to-b from-navy-light to-navy p-[22px] shadow-[0_40px_80px_rgba(15,23,42,.4)]">
            <div className="mb-[18px] flex items-center gap-2">
              <span className="h-[11px] w-[11px] rounded-full bg-red-500" />
              <span className="h-[11px] w-[11px] rounded-full bg-amber-500" />
              <span className="h-[11px] w-[11px] rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-slate-400">
                Digital CFO Dashboard
              </span>
              <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-slate-300">
                Namuna
              </span>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2.5">
              {HERO_KPIS.map((k) => (
                <div
                  key={k.label}
                  className="rounded-[13px] border border-white/10 bg-white/5 p-[13px]"
                >
                  <div className="text-[11px] font-medium text-slate-400">
                    {k.label}
                  </div>
                  <div
                    className="mt-1.5 font-mono text-[22px] font-bold"
                    style={{ color: k.color }}
                  >
                    {k.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-3.5 rounded-[13px] border border-white/[.07] bg-white/[.04] p-4">
              <div className="mb-3 font-mono text-[11px] font-medium text-slate-400">
                OYLIK DINAMIKA
              </div>
              <div className="flex h-24 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[5px_5px_2px_2px] bg-gradient-to-b from-azure to-emerald-500"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-[11px] border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-[11px]">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-300">
                <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
                AI tahlil tugallandi
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                <FileText className="h-3.5 w-3.5" /> PDF tayyor
              </div>
            </div>
          </div>

          <div className="float-animation absolute -right-3 -top-[18px] flex items-center gap-2.5 rounded-[14px] bg-white px-[15px] py-[11px] shadow-[0_16px_34px_rgba(15,23,42,.16)] [animation-delay:.4s]">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-azure to-emerald-500 text-white">
              <Brain className="h-[17px] w-[17px]" />
            </div>
            <div>
              <div className="text-xs font-bold">AI Tahlil</div>
              <div className="text-[10.5px] text-slate-500">Real vaqtda</div>
            </div>
          </div>
          <div className="float-animation absolute -bottom-4 -left-3 flex items-center gap-2.5 rounded-[14px] bg-white px-[15px] py-[11px] shadow-[0_16px_34px_rgba(15,23,42,.16)] [animation-delay:.8s]">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-emerald-500/10 text-emerald-500">
              <FileCheck2 className="h-[17px] w-[17px]" />
            </div>
            <div>
              <div className="text-xs font-bold">PDF Hisobot</div>
              <div className="text-[10.5px] text-slate-500">
                Yuklab olishga tayyor
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
