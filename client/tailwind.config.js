/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette (Emerald #10B981 === Tailwind emerald-500, kept built-in)
        navy: { DEFAULT: "#0F172A", light: "#1E293B" },
        azure: "#3B82F6",
        softbg: "#F8FAFC",
      },
      fontFamily: {
        heading: ["'Inter Tight'", "system-ui", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(16,185,129,.45)" },
          "50%": { boxShadow: "0 0 0 14px rgba(16,185,129,0)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".35", transform: "scale(.8)" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.12)" },
          "66%": { transform: "translate(-30px,24px) scale(.92)" },
        },
        shimmer: {
          to: { backgroundPosition: "200% center" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
        aurora: "aurora 20s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "float-slow": "floatSlow 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
