import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play } from "lucide-react";
import { useApp } from "@/lib/i18n";

const DEMO_VIDEO = "/demo.mp4";

/**
 * DemoVideoModal — "Demo ko'rish" bosilganda demo videoni sayt ichida
 * ko'rsatadi (mijoz sahifadan chiqmaydi). Modal ochilganda video avtomatik
 * ijro etiladi; yopilganda AnimatePresence videoni DOM'dan olib tashlaydi.
 */
export default function DemoVideoModal({ open, onClose }) {
  const { t } = useApp();

  // Esc bilan yopish
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-0 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full flex-col overflow-hidden bg-navy shadow-2xl sm:max-w-[440px] sm:rounded-2xl"
          >
            {/* Sarlavha */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-navy px-4 py-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-emerald-500/15 text-emerald-400">
                <Play className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-heading text-[15px] font-bold text-white">
                  {t("demo.videoTitle")}
                </div>
                <div className="text-[11.5px] text-slate-400">
                  {t("demo.videoSub")}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label={t("demo.close")}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video maydoni — vertikal video, buzilishsiz markazda */}
            <div className="flex justify-center bg-black">
              <video
                src={DEMO_VIDEO}
                className="block max-h-[78vh] w-auto max-w-full"
                controls
                autoPlay
                playsInline
                preload="metadata"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
