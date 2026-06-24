import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Phone, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContact } from "@/api/base44Client";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const CONTACTS = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+998 91 162 25 45",
    href: "https://wa.me/998911622545",
    bg: "bg-emerald-500/10",
    color: "text-emerald-500",
  },
  {
    Icon: Send,
    label: "Telegram",
    value: "@Moliyaviy_Tahlilchi_bot",
    href: "https://t.me/Moliyaviy_Tahlilchi_bot",
    bg: "bg-azure/10",
    color: "text-azure",
  },
  {
    Icon: Phone,
    label: "Telefon",
    value: "+998 90 239 28 28",
    href: "tel:+998902392828",
    bg: "bg-navy/[.06]",
    color: "text-navy",
  },
];

const ACCEPT = ".xlsx,.xls,.csv";
const MAX_SIZE = 15 * 1024 * 1024; // 15 MB — backend bilan bir xil

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [balanceName, setBalanceName] = useState("");
  const [reportName, setReportName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Frontend validatsiyasi (backend ham tekshiradi)
    if (!data.get("name") || !data.get("email")) {
      toast.error("Ism va email majburiy");
      return;
    }
    if (!data.get("consent")) {
      toast.error("Davom etish uchun maxfiylik siyosatiga rozilik bering");
      return;
    }
    for (const field of ["balance", "report"]) {
      const f = data.get(field);
      if (f && f.size > MAX_SIZE) {
        toast.error("Har bir fayl 15 MB dan oshmasligi kerak");
        return;
      }
      if (f && f.size === 0) data.delete(field); // bo'sh maydonni yubormaslik
    }

    setLoading(true);
    try {
      await submitContact(data);
      toast.success("So'rovingiz yuborildi — tez orada bog'lanamiz!");
      form.reset();
      setBalanceName("");
      setReportName("");
    } catch (err) {
      toast.error(err.message || "So'rovni yuborib bo'lmadi. Keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="px-6 py-[90px]"
      style={{
        background:
          "radial-gradient(50% 50% at 85% 10%, rgba(16,185,129,.1), transparent 60%), #F8FAFC",
      }}
    >
      <div className="mx-auto max-w-[760px] text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-azure">
            Aloqa
          </div>
          <h2 className="mb-3 mt-3 font-heading text-[clamp(28px,3.6vw,40px)] font-bold tracking-[-0.02em]">
            Bugun boshlang
          </h2>
          <p className="mx-auto mb-9 max-w-[560px] text-[16px] leading-relaxed text-slate-600">
            Faylingizni yuboring yoki savol bering — biz tez orada bog'lanamiz
            va birinchi tahlilni bepul taqdim etamiz.
          </p>
        </motion.div>

        {/* Lead / fayl yuklash formasi */}
        <motion.form
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="glass-card mx-auto mb-9 grid max-w-[640px] gap-4 rounded-2xl p-7 text-left shadow-[0_10px_30px_rgba(15,23,42,.06)] sm:grid-cols-2"
        >
          {/* Honeypot — odamlarga ko'rinmaydi, faqat bot'lar to'ldiradi */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <div>
            <Label htmlFor="cf-name">Ism *</Label>
            <Input id="cf-name" name="name" placeholder="Ismingiz" required />
          </div>
          <div>
            <Label htmlFor="cf-company">Kompaniya</Label>
            <Input id="cf-company" name="company" placeholder="Kompaniya nomi" />
          </div>
          <div>
            <Label htmlFor="cf-email">Email *</Label>
            <Input
              id="cf-email"
              name="email"
              type="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="cf-phone">Telefon</Label>
            <Input
              id="cf-phone"
              name="phone"
              type="tel"
              placeholder="+998 90 123 45 67"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="cf-message">Xabar</Label>
            <Textarea
              id="cf-message"
              name="message"
              rows={3}
              placeholder="Qisqacha izoh yoki savolingiz..."
            />
          </div>

          {/* Fayllar — 1: Balans, 2: Moliyaviy hisobot (ikkalasi ixtiyoriy) */}
          <div className="sm:col-span-2">
            <div className="mb-2 text-[13px] font-semibold text-slate-700">
              Moliyaviy fayllar (.xlsx, .xls, .csv)
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FileDrop
                id="cf-balance"
                name="balance"
                label="1. Balans (Shakl 1)"
                value={balanceName}
                onChange={(e) => setBalanceName(e.target.files?.[0]?.name || "")}
              />
              <FileDrop
                id="cf-report"
                name="report"
                label="2. Moliyaviy hisobot (Shakl 2)"
                value={reportName}
                onChange={(e) => setReportName(e.target.files?.[0]?.name || "")}
              />
            </div>
          </div>

          {/* Rozilik */}
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] leading-snug text-slate-600">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-0.5 h-4 w-4 flex-none accent-emerald-500"
              />
              <span>
                Men{" "}
                <a
                  href="/maxfiylik.html"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-azure hover:underline"
                >
                  maxfiylik siyosati
                </a>{" "}
                shartlariga roziman va ma'lumotlarim qayta ishlanishiga
                ruxsat beraman.
              </span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="emerald"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-[18px] w-[18px] animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <Send className="h-[17px] w-[17px]" /> So'rovni yuborish
                </>
              )}
            </Button>
          </div>
        </motion.form>

        {/* Tezkor aloqa kanallari */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mx-auto grid max-w-[640px] gap-3.5 sm:grid-cols-3"
        >
          {CONTACTS.map((c) => (
            <motion.a
              key={c.label}
              variants={fadeUp}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="glass-card flex flex-col items-center gap-3 rounded-2xl p-6 text-center shadow-[0_6px_16px_rgba(15,23,42,.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,.1)]"
            >
              <div className={`flex h-[46px] w-[46px] items-center justify-center rounded-[13px] ${c.bg} ${c.color}`}>
                <c.Icon className="h-[22px] w-[22px]" />
              </div>
              <div>
                <div className="text-[13px] text-slate-500">{c.label}</div>
                <div className="font-mono text-[14px] font-semibold text-navy">
                  {c.value}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Bitta fayl tanlash maydoni (Balans / Moliyaviy hisobot uchun qayta ishlatiladi)
function FileDrop({ id, name, label, value, onChange }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-navy/20 bg-white/60 px-4 py-3.5 text-sm text-slate-500 transition-colors hover:border-azure hover:bg-azure/[.03]"
      >
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-azure/10 text-azure">
          <Upload className="h-[18px] w-[18px]" />
        </span>
        <span className="truncate">{value || "Faylni tanlang"}</span>
        <input
          id={id}
          name={name}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
