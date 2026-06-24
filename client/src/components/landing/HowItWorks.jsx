import { motion } from "framer-motion";
import { Upload, ShieldCheck, BarChart3, Brain, FileText } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/motion";

const STEPS = [
  { num: "01", Icon: Upload, title: "Faylni yuklang", desc: "Excel yoki CSV moliyaviy faylingizni tizimga yuklang." },
  { num: "02", Icon: ShieldCheck, title: "Validatsiya", desc: "Tizim ma'lumotlarni avtomatik tekshiradi va tozalaydi." },
  { num: "03", Icon: BarChart3, title: "KPI hisoblash", desc: "Barcha asosiy moliyaviy ko'rsatkichlar hisoblanadi." },
  { num: "04", Icon: Brain, title: "AI tahlil", desc: "Sun'iy intellekt natijalarni chuqur tahlil qiladi." },
  { num: "05", Icon: FileText, title: "PDF hisobot", desc: "Tayyor professional hisobotni yuklab oling." },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-6 py-[90px]"
      style={{
        background:
          "radial-gradient(50% 50% at 80% 0%, rgba(59,130,246,.1), transparent 60%), #F8FAFC",
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
            Jarayon
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            Qanday ishlaydi
          </h2>
          <p className="mt-3.5 text-[17px] text-slate-600">
            Faylni yuklashdan tayyor hisobotgacha — atigi besh qadam.
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
