import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  FileSpreadsheet,
  X,
  Download,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { analyzeFile } from "@/api/base44Client";
import { fadeUp, viewportOnce } from "@/lib/motion";

const ACCEPT = ".xlsx,.xls";
const MAX_SIZE = 15 * 1024 * 1024;

const ST = {
  good: { t: "text-emerald-700", b: "bg-emerald-500/12", label: "Yaxshi", ring: "#10B981" },
  warn: { t: "text-amber-700", b: "bg-amber-500/12", label: "Chegaraviy", ring: "#f59e0b" },
  bad: { t: "text-red-700", b: "bg-red-500/12", label: "Past", ring: "#ef4444" },
  na: { t: "text-slate-400", b: "bg-slate-400/10", label: "—", ring: "#94a3b8" },
};

function fmtVal(v, unit) {
  if (v === null || v === undefined) return "—";
  if (unit === "%") return `${v.toFixed(1)}%`;
  if (unit === "kun") return `${Math.round(v)} kun`;
  return v.toFixed(2);
}
function scoreColor(s) {
  if (s >= 75) return "#10B981";
  if (s >= 50) return "#3B82F6";
  if (s >= 30) return "#f59e0b";
  return "#ef4444";
}

export default function InstantAnalysis() {
  const [balans, setBalans] = useState(null);
  const [moliyaviy, setMoliyaviy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function pick(setter, f) {
    if (!f) return;
    if (!/\.(xlsx|xls)$/i.test(f.name)) return toast.error("Faqat .xlsx yoki .xls qabul qilinadi");
    if (f.size > MAX_SIZE) return toast.error("Fayl 15 MB dan oshmasligi kerak");
    setter(f);
    setResult(null);
  }

  async function run() {
    const files = [balans, moliyaviy].filter(Boolean);
    if (!files.length) return toast.error("Avval fayl(lar)ni tanlang");
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeFile(files);
      setResult(data);
      toast.success("Tahlil tayyor — natijalar quyida.");
    } catch (err) {
      toast.error(err.message || "Tahlil amalga oshmadi");
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf() {
    if (!result?.pdfBase64) return;
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${result.pdfBase64}`;
    a.download = `${(result.company || "moliyaviy-hisobot").slice(0, 50)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const score = result?.score ?? null;
  const groupKeys = result
    ? [...new Set(result.indicators.map((i) => i.group))]
    : [];
  const period = result
    ? [result.period_year, result.period_quarter && `${result.period_quarter}-chorak`]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <section
      id="tahlil"
      className="px-6 py-[90px]"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 0%, rgba(16,185,129,.1), transparent 60%), #F8FAFC",
      }}
    >
      <div className="mx-auto max-w-[960px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-9 max-w-[700px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-500">
            Bepul tahlil
          </div>
          <h2 className="mt-3 font-heading text-[clamp(28px,3.6vw,40px)] font-bold tracking-[-0.02em]">
            Faylingizni hoziroq sinab ko'ring
          </h2>
          <p className="mt-3.5 text-[16px] leading-relaxed text-slate-600">
            Shakl 1 (Balans) va Shakl 2 (Moliyaviy natijalar) ni yuklang —
            tizim ~50 ta ko'rsatkichni hisoblab, baholab, tayyor PDF hisobot
            beradi. Faylingiz serverda saqlanmaydi.
          </p>
        </motion.div>

        {/* Yuklash paneli */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="glass-card rounded-[22px] p-6 shadow-[0_10px_30px_rgba(15,23,42,.07)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FileDrop
              id="ia-balans"
              label="1. Balans (Shakl 1)"
              file={balans}
              onPick={(f) => pick(setBalans, f)}
              onClear={() => setBalans(null)}
            />
            <FileDrop
              id="ia-moliyaviy"
              label="2. Moliyaviy natijalar (Shakl 2)"
              file={moliyaviy}
              onPick={(f) => pick(setMoliyaviy, f)}
              onClear={() => setMoliyaviy(null)}
            />
          </div>
          <div className="mt-5 flex justify-center">
            <Button
              onClick={run}
              variant="emerald"
              size="lg"
              disabled={loading || (!balans && !moliyaviy)}
              className="min-w-[240px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-[18px] w-[18px] animate-spin" />
                  Tahlil qilinmoqda...
                </>
              ) : (
                "Tahlil qilish"
              )}
            </Button>
          </div>
        </motion.div>

        {/* Natijalar */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              {/* Scorecard */}
              <div className="mb-6 rounded-[22px] border border-navy/[.06] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,.06)]">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
                  <div className="relative flex h-[120px] w-[120px] flex-none items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke={scoreColor(score)}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 52}
                        strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-mono text-[30px] font-bold leading-none text-navy">
                        {score}
                      </span>
                      <span className="text-[11px] text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-heading text-[20px] font-bold">
                        {result.company || "Moliyaviy tahlil"}
                      </h3>
                    </div>
                    {period && (
                      <div className="mt-1 font-mono text-[12.5px] text-slate-400">
                        Davr: {period}
                        {result.stir ? ` · STIR: ${result.stir}` : ""}
                      </div>
                    )}
                    <div className="mt-2 inline-flex rounded-md bg-navy/[.05] px-3 py-1 text-[13px] font-semibold text-navy">
                      Umumiy baho: «{result.verdict}»
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <Cnt n={result.counts.good} t="Yaxshi" c="text-emerald-700 bg-emerald-500/12" />
                      <Cnt n={result.counts.warn} t="Chegaraviy" c="text-amber-700 bg-amber-500/12" />
                      <Cnt n={result.counts.bad} t="Past" c="text-red-700 bg-red-500/12" />
                    </div>
                  </div>
                  {result.pdfBase64 && (
                    <Button onClick={downloadPdf} variant="navy" size="lg" className="flex-none">
                      <Download className="h-[17px] w-[17px]" /> PDF hisobot
                    </Button>
                  )}
                </div>
                {!result.has_pl && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/[.06] p-3 text-[13px] text-amber-800">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                    Shakl 2 (Moliyaviy natijalar) topilmadi — rentabellik va o'sish
                    ko'rsatkichlari hisoblanmadi. To'liq tahlil uchun ikkala shaklni yuklang.
                  </div>
                )}
              </div>

              {/* Guruhlar bo'yicha ko'rsatkichlar */}
              {groupKeys.map((g) => (
                <div key={g} className="mb-5 overflow-hidden rounded-[18px] border border-navy/[.07] bg-white">
                  <div className="bg-navy px-5 py-3 font-heading text-[15px] font-bold text-white">
                    {result.groups[g]}
                  </div>
                  <div className="divide-y divide-navy/[.05]">
                    {result.indicators
                      .filter((i) => i.group === g)
                      .map((ind) => {
                        const s = ST[ind.status] || ST.na;
                        return (
                          <div
                            key={ind.code}
                            className="flex items-center gap-3 px-5 py-2.5 text-[13.5px]"
                          >
                            <span className="w-8 flex-none font-mono text-[12px] font-semibold text-slate-400">
                              {ind.code}
                            </span>
                            <span className="flex-1 text-slate-700">{ind.name}</span>
                            <span className="hidden w-[120px] flex-none text-right font-mono text-[12px] text-slate-400 sm:block">
                              {ind.norm}
                            </span>
                            <span className="w-[90px] flex-none text-right font-mono font-semibold text-navy">
                              {fmtVal(ind.value, ind.unit)}
                            </span>
                            <span
                              className={`w-[86px] flex-none rounded-md px-2 py-0.5 text-center text-[11.5px] font-semibold ${s.b} ${s.t}`}
                            >
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}

              <p className="mt-6 text-center text-[13px] text-slate-500">
                Bu — Telegram <span className="font-semibold">@Moliyaviy_Tahlilchi_bot</span> bilan
                bir xil to'liq tahlil. Savollar bo'lsa{" "}
                <a href="#contact" className="font-semibold text-azure hover:underline">
                  biz bilan bog'laning
                </a>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Cnt({ n, t, c }) {
  return (
    <span className={`rounded-md px-2.5 py-1 text-[12.5px] font-semibold ${c}`}>
      {t}: {n}
    </span>
  );
}

function FileDrop({ id, label, file, onPick, onClear }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-navy/15 bg-white/50 px-4 py-5 text-sm text-slate-500 transition-colors hover:border-azure hover:bg-azure/[.03]"
      >
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-azure/10 text-azure">
          <UploadCloud className="h-[20px] w-[20px]" />
        </span>
        {file ? (
          <span className="flex min-w-0 flex-1 items-center gap-2 font-semibold text-navy">
            <FileSpreadsheet className="h-[17px] w-[17px] flex-none text-emerald-500" />
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="ml-auto rounded-md p-1 text-slate-400 hover:bg-navy/[.06] hover:text-navy"
              aria-label="O'chirish"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        ) : (
          <span>Faylni tanlang (.xlsx, .xls)</span>
        )}
        <input
          id={id}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}
