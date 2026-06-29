import { motion } from "framer-motion";
import { BarChart3, CircleCheckBig, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, viewportOnce } from "@/lib/motion";

// Sample report lives in /public and is served statically.
const SAMPLE_PDF = "/Namuna_Moliyaviy_Hisobot.pdf";

const REPORT_ITEMS = [
  "Boshqaruv xulosasi (Executive Summary)",
  "Asosiy KPI ko'rsatkichlari jadvali",
  "Likvidlik va to'lov qobiliyati tahlili",
  "Rentabellik va foyda dinamikasi",
  "Risk diagnostikasi va baholash",
  "AI tavsiyalari va xulosalar",
];

// PDF'ni ishonchli yuklab olish: blob orqali (brauzer inline ochib qo'ymasligi uchun).
async function downloadSample() {
  try {
    const res = await fetch(SAMPLE_PDF);
    if (!res.ok) throw new Error("not found");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Namuna_Moliyaviy_Hisobot.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    window.open(SAMPLE_PDF, "_blank", "noopener"); // zaxira yo'l
  }
}

export default function PDFReport() {
  return (
    <section id="pdf-report" className="bg-white px-6 py-[90px]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        {/* Document mockup */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl border border-navy/10 bg-white p-[30px] shadow-[0_30px_60px_rgba(15,23,42,.14)]">
            <div className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] whitespace-nowrap font-heading text-[54px] font-extrabold tracking-[0.05em] text-navy/[.05]">
              SAMPLE REPORT
            </div>
            <div className="mb-[18px] flex items-center justify-between border-b border-navy/[.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-navy text-emerald-500">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="font-heading text-[15px] font-bold">Digital CFO</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">2026-06-21</span>
            </div>
            <h4 className="mb-3.5 font-heading text-[18px] font-bold">
              Moliyaviy Tahlil Hisoboti
            </h4>
            <div className="mb-5 flex flex-col gap-2">
              {["100%", "88%", "94%", "70%"].map((w, i) => (
                <div key={i} className="h-[9px] rounded-[5px] bg-navy/[.07]" style={{ width: w }} />
              ))}
            </div>
            <div className="mb-[18px] grid grid-cols-3 gap-2.5">
              <div className="rounded-[11px] bg-azure/[.07] p-[13px]">
                <div className="text-[11px] text-slate-500">Likvidlik</div>
                <div className="font-mono text-[20px] font-bold text-azure">2.41</div>
              </div>
              <div className="rounded-[11px] bg-emerald-500/[.08] p-[13px]">
                <div className="text-[11px] text-slate-500">Foyda</div>
                <div className="font-mono text-[20px] font-bold text-emerald-500">18.5%</div>
              </div>
              <div className="rounded-[11px] bg-navy/5 p-[13px]">
                <div className="text-[11px] text-slate-500">Risk</div>
                <div className="font-mono text-[20px] font-bold text-navy">23</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-md bg-navy/[.07]">
                <div className="h-full w-[23%] rounded-md bg-gradient-to-r from-emerald-500 to-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-500">Past risk</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-azure">
            PDF Hisobot
          </div>
          <h2 className="mb-2.5 mt-3 font-heading text-[clamp(28px,3.6vw,40px)] font-bold tracking-[-0.02em]">
            Professional hisobot tarkibi
          </h2>
          <p className="mb-6 text-[16px] leading-relaxed text-slate-600">
            Har bir hisobot tahlilchi tomonidan tayyorlangandek aniq va to'liq —
            bir tugma bilan yuklab oling.
          </p>
          <div className="mb-7 flex flex-col gap-3">
            {REPORT_ITEMS.map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-3 rounded-xl bg-navy/[.025] px-4 py-3"
              >
                <span className="w-[22px] font-mono text-xs font-semibold text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <CircleCheckBig className="h-[19px] w-[19px] flex-none text-emerald-500" />
                <span className="text-[15px] font-medium">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="navy" size="lg">
              <a href={SAMPLE_PDF} target="_blank" rel="noreferrer">
                <FileSpreadsheetIcon /> Namuna ko'rish
              </a>
            </Button>
            <Button variant="emerald-outline" size="lg" onClick={downloadSample}>
              <Download className="h-[17px] w-[17px]" /> Namunani yuklab olish
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// tiny inline wrapper so the import list stays tidy
function FileSpreadsheetIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M8 13h2m-2 4h2m4-4h2m-2 4h2" />
    </svg>
  );
}
