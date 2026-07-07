import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0a0e1a" : "#0F172A");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((v) => !v)}
      className={`relative flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-navy/10 bg-white/60 text-navy backdrop-blur transition-colors hover:bg-navy/[.06] dark:border-white/10 dark:bg-white/[.06] dark:text-amber-300 ${className}`}
      aria-label="Mavzuni almashtirish"
      title={dark ? "Yorug' rejim" : "Tungi rejim"}
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          dark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          dark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
