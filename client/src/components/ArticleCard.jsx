import { Link } from "react-router-dom";
import {
  LineChart, Droplets, ShieldAlert, TrendingUp, Landmark,
  FileSpreadsheet, Clock, ArrowRight, BookOpen,
} from "lucide-react";
import { formatDateUz } from "@/data/articles";

// Maqola ikonkasi (data'dagi `icon` matni → lucide komponenti).
const ICONS = {
  LineChart, Droplets, ShieldAlert, TrendingUp, Landmark, FileSpreadsheet,
};

export function ArticleIcon({ name, className }) {
  const Cmp = ICONS[name] || BookOpen;
  return <Cmp className={className} />;
}

// Ro'yxat va "o'xshash maqolalar" bloklarida ishlatiladigan karta.
export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-navy/[.08] bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,.12)] dark:border-white/[.08] dark:bg-[#0d182b]"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-navy text-emerald-400">
          <ArticleIcon name={article.icon} className="h-[22px] w-[22px]" />
        </div>
        <span className="rounded-full bg-azure/10 px-3 py-1 text-[12.5px] font-semibold text-azure">
          {article.category}
        </span>
      </div>

      <h3 className="mb-2 font-heading text-[18px] font-bold leading-snug text-navy transition-colors group-hover:text-azure dark:text-white">
        {article.title}
      </h3>
      <p className="mb-5 flex-1 text-[14.5px] leading-relaxed text-slate-500 dark:text-slate-400">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between text-[13px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {article.readingMinutes} daqiqa
        </span>
        <span className="flex items-center gap-1 font-semibold text-azure opacity-0 transition-opacity group-hover:opacity-100">
          O'qish <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
