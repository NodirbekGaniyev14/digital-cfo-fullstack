import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Loader2, Search, Clock, Flame, X } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArticleRow } from "@/components/ArticleCard";
import Seo from "@/lib/seo";
import { getArticles } from "@/lib/api";
import { articlesListJsonLd } from "@/lib/schema";

// /blog — barcha (published) maqolalar ro'yxati. Qidiruv + saralash bilan.
export default function ArticlesIndex() {
  const [articles, setArticles] = useState(null); // null=yuklanmoqda
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new"); // new | popular
  const [params, setParams] = useSearchParams();
  const tag = params.get("tag") || "";

  useEffect(() => {
    let alive = true;
    getArticles()
      .then((list) => alive && setArticles(list))
      .catch(() => alive && setArticles([]));
    return () => { alive = false; };
  }, []);

  const shown = useMemo(() => {
    if (!articles) return [];
    const q = query.trim().toLowerCase();
    let list = articles;
    if (tag) list = list.filter((a) => (a.tag_slugs || []).includes(tag));
    if (q) {
      list = list.filter((a) =>
        `${a.title} ${a.excerpt} ${a.category} ${a.author}`.toLowerCase().includes(q)
      );
    }
    // Tanlangan (featured) doim tepada; keyin saralash mezoni bo'yicha.
    return [...list].sort((a, b) => {
      if ((b.is_featured || 0) !== (a.is_featured || 0)) return (b.is_featured || 0) - (a.is_featured || 0);
      if (sort === "popular") return (b.views || 0) - (a.views || 0);
      return new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at);
    });
  }, [articles, query, sort, tag]);

  return (
    <div className="overflow-x-hidden bg-softbg dark:bg-[#070b16]">
      <Seo
        title="Maqolalar — moliyaviy tahlil bo'yicha qo'llanmalar"
        description="Moliyaviy tahlil, likvidlik, rentabellik, Altman Z-Score va 1C hisobotlari bo'yicha amaliy maqolalar — Digital CFO ekspertlaridan."
        canonical="/blog"
        jsonLd={articles ? articlesListJsonLd(articles) : null}
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
        {tag && (
          <div className="mb-4 flex items-center gap-2 text-[14px] text-slate-500 dark:text-slate-400">
            <span>Teg bo'yicha:</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-azure/10 px-3 py-1 font-semibold text-azure">
              #{tag}
              <button onClick={() => setParams({})} className="hover:text-navy dark:hover:text-white"><X className="h-3.5 w-3.5" /></button>
            </span>
          </div>
        )}
        {/* Qidiruv + saralash */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-[360px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Maqola qidirish…"
              className="w-full rounded-xl border border-navy/10 bg-white py-2.5 pl-10 pr-4 text-[14.5px] outline-none focus:border-azure dark:border-white/10 dark:bg-[#0d182b] dark:text-white"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-navy/10 bg-white p-1 dark:border-white/10 dark:bg-[#0d182b]">
            <SortBtn active={sort === "new"} onClick={() => setSort("new")} icon={Clock}>Yangi</SortBtn>
            <SortBtn active={sort === "popular"} onClick={() => setSort("popular")} icon={Flame}>Ommabop</SortBtn>
          </div>
        </div>

        {articles === null ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : shown.length === 0 ? (
          <div className="rounded-2xl border border-navy/[.08] bg-white p-12 text-center text-slate-500 dark:border-white/[.08] dark:bg-[#0d182b] dark:text-slate-400">
            {query ? `"${query}" bo'yicha hech narsa topilmadi.` : "Hozircha maqolalar yo'q."}
          </div>
        ) : (
          <div className="divide-y divide-navy/[.06] overflow-hidden rounded-2xl border border-navy/[.08] bg-white shadow-[0_2px_20px_rgba(15,23,42,.05)] dark:divide-white/[.06] dark:border-white/[.08] dark:bg-[#0d182b]">
            {shown.map((a) => (
              <ArticleRow key={a.slug} article={a} />
            ))}
          </div>
        )}

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

function SortBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13.5px] font-semibold transition-colors ${
        active ? "bg-navy text-white" : "text-slate-500 hover:text-navy dark:text-slate-300 dark:hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
  );
}
