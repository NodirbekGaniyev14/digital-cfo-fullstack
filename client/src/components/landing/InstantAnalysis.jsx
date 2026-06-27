import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  FileSpreadsheet,
  X,
  ShieldCheck,
  AlertTriangle,
  Send,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { analyzeFile } from "@/api/base44Client";
import { fadeUp, viewportOnce } from "@/lib/motion";

const ACCEPT = ".xlsx,.xls";
const MAX_SIZE = 15 * 1024 * 1024;
const FREE_KEY = "cfo_free_used"; // saytda bir marta bepul tahlil
const BOT_URL = "https://t.me/Moliyaviy_Tahlilchi_bot";

const ST = {
  good: { t: "text-emerald-700", b: "bg-emerald-500/12", label: "Yaxshi" },
  warn: { t: "text-amber-700", b: "bg-amber-500/12", label: "Chegaraviy" },
  bad: { t: "text-red-700", b: "bg-red-500/12", label: "Past" },
  na: { t: "text-slate-400", b: "bg-slate-400/10", label: "—" },
};

const LOCKED_NAMES = [
  "Tezkor likvidlik",
  "Avtonomiya koeffitsienti",
  "Sof rentabellik (ROS)",
  "Aktivlar aylanuvchanligi",
  "Debitorlik aylanishi (kun)",
  "Sotuv o'sish sur'ati",
];

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
  const [used, setUsed] = useState(() => {
    try {
      return !!localStorage.getItem(FREE_KEY);
    } catch {
      return false;
    }
  });

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
      try {
        localStorage.setItem(FREE_KEY, String(Date.now()));
      } catch {}
      setUsed(true);
      toast.success("Asosiy ko'rsatkichlar tayyor!");
    } catch (err) {
      toast.error(err.message || "Tahlil amalga oshmadi");
    } finally {
      setLoading(false);
    }
  }

  const score = result?.score ?? null;
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
      <div className="mx-auto max-w-[820px]">
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
            Balans va Moliyaviy hisobotni yuklang — umumiy ball va{" "}
            <span className="font-semibold text-navy">5 ta asosiy ko'rsatkich</span> bepul
            ko'rinadi. To'liq tahlil (~50 ko'rsatkich + PDF hisobot) Telegram botda.
            <span className="block text-emerald-600">Saytda bir marta bepul · faylingiz saqlanmaydi.</span>
          </p>
        </motion.div>

        {/* Yuklash paneli — faqat ishlatilmagan bo'lsa */}
        {!used && (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="glass-card rounded-[22px] p-6 shadow-[0_10px_30px_rgba(15,23,42,.07)] sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FileDrop id="ia-balans" label="1. Balans (Shakl 1)" file={balans}
                onPick={(f) => pick(setBalans, f)} onClear={() => setBalans(null)} />
              <FileDrop id="ia-moliyaviy" label="2. Moliyaviy natijalar (Shakl 2)" file={moliyaviy}
                onPick={(f) => pick(setMoliyaviy, f)} onClear={() => setMoliyaviy(null)} />
            </div>
            <div className="mt-5 flex justify-center">
              <Button onClick={run} variant="emerald" size="lg"
                disabled={loading || (!balans && !moliyaviy)} className="min-w-[240px]">
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
        )}

        {/* Bepul limit tugagan va natija yo'q — botga taklif */}
        {used && !result && (
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <BotCTA
              heading="Bepul tahlildan foydalandingiz"
              text="Saytdagi bepul tahlil bir martalik. Cheksiz tahlil, barcha ~50 ko'rsatkich va to'liq PDF hisobotlar uchun Telegram botimizdan foydalaning."
            />
          </motion.div>
        )}

        {/* Natijalar — teaser */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              {/* Scorecard */}
              <div className="mb-5 rounded-[22px] border border-navy/[.06] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,.06)]">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
                  <div className="relative flex h-[120px] w-[120px] flex-none items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(score)}
                        strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 52}
                        strokeDashoffset={2 * Math.PI * 52 * (1 - score / 100)} />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-mono text-[30px] font-bold leading-none text-navy">{score}</span>
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
                </div>
              </div>

              {/* 5 ta asosiy ko'rsatkich (ochiq) */}
              <div className="overflow-hidden rounded-[18px] border border-navy/[.07] bg-white">
                <div className="flex items-center justify-between bg-navy px-5 py-3">
                  <span className="font-heading text-[15px] font-bold text-white">
                    Asosiy ko'rsatkichlar
                  </span>
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-300">
                    {result.highlights?.length || 0} / {result.total} ochiq
                  </span>
                </div>
                <div className="divide-y divide-navy/[.05]">
                  {(result.highlights || []).map((ind) => {
                    const s = ST[ind.status] || ST.na;
                    return (
                      <div key={ind.code} className="flex items-center gap-3 px-5 py-3 text-[13.5px]">
                        <span className="w-8 flex-none font-mono text-[12px] font-semibold text-slate-400">
                          {ind.code}
                        </span>
                        <span className="flex-1 text-slate-700">{ind.name}</span>
                        <span className="w-[90px] flex-none text-right font-mono font-semibold text-navy">
                          {fmtVal(ind.value, ind.unit)}
                        </span>
                        <span className={`w-[86px] flex-none rounded-md px-2 py-0.5 text-center text-[11.5px] font-semibold ${s.b} ${s.t}`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yopiq qism — botga taklif */}
              {result.locked > 0 && (
                <div className="relative mt-5 overflow-hidden rounded-[18px] border border-navy/[.08] bg-white">
                  <div aria-hidden className="pointer-events-none select-none blur-[6px]">
                    {LOCKED_NAMES.map((n, i) => (
                      <div key={i} className={`flex items-center gap-3 px-5 py-3 text-[13.5px] ${i % 2 ? "bg-navy/[.02]" : ""}`}>
                        <span className="w-8 font-mono text-[12px] text-slate-400">··</span>
                        <span className="flex-1 text-slate-600">{n}</span>
                        <span className="w-[90px] text-right font-mono font-semibold text-navy">··.·</span>
                        <span className="w-[86px] rounded-md bg-slate-400/20 py-0.5 text-center text-[11.5px]">·····</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/50 px-6 text-center backdrop-blur-[2px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy/[.06] text-navy">
                      <Lock className="h-6 w-6" />
                    </div>
                    <p className="font-heading text-[17px] font-bold">
                      Yana {result.locked} ta ko'rsatkich yopiq
                    </p>
                    <p className="max-w-[480px] text-[13.5px] leading-relaxed text-slate-600">
                      Likvidlik, barqarorlik, rentabellik, aylanuvchanlik va o'sishning
                      barcha ko'rsatkichlari, pul oqimi tahlili, xulosa-tavsiyalar va
                      <span className="font-semibold"> to'liq PDF hisobot</span> — Telegram botda.
                    </p>
                    <Button asChild variant="navy" size="lg">
                      <a href={BOT_URL} target="_blank" rel="noreferrer">
                        <Send className="h-[17px] w-[17px]" /> Telegram botda to'liq ko'rish
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {!result.has_pl && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/[.06] p-3 text-[13px] text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                  Shakl 2 (Moliyaviy natijalar) topilmadi — ba'zi ko'rsatkichlar hisoblanmadi.
                  To'liq tahlil uchun ikkala shaklni yuklang.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function BotCTA({ heading, text }) {
  return (
    <div className="rounded-[22px] border border-azure/25 bg-gradient-to-b from-azure/[.06] to-emerald-500/[.04] p-7 text-center shadow-[0_8px_24px_rgba(15,23,42,.06)]">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-azure/[.12] text-azure">
        <Send className="h-7 w-7" />
      </div>
      <h3 className="font-heading text-[20px] font-bold">{heading}</h3>
      <p className="mx-auto mt-2 max-w-[540px] text-[14.5px] leading-relaxed text-slate-600">{text}</p>
      <div className="mt-5 flex justify-center">
        <Button asChild variant="navy" size="lg">
          <a href={BOT_URL} target="_blank" rel="noreferrer">
            <Send className="h-[17px] w-[17px]" /> Telegram botga o'tish
          </a>
        </Button>
      </div>
    </div>
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
        <input id={id} type="file" accept={ACCEPT} className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])} />
      </label>
    </div>
  );
}
