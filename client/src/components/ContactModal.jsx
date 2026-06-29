import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, User, Mail, Phone, Send, MessageCircle, CheckCircle2,
  Linkedin, Twitter, AtSign, CircleCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44Client } from "@/api/base44Client";
import { useApp } from "@/lib/i18n";

export default function ContactModal() {
  const { t, contactOpen, setContactOpen } = useApp();
  const [form, setForm] = useState({ name: "", email: "", phone: "", telegram: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [ref, setRef] = useState("");
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function close() {
    setContactOpen(false);
    // Yopilgach holatni tiklash (animatsiya tugagach)
    setTimeout(() => {
      setStatus("idle");
      setRef("");
      setErr("");
      setForm({ name: "", email: "", phone: "", telegram: "", message: "" });
    }, 300);
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!form.name.trim()) return setErr(t("modal.errName"));
    if (!form.email.trim() && !form.phone.trim() && !form.telegram.trim())
      return setErr(t("modal.errContact"));
    setStatus("sending");
    try {
      const res = await fetch(`${base44Client.baseURL}/lead-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "fail");
      setRef(data.ref || "#Ariza");
      setStatus("done");
    } catch (e2) {
      setErr(e2.message && e2.message !== "fail" ? e2.message : t("modal.errGeneric"));
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {contactOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[100dvh] w-full max-w-[940px] grid-cols-1 overflow-y-auto bg-navy text-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl lg:grid-cols-2"
          >
            <button
              onClick={close}
              aria-label="Yopish"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Chap — hero */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0b1220] to-navy-light p-9 lg:flex">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-azure/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
              <div className="relative">
                <h2 className="font-heading text-[30px] font-extrabold leading-[1.12] tracking-[-0.02em]">
                  {t("modal.heroTitle")}
                </h2>
                <p className="mt-4 max-w-[330px] text-[14.5px] leading-relaxed text-slate-300">
                  {t("modal.heroText")}
                </p>
                <ul className="mt-7 flex flex-col gap-3.5">
                  {["modal.feat1", "modal.feat2", "modal.feat3"].map((k) => (
                    <li key={k} className="flex items-center gap-2.5 text-[14px] text-slate-200">
                      <CircleCheck className="h-[19px] w-[19px] flex-none text-emerald-400" />
                      {t(k)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative mt-8 flex gap-2.5">
                {[Linkedin, MessageCircle, Twitter].map((Icon, i) => (
                  <span key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[.07] text-slate-300">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                ))}
              </div>
            </div>

            {/* O'ng — forma yoki muvaffaqiyat */}
            <div className="bg-[#0d182b] p-7 sm:p-9">
              {status === "done" ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-16 w-16 text-emerald-400" />
                  <h3 className="mt-4 font-heading text-[22px] font-bold">{t("modal.successTitle")}</h3>
                  <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-slate-300">
                    {t("modal.successText", { ref })}
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setRef(""); setForm({ name: "", email: "", phone: "", telegram: "", message: "" }); }}
                    className="mt-6 text-[13.5px] font-semibold text-azure hover:underline"
                  >
                    {t("modal.another")}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <h3 className="font-heading text-[20px] font-bold">{t("modal.title")}</h3>

                  <Field icon={User} label={`${t("modal.name")} *`}>
                    <input
                      value={form.name} onChange={set("name")} placeholder={t("modal.namePh")}
                      className={inputCls}
                    />
                  </Field>

                  <div className="rounded-xl border border-white/10 bg-white/[.03] p-3.5">
                    <div className="mb-3 text-[12.5px] font-medium text-slate-400">
                      {t("modal.contactLabel")} <span className="text-emerald-400">*</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <IconInput icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="john@example.com" label={t("modal.email")} />
                      <IconInput icon={Phone} value={form.phone} onChange={set("phone")} placeholder="+998 90 123 45 67" label={t("modal.phone")} />
                      <IconInput icon={AtSign} value={form.telegram} onChange={set("telegram")} placeholder="@username" label={t("modal.telegram")} />
                    </div>
                  </div>

                  <Field icon={MessageCircle} label={`${t("modal.message")} *`}>
                    <textarea
                      value={form.message} onChange={set("message")} rows={3}
                      placeholder={t("modal.messagePh")}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  {/* Honeypot (botlar uchun yashirin) */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off"
                    className="hidden" value={form.website || ""} onChange={set("website")} />

                  {err && <div className="text-[13px] font-medium text-rose-400">{err}</div>}

                  <Button type="submit" variant="emerald" size="lg" className="mt-1 w-full"
                    disabled={status === "sending"}>
                    {status === "sending" ? t("modal.sending") : (<>{t("modal.submit")} <Send className="h-[17px] w-[17px]" /></>)}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[.04] px-3.5 py-2.5 pl-10 text-[14px] text-white outline-none transition-colors placeholder:text-slate-500 focus:border-azure focus:bg-white/[.07]";

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-slate-400">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-500" />
        {children}
      </div>
    </label>
  );
}

function IconInput({ icon: Icon, label, ...props }) {
  return (
    <div>
      <span className="mb-1 block text-[11.5px] text-slate-500">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-slate-500" />
        <input {...props} className={inputCls} />
      </div>
    </div>
  );
}
