import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Loader2, ChevronDown } from "lucide-react";
import { qualityScore } from "@/lib/api";

const LABELS = {
  content_quality: "Kontent sifati",
  seo: "SEO",
  originality: "Originallik",
  readability: "O'qish qulayligi",
  financial_accuracy: "Moliyaviy aniqlik",
  eeat: "EEAT",
  business_value: "Biznes qiymati",
  internal_linking: "Ichki bog'lanish",
  social_assets: "Social salohiyat",
  brand_voice: "Brend ovozi",
};

function totalColor(t) {
  if (t >= 90) return "text-emerald-500";
  if (t >= 75) return "text-amber-500";
  return "text-red-500";
}
function barColor(v) {
  if (v >= 9) return "bg-emerald-500";
  if (v >= 7) return "bg-amber-500";
  return "bg-red-500";
}

export default function QualityPanel({ articleId }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setBusy(true);
    try {
      const r = await qualityScore(articleId);
      setResult(r);
      setOpen(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/[.08] bg-white dark:border-white/[.08] dark:bg-[#141b2e]">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-2 px-5 py-3.5">
        <span className="inline-flex items-center gap-2 font-heading text-[15px] font-bold text-navy dark:text-white">
          <BadgeCheck className="h-[18px] w-[18px] text-azure" /> Sifat bahosi
          <span className="rounded-md bg-azure/10 px-1.5 py-0.5 text-[11px] font-semibold text-azure">Part 9</span>
          {result && <span className={`text-[13px] font-bold ${totalColor(result.total)}`}>{result.total}/100</span>}
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-navy/[.06] px-5 py-4 dark:border-white/[.06]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[13px] text-slate-500 dark:text-slate-400">DCOS 10 mezoni bo'yicha baho (0–100).</p>
            <button
              onClick={run}
              disabled={busy}
              className="flex flex-none items-center gap-1.5 rounded-xl bg-gradient-to-r from-azure to-emerald-500 px-3.5 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            >
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Baholanmoqda…</> : <><BadgeCheck className="h-4 w-4" /> {result ? "Qayta baholash" : "Baholash"}</>}
            </button>
          </div>

          {!result ? (
            <p className="py-3 text-center text-[13px] text-slate-400">Hali baholanmagan. "Baholash"ni bosing.</p>
          ) : (
            <>
              <div className="mb-3 flex items-baseline gap-2">
                <span className={`font-heading text-[26px] font-bold ${totalColor(result.total)}`}>{result.total}</span>
                <span className="text-[13px] text-slate-400">/100</span>
                {result.summary && <span className="ml-2 text-[12.5px] text-slate-500 dark:text-slate-400">{result.summary}</span>}
              </div>
              <div className="space-y-1.5">
                {Object.keys(LABELS).map((k) => {
                  const v = result.scores?.[k] ?? 0;
                  return (
                    <div key={k} className="flex items-center gap-2">
                      <span className="w-[130px] flex-none text-[12.5px] text-slate-600 dark:text-slate-300">{LABELS[k]}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy/[.06] dark:bg-white/[.08]">
                        <div className={`h-full rounded-full ${barColor(v)}`} style={{ width: `${v * 10}%` }} />
                      </div>
                      <span className="w-[28px] flex-none text-right text-[12px] font-semibold text-slate-500 dark:text-slate-400">{v}</span>
                    </div>
                  );
                })}
              </div>
              {result.weaknesses?.length > 0 && (
                <div className="mt-3 rounded-xl border border-amber-300/50 bg-amber-50 p-3 text-[12.5px] text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  <p className="mb-1 font-semibold">Zaif tomonlar:</p>
                  <ul className="list-disc space-y-0.5 pl-4">
                    {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
