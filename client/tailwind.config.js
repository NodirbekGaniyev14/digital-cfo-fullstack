/** @type {import('tailwindcss').Config} */
export default {
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
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
