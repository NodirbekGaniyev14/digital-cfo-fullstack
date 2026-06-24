import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

// NAMUNA sharhlar — ishga tushirishdan oldin haqiqiy mijoz sharhlari bilan
// almashtiring (ism, lavozim, kompaniya va matnni real qiling).
const REVIEWS = [
  {
    name: "Dilshod R.",
    role: "Direktor, savdo kompaniyasi",
    text: "Avval hisobotlarni tushunish uchun buxgalterga murojaat qilardik. Endi faylni yuklasak — KPI va tavsiyalar tayyor. Vaqtni juda tejadik.",
    initial: "D",
  },
  {
    name: "Nigora A.",
    role: "Moliyaviy menejer, ishlab chiqarish",
    text: "Likvidlik va risk ko'rsatkichlari aniq ko'rsatilgan. Rahbariyatga taqdimot qilish ancha osonlashdi.",
    initial: "N",
  },
  {
    name: "Sardor M.",
    role: "Tadbirkor, xizmat ko'rsatish",
    text: "PDF hisobot professional ko'rinishda chiqadi. Investorlar bilan suhbatda aynan shu hujjat yordam berdi.",
    initial: "S",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white px-6 py-[90px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-[50px] max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-azure">
            Sharhlar
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            Mijozlarimiz fikri
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-navy/[.03] px-3.5 py-1.5 text-[12px] font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Namuna sharhlar — tez orada haqiqiy mijoz fikrlari bilan to'ldiriladi
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="grid gap-5 md:grid-cols-3"
        >
          {REVIEWS.map((r) => (
            <motion.figure
              key={r.name}
              variants={fadeUp}
              className="glass-card flex flex-col rounded-[20px] border border-navy/[.06] p-7 shadow-[0_6px_18px_rgba(15,23,42,.05)]"
            >
              <Quote className="h-7 w-7 text-azure/30" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-[15px] w-[15px] fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="mt-3.5 flex-1 text-[14.5px] leading-relaxed text-slate-600">
                "{r.text}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-navy/[.06] pt-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-azure to-emerald-500 font-heading text-[17px] font-bold text-white">
                  {r.initial}
                </div>
                <div>
                  <div className="font-heading text-[15px] font-bold">
                    {r.name}
                  </div>
                  <div className="text-[12.5px] text-slate-500">{r.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
