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

const PHASES = [
  { Icon: LayoutGrid, phase: "01-bosqich", title: "Asos", items: ["Arxitektura", "UI dizayn", "Ma'lumotlar bazasi"], tint: "azure" },
  { Icon: UploadCloud, phase: "02-bosqich", title: "Yuklash tizimi", items: ["Fayl yuklash", "Format tekshirish", "Saqlash"], tint: "emerald" },
  { Icon: CreditCard, phase: "03-bosqich", title: "To'lov", items: ["Payme / Click", "Tariflar", "Cheklar"], tint: "azure" },
  { Icon: Calculator, phase: "04-bosqich", title: "KPI Engine", items: ["Likvidlik", "Rentabellik", "Risk hisob"], tint: "emerald" },
  { Icon: Brain, phase: "05-bosqich", title: "AI Engine", items: ["Tahlil modeli", "Tavsiyalar", "Benchmark"], tint: "azure" },
  { Icon: FileText, phase: "06-bosqich", title: "PDF Hisobot", items: ["Shablon", "Grafiklar", "Eksport"], tint: "emerald" },
  { Icon: FlaskConical, phase: "07-bosqich", title: "Sinov", items: ["Beta test", "Xatolar", "Optimallash"], tint: "azure" },
  { Icon: Rocket, phase: "08-bosqich", title: "Ishga tushirish", items: ["Marketing", "Qo'llab-quvvatlash", "Kengaytirish"], tint: "emerald" },
];

const TINT = {
  azure: { border: "border-azure/25", bg: "bg-azure/[.04]", iconBg: "bg-azure/10", text: "text-azure" },
  emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/[.04]", iconBg: "bg-emerald-500/10", text: "text-emerald-500" },
};

export default function Roadmap() {
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
            Yo'l xaritasi
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            Mahsulot bosqichlari
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
              const t = TINT[p.tint];
              return (
                <div
                  key={p.phase}
                  className={`w-[236px] flex-none rounded-[18px] border ${t.border} ${t.bg} p-[22px]`}
                >
                  <div className={`mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-xl ${t.iconBg} ${t.text}`}>
                    <p.Icon className="h-[21px] w-[21px]" />
                  </div>
                  <div className={`font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] ${t.text}`}>
                    {p.phase}
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
