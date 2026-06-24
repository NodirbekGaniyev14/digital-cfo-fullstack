import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  LayoutDashboard,
  Brain,
  ShieldAlert,
  FileText,
  Briefcase,
  CalendarCheck,
  Lightbulb,
} from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const SERVICES = [
  { Icon: FileSpreadsheet, title: "Moliyaviy fayl tahlili", desc: "Excel va CSV fayllarini avtomatik o'qish va qayta ishlash." },
  { Icon: LayoutDashboard, title: "KPI Dashboard", desc: "Barcha ko'rsatkichlar bitta interaktiv panelda." },
  { Icon: Brain, title: "AI CFO hisobot", desc: "Sun'iy intellekt asosida chuqur moliyaviy tahlil." },
  { Icon: ShieldAlert, title: "Risk diagnostikasi", desc: "Moliyaviy risklarni aniqlash va baholash." },
  { Icon: FileText, title: "PDF hisobot yaratish", desc: "Professional ko'rinishdagi tayyor hisobotlar." },
  { Icon: Briefcase, title: "Konsalting", desc: "Tajribali mutaxassislar bilan maslahat." },
  { Icon: CalendarCheck, title: "Oylik monitoring", desc: "Biznesingizni doimiy kuzatib borish." },
  { Icon: Lightbulb, title: "Biznes maslahat", desc: "Strategik qarorlar uchun amaliy tavsiyalar." },
];

export default function Services() {
  return (
    <section
      id="services"
      className="px-6 py-[90px]"
      style={{
        background:
          "radial-gradient(50% 50% at 15% 10%, rgba(16,185,129,.1), transparent 60%), #F8FAFC",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-[50px] max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-500">
            Xizmatlar
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            Biz nima taklif qilamiz
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.05)}
          className="grid grid-cols-2 gap-5 lg:grid-cols-4"
        >
          {SERVICES.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="group glass-card rounded-[20px] p-[26px] shadow-[0_6px_18px_rgba(15,23,42,.05)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,.1)]"
            >
              <div className="mb-[18px] flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-navy/5 text-navy transition-colors group-hover:bg-azure/10 group-hover:text-azure">
                <s.Icon className="h-[25px] w-[25px]" />
              </div>
              <h3 className="mb-2 font-heading text-[18px] font-bold">{s.title}</h3>
              <p className="text-[14px] leading-relaxed text-slate-500">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
