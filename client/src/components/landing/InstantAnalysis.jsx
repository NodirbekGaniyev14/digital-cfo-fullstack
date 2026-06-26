import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { analyzeFile } from "@/api/base44Client";
import { fadeUp, viewportOnce } from "@/lib/motion";

const ACCEPT = ".xlsx,.xls,.csv";
const MAX_SIZE = 15 * 1024 * 1024;

const TONE = {
  good: { text: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/30", badge: "YAXSHI", Icon: TrendingUp },
  warn: { text: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/30", badge: "DIQQAT", Icon: Minus },
  bad: { text: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/30", badge: "PAST", Icon: TrendingDown },
};

function scoreColor(s) {
  if (s >= 75) return "#10B981";
  if (s >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function InstantAnalysis() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function pick(f) {
    if (!f) return;
    const okExt = /\.(xlsx|xls|csv)$/i.test(f.name);
    if (!okExt) return toast.error("Faqat .xlsx, .xls yoki .csv qabul qilinadi");
    if (f.size > MAX_SIZE) return toast.error("Fayl hajmi 15 MB dan oshmasligi kerak");
    setFile(f);
    setResult(null);
  }

  async function run() {
    if (!file) return toast.error("Avval fayl tanlang");
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeFile(file);
      setResult(data);
      if (data.kpis?.length)
        toast.success("Tahlil tayyor — natijalar quyida.");
      else
        toast.message("Fayl o'qildi, lekin ko'rsatkichlar aniqlanmadi.");
    } catch (err) {
      toast.error(err.message || "Tahlil amalga oshmadi");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const score = result?.healthScore ?? null;

  return (
    <section
      id="tahlil"
      className="px-6 py-[90px]"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 0%, rgba(16,185,129,.1), transparent 60%), #F8FAFC",
      }}
    >
      <div className="mx-auto max-w-[900px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-9 max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-500">
            Bepul tahlil
          </div>
          <h2 className="mt-3 font-heading text-[clamp(28px,3.6vw,40px)] font-bold tracking-[-0.02em]">
            Faylingizni hoziroq sinab ko'ring
          </h2>
          <p className="mt-3.5 text-[16px] leading-relaxed text-slate-600">
            Excel yoki CSV moliyaviy faylingizni yuklang — tizim KPI'larni
            real vaqtda hisoblab beradi. Faylingiz serverda saqlanmaydi.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="glass-card rounded-[22px] p-6 shadow-[0_10px_30px_rgba(15,23,42,.07)] sm:p-8"
        >
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pick(e.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              drag
                ? "border-emerald-500 bg-emerald-500/[.05]"
                : "border-navy/15 bg-white/50 hover:border-azure hover:bg-azure/[.03]"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-azure/10 text-azure">
              <UploadCloud className="h-7 w-7" />
            </div>
            {file ? (
              <div className="flex items-center gap-2 text-[15px] font-semibold text-navy">
                <FileSpreadsheet className="h-[18px] w-[18px] text-emerald-500" />
                {file.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="ml-1 rounded-md p-1 text-slate-400 hover:bg-navy/[.06] hover:text-navy"
                  aria-label="O'chirish"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="text-[15px] font-semibold text-navy">
                  Faylni shu yerga tashlang yoki tanlang
                </div>
                <div className="text-[13px] text-slate-500">
                  .xlsx, .xls yoki .csv — maks 15 MB
                </div>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>

          <div className="mt-5 flex justify-center">
            <Button
              onClick={run}
              variant="emerald"
              size="lg"
              disabled={loading || !file}
              className="min-w-[220px]"
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

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              {score != null && (
                <div className="mb-6 flex flex-col items-center gap-4 rounded-[22px] border border-navy/[.06] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,.06)] sm:flex-row sm:gap-7">
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
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-heading text-[20px] font-bold">
                        Moliyaviy salomatlik
                      </h3>
                    </div>
                    <p className="mt-1.5 text-[14.5px] text-slate-600">
                      {score >= 75
                        ? "Umumiy holat barqaror — asosiy ko'rsatkichlar me'yorda."
                        : score >= 50
                        ? "Holat o'rtacha — ba'zi ko'rsatkichlarga e'tibor bering."
                        : "Diqqat talab qiladi — bir nechta ko'rsatkich past."}
                    </p>
                    <div className="mt-2 font-mono text-[12px] text-slate-400">
                      Fayl: {result.file} · {result.kpis.length} ta KPI hisoblandi
                    </div>
                  </div>
                </div>
              )}

              {result.kpis?.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {result.kpis.map((k) => {
                    const t = TONE[k.tone] || TONE.warn;
                    return (
                      <div
                        key={k.key}
                        className={`rounded-[18px] border bg-white p-5 shadow-[0_6px_16px_rgba(15,23,42,.05)] ${t.border}`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <span className="text-[13px] font-medium leading-snug text-slate-600">
                            {k.label}
                          </span>
                          <span className={`flex-none rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold ${t.bg} ${t.text}`}>
                            {t.badge}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="font-mono text-[28px] font-bold leading-none text-navy">
                            {k.value}
                            <span className="ml-0.5 text-[16px] text-slate-400">
                              {k.unit}
                            </span>
                          </span>
                          <t.Icon className={`h-[20px] w-[20px] ${t.text}`} />
                        </div>
                        <p className="mt-3 text-[12.5px] leading-snug text-slate-500">
                          {k.note}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {result.warnings?.length > 0 && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[.06] p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-500" />
                  <div className="text-[14px] leading-relaxed text-amber-800">
                    {result.warnings.map((w, i) => (
                      <p key={i}>{w}</p>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-6 text-center text-[13px] text-slate-500">
                To'liq CFO darajasidagi PDF hisobot uchun{" "}
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
