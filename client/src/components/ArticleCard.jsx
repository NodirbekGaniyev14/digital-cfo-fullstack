import { Link } from "react-router-dom";
import {
  LineChart, Droplets, ShieldAlert, TrendingUp, Landmark, FileSpreadsheet,
  BookOpen, PieChart, Coins, Calculator, Percent, Wallet,
  Clock, ArrowRight,
} from "lucide-react";
import { timeAgoUz } from "@/data/articles";

// Ikonka kaliti (DB'dagi `icon`) → lucide komponenti.
const ICONS = {
  chart: LineChart, droplet: Droplets, shield: ShieldAlert, "trending-up": TrendingUp,
  bank: Landmark, file: FileSpreadsheet, book: BookOpen, pie: PieChart,
  coins: Coins, calculator: Calculator, percent: Percent, wallet: Wallet,
};

// Admin editor uchun ikonka variantlari.
export const ICON_OPTIONS = [
  { key: "chart", label: "Grafik" }, { key: "droplet", label: "Tomchi" },
  { key: "shield", label: "Qalqon" }, { key: "trending-up", label: "O'sish" },
  { key: "bank", label: "Bank" }, { key: "file", label: "Hujjat" },
  { key: "book", label: "Kitob" }, { key: "pie", label: "Doira diagramma" },
  { key: "coins", label: "Tangalar" }, { key: "calculator", label: "Kalkulyator" },
  { key: "percent", label: "Foiz" }, { key: "wallet", label: "Hamyon" },
];

// Rang kaliti (DB'dagi `icon_color`) → gradient. Server SSR bilan bir xil palitra.
const COLORS = {
  blue: ["#3b82f6", "#2563eb"], sky: ["#06b6d4", "#3b82f6"], red: ["#ef4444", "#f97316"],
  green: ["#10b981", "#14b8a6"], violet: ["#6366f1", "#8b5cf6"], amber: ["#f59e0b", "#ef4444"],
  teal: ["#14b8a6", "#0ea5e9"], slate: ["#64748b", "#334155"],
};
export const COLOR_OPTIONS = [
  { key: "blue", label: "Ko'k" }, { key: "sky", label: "Moviy" },
  { key: "red", label: "Qizil" }, { key: "green", label: "Yashil" },
  { key: "violet", label: "Binafsha" }, { key: "amber", label: "Sariq" },
  { key: "teal", label: "Feruza" }, { key: "slate", label: "Kulrang" },
];

export function ArticleIcon({ name, className }) {
  const Cmp = ICONS[name] || BookOpen;
  return <Cmp className={className} />;
}

// Maqola qopqog'i (thumbnail) — gradient fon + ikonka. cover_image bo'lsa — rasm.
export function ArticleCover({ article, className, iconClassName = "h-7 w-7" }) {
  if (article.cover_image) {
    return (
      <img
        src={article.cover_image}
        alt={article.title}
        loading="lazy"
        className={`object-cover ${className || ""}`}
      />
    );
  }
  const [from, to] = COLORS[article.icon_color] || COLORS.blue;
  return (
    <div
      className={`flex items-center justify-center text-white ${className || ""}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <ArticleIcon name={article.icon} className={iconClassName} />
    </div>
  );
}

// Gorizontal ro'yxat qatori (/maqolalar) — jch.uza.uz uslubi.
export function ArticleRow({ article }) {
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group flex items-center gap-4 px-3 py-4 transition-colors hover:bg-navy/[.03] sm:gap-5 sm:px-4 dark:hover:bg-white/[.03]"
    >
      <ArticleCover
        article={article}
        className="h-[76px] w-[104px] flex-none rounded-lg sm:h-[84px] sm:w-[120px]"
        iconClassName="h-8 w-8"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-[12.5px] text-slate-400">
          <span>{timeAgoUz(article.created_at)}</span>
          {article.category && (
            <>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="font-semibold text-azure">{article.category}</span>
            </>
          )}
        </div>
        <h3 className="line-clamp-2 font-heading text-[16px] font-bold leading-snug text-navy transition-colors group-hover:text-azure dark:text-white sm:text-[17.5px]">
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[14.5px]">
          {article.excerpt}
        </p>
      </div>
      <ArrowRight className="hidden h-5 w-5 flex-none text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-azure sm:block" />
    </Link>
  );
}

// Grid kartasi (rasm banneri bilan) — "O'xshash maqolalar" bloki uchun.
export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/[.08] bg-white shadow-[0_2px_16px_rgba(15,23,42,.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,.12)] dark:border-white/[.08] dark:bg-[#0d182b]"
    >
      <ArticleCover article={article} className="h-[120px] w-full" iconClassName="h-9 w-9" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[12.5px] text-slate-400">
          <span>{timeAgoUz(article.created_at)}</span>
          {article.category && <><span>·</span><span className="font-semibold text-azure">{article.category}</span></>}
        </div>
        <h3 className="mb-2 line-clamp-2 font-heading text-[17px] font-bold leading-snug text-navy transition-colors group-hover:text-azure dark:text-white">
          {article.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
