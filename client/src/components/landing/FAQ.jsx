import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeUp, viewportOnce } from "@/lib/motion";

const FAQS = [
  {
    q: "Qaysi fayl formatlari qabul qilinadi?",
    a: "Tizim .xlsx, .xls va CSV formatdagi moliyaviy fayllarni qabul qiladi. Fayl avtomatik tekshiriladi va validatsiyadan o'tkaziladi.",
  },
  {
    q: "Tahlil qancha vaqt oladi?",
    a: "Faylingiz murakkabligiga bog'liq. Tahlil tayyor bo'lishi bilan biz siz bilan bog'lanamiz va hisobotni yetkazamiz.",
  },
  {
    q: "To'lov qanday amalga oshiriladi?",
    a: "Payme, Click hamda bank o'tkazmasi orqali qulay tarzda to'lov qilishingiz mumkin.",
  },
  {
    q: "Tahlil ishonchliligi qanchalik?",
    a: "Har bir hisobot tajribali mutaxassis nazoratidan o'tadi va natijalar benchmark ko'rsatkichlar bilan solishtirib tekshiriladi.",
  },
  {
    q: "Hisobotni yuklab olsa bo'ladimi?",
    a: "Ha, har bir tahlil yakunida professional PDF hisobotni bir tugma bilan yuklab olishingiz mumkin.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "Ma'lumotlaringiz himoyalangan (HTTPS) ulanish orqali uzatiladi, faqat tahlil maqsadida ishlatiladi va uchinchi shaxslarga berilmaydi.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-white px-6 py-[90px]">
      <div className="mx-auto max-w-[760px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-[46px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-500">
            FAQ
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            Ko'p so'raladigan savollar
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <Accordion type="single" collapsible defaultValue="item-0" className="flex flex-col gap-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
