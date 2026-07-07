import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { subscribe } from "@/lib/api";

// Newsletter obuna formasi — email yig'adi (lead capture).
export default function NewsletterForm({ source = "article", compact = false }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      await subscribe(email.trim(), source);
      setState("done");
      setEmail("");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  };

  if (state === "done") {
    return (
      <div className={`flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ${compact ? "px-4 py-3 text-[14px]" : "px-6 py-6"}`}>
        <Check className="h-5 w-5" /> Obuna bo'ldingiz! Rahmat.
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-navy/[.08] bg-white dark:border-white/[.08] dark:bg-[#0d182b] ${compact ? "p-5" : "p-6 sm:p-7"}`}>
      {!compact && (
        <>
          <div className="mb-1 flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-500" />
            <h3 className="font-heading text-[18px] font-bold text-navy dark:text-white">Yangiliklardan xabardor bo'ling</h3>
          </div>
          <p className="mb-4 text-[14px] text-slate-500 dark:text-slate-400">
            Yangi maqolalar va moliyaviy maslahatlarni pochtangizga olib turing.
          </p>
        </>
      )}
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        {/* Honeypot (botlar uchun) */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@misol.uz"
          className="flex-1 rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[15px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Obuna bo'lish"}
        </button>
      </form>
      {state === "error" && <p className="mt-2 text-[13px] text-red-500">Xatolik. Qayta urinib ko'ring.</p>}
    </div>
  );
}
