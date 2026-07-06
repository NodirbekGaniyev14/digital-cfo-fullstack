import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArticleRow } from "@/components/ArticleCard";
import Seo from "@/lib/seo";
import { ARTICLES } from "@/data/articles";
import { articlesListJsonLd } from "@/lib/schema";

// /maqolalar — barcha maqolalar ro'yxati (blog bosh sahifasi).
export default function ArticlesIndex() {
  return (
    <div className="overflow-x-hidden bg-softbg dark:bg-[#070b16]">
      <Seo
        title="Maqolalar — moliyaviy tahlil bo'yicha qo'llanmalar"
        description="Moliyaviy tahlil, likvidlik, rentabellik, Altman Z-Score va 1C hisobotlari bo'yicha amaliy maqolalar — Digital CFO ekspertlaridan."
        canonical="/maqolalar"
        jsonLd={articlesListJsonLd(ARTICLES)}
      />
      <Navbar />

      <header className="hero-gradient px-6 pb-12 pt-32">
        <div className="mx-auto max-w-[820px] text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/60 px-4 py-1.5 text-[13px] font-semibold text-navy dark:border-white/10 dark:bg-white/[.05] dark:text-slate-200">
            <BookOpen className="h-4 w-4 text-emerald-500" /> Bilim bazasi
          </span>
          <h1 className="font-heading text-[32px] font-extrabold leading-tight tracking-tight text-navy dark:text-white sm:text-[42px]">
            Moliyaviy tahlil bo'yicha maqolalar
          </h1>
          <p className="mx-auto mt-4 max-w-[600px] text-[16px] leading-relaxed text-slate-500 dark:text-slate-400">
            Likvidlik, rentabellik, moliyaviy barqarorlik va bankrotlik xavfi —
            korxonangiz raqamlarini tushunishga yordam beradigan amaliy
            qo'llanmalar. Oddiy tilda, formulalar va misollar bilan.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[860px] px-4 pb-24 sm:px-6">
        {/* Bo'lim sarlavhasi — chap tomonda rangli aksent chizig'i (jch.uza.uz uslubi) */}
        <div className="mb-4 flex items-center gap-2.5">
          <span className="h-5 w-1.5 rounded-full bg-emerald-500" />
          <h2 className="font-heading text-[15px] font-bold uppercase tracking-wide text-navy dark:text-white">
            Barcha maqolalar
          </h2>
        </div>

        <div className="divide-y divide-navy/[.06] overflow-hidden rounded-2xl border border-navy/[.08] bg-white shadow-[0_2px_20px_rgba(15,23,42,.05)] dark:divide-white/[.06] dark:border-white/[.08] dark:bg-[#0d182b]">
          {ARTICLES.map((a) => (
            <ArticleRow key={a.slug} article={a} />
          ))}
        </div>

        <div className="mt-12 text-center text-[14px] text-slate-400">
          <Link to="/" className="font-semibold text-azure hover:underline">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
