import { motion } from "framer-motion";
import {
  ShoppingCart,
  FileUp,
  CreditCard,
  FileText,
  Brain,
  Clock,
} from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/motion";

const STATS = [
  { label: "Buyurtmalar", value: "24", Icon: ShoppingCart },
  { label: "Yuklangan fayllar", value: "18", Icon: FileUp },
  { label: "To'lovlar", value: "12", Icon: CreditCard },
  { label: "Hisobotlar", value: "16", Icon: FileText },
];
const BARS = [
  { label: "Likvidlik", val: "82%", pct: 82, color: "#3B82F6" },
  { label: "Rentabellik", val: "74%", pct: 74, color: "#10B981" },
  { label: "Risk Score", val: "23%", pct: 23, color: "#f59e0b" },
  { label: "Moliyaviy salomatlik", val: "87%", pct: 87, color: "#10B981" },
];
const ACTIVITY = [
  { Icon: FileUp, text: "Yangi fayl yuklandi: Q2_2026.xlsx", time: "2 daq", bg: "bg-azure/15", color: "text-azure" },
  { Icon: Brain, text: "AI tahlil yakunlandi", time: "5 daq", bg: "bg-emerald-500/15", color: "text-emerald-500" },
  { Icon: FileText, text: "PDF hisobot yaratildi", time: "6 daq", bg: "bg-white/10", color: "text-white" },
  { Icon: CreditCard, text: "To'lov qabul qilindi: Pro tarif", time: "1 soat", bg: "bg-amber-500/15", color: "text-amber-400" },
];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="bg-navy px-6 py-[90px]">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-11 max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-300">
            Demo
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em] text-white">
            Boshqaruv paneli
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-1.5 text-[12px] font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Interfeys namunasi — ko'rsatilgan raqamlar shartli
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0b1220] shadow-[0_40px_80px_rgba(0,0,0,.4)]"
        >
          <div className="flex items-center gap-2.5 border-b border-white/[.07] bg-white/[.03] px-[18px] py-3.5">
            <span className="h-[11px] w-[11px] rounded-full bg-red-500" />
            <span className="h-[11px] w-[11px] rounded-full bg-amber-500" />
            <span className="h-[11px] w-[11px] rounded-full bg-emerald-500" />
            <div className="ml-2 flex-1 rounded-lg bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-500">
              app.digitalcfo.uz/dashboard
            </div>
          </div>

          <div className="p-[26px]">
            <div className="mb-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-[14px] border border-white/10 bg-white/[.04] p-[18px]">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[13px] text-slate-400">{s.label}</span>
                    <s.Icon className="h-[18px] w-[18px] text-azure" />
                  </div>
                  <div className="font-mono text-[28px] font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* progress */}
              <div className="rounded-[14px] border border-white/[.07] bg-white/[.03] p-5">
                <div className="mb-[18px] font-heading text-[15px] font-bold text-white">
                  Ko'rsatkichlar
                </div>
                <div className="flex flex-col gap-4">
                  {BARS.map((b) => (
                    <div key={b.label}>
                      <div className="mb-1.5 flex justify-between text-[13px] text-slate-300">
                        <span>{b.label}</span>
                        <span className="font-mono" style={{ color: b.color }}>{b.val}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-md bg-white/[.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-md"
                          style={{ background: b.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* activity */}
              <div className="rounded-[14px] border border-white/[.07] bg-white/[.03] p-5">
                <div className="mb-[18px] font-heading text-[15px] font-bold text-white">
                  Faoliyat tarixi
                </div>
                <div className="flex flex-col gap-3.5">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] ${a.bg} ${a.color}`}>
                        <a.Icon className="h-[17px] w-[17px]" />
                      </div>
                      <span className="flex-1 text-[13.5px] text-slate-300">{a.text}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                        <Clock className="h-[13px] w-[13px]" />
                        {a.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
