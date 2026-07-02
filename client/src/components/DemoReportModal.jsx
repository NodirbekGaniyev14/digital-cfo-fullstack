import { AnimatePresence, motion } from "framer-motion";
import { X, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/i18n";

const SAMPLE_PDF = "/Namuna_Moliyaviy_Hisobot.pdf";

// PDF'ni ishonchli yuklab olish (brauzer inline ochib qo'ymasligi uchun blob).
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
    window.open(SAMPLE_PDF, "_blank", "noopener");
  }
}

/**
 * DemoReportModal — "Demo ko'rish" bosilganda namunaviy PDF hisobotni sayt
 * ichida ko'rsatadi (mijoz sahifadan chiqmaydi). Brauzer PDF'ni inline
 * ko'rsata olmasa (ba'zi mobil brauzerlar) — <object> fallback'i orqali
 * yuklab olish taklif qilinadi.
 */
export default function DemoReportModal({ open, onClose }) {
  const { t } = useApp();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-navy sm:h-[88vh] sm:max-w-[900px] sm:rounded-2xl"
          >
            {/* Sarlavha */}
            <div className="flex items-center gap-3 border-b border-navy/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-navy">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-navy text-emerald-500">
                <FileText className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-heading text-[15px] font-bold">
                  {t("demo.title")}
                </div>
                <div className="text-[11.5px] text-slate-500">Digital CFO · PDF</div>
              </div>
              <Button variant="emerald-outline" size="sm" onClick={downloadSample}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t("pdf.download")}</span>
              </Button>
              <button
                onClick={onClose}
                aria-label={t("demo.close")}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-navy/[.06] hover:text-navy dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* PDF ko'rish maydoni */}
            <div className="flex-1 bg-slate-100 dark:bg-[#0b1424]">
              <object
                data={`${SAMPLE_PDF}#view=FitH`}
                type="application/pdf"
                className="h-full w-full"
              >
                {/* Brauzer PDF'ni ichida ko'rsata olmasa (ko'p mobil brauzerlar) */}
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                  <FileText className="h-14 w-14 text-slate-400" />
                  <p className="max-w-[320px] text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {t("demo.fallback")}
                  </p>
                  <Button variant="emerald" size="lg" onClick={downloadSample}>
                    <Download className="h-[17px] w-[17px]" /> {t("pdf.download")}
                  </Button>
                </div>
              </object>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
