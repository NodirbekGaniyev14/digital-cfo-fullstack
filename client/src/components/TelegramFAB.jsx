import { useEffect, useState } from "react";
import { Send } from "lucide-react";

// Sahifa biroz aylantirilgach paydo bo'ladigan suzuvchi Telegram tugmasi.
export default function TelegramFAB() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://t.me/Moliyaviy_Tahlilchi_bot"
      target="_blank"
      rel="noreferrer"
      aria-label="Telegram bot"
      className={`group fixed bottom-[88px] right-5 z-[250] flex items-center gap-2.5 rounded-full bg-azure px-4 py-3.5 text-white shadow-[0_14px_34px_rgba(59,130,246,.5)] transition-all duration-300 hover:scale-105 ${
        show ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full pulse-glow" />
      <Send className="h-5 w-5 flex-none" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
        Telegram bot
      </span>
    </a>
  );
}
