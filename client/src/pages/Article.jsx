import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, ChevronRight, Send, Loader2, User } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ArticleCard, { ArticleCover } from "@/components/ArticleCard";
import Seo from "@/lib/seo";
import NotFound from "@/pages/NotFound";
import { formatDateUz, timeAgoUz, BOT_URL } from "@/data/articles";
import { articleJsonLd } from "@/lib/schema";
import { getArticle, getArticles } from "@/lib/api";

// Matndan (HTML) taxminiy o'qish vaqtini hisoblash (~200 so'z/daqiqa).
function readingMinutes(html) {
  const words = String(html || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// /article/:slug — bitta maqola. API'dan slug bo'yicha yuklanadi.
export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(undefined); // undefined=yuklanmoqda, null=topilmadi
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let alive = true;
    setArticle(undefined);
    window.scrollTo(0, 0);
    getArticle(slug)
      .then((a) => alive && setArticle(a || null))
      .catch(() => alive && setArticle(null));
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => {
    if (!article) return;
    let alive = true;
    getArticles()
      .then((list) => {
        if (!alive) return;
        const same = list.filter((x) => x.slug !== article.slug && x.category === article.category);
        const pool = same.length ? same : list.filter((x) => x.slug !== article.slug);
        setRelated(pool.slice(0, 3));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [article]);

  if (article === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-[#070b16]">
        <Navbar />
        <div className="flex flex-1 items-center justify-center text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      </div>
    );
  }
  if (article === null) return <NotFound />;

  const mins = readingMinutes(article.content);

  return (
    <div className="overflow-x-hidden bg-white dark:bg-[#070b16]">
      <Seo
        title={article.title}
        description={article.excerpt || article.title}
        canonical={`/blog/${article.slug}`}
        image={article.cover_image || undefined}
        type="article"
        jsonLd={articleJsonLd(article)}
      />
      <Navbar />

      <article className="px-6 pt-28">
        <div className="mx-auto max-w-[760px]">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-slate-400">
            <Link to="/" className="hover:text-azure">Bosh sahifa</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/blog" className="hover:text-azure">Maqolalar</Link>
            {article.category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-slate-500 dark:text-slate-300">{article.category}</span>
              </>
            )}
          </nav>

          <header className="mb-8">
            {article.category && (
              <span className="mb-4 inline-block rounded-full bg-azure/10 px-3 py-1 text-[13px] font-semibold text-azure">
                {article.category}
              </span>
            )}
            <h1 className="font-heading text-[30px] font-extrabold leading-tight tracking-tight text-navy dark:text-white sm:text-[40px]">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[13.5px] text-slate-400">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {article.author || "Digital CFO"}</span>
              <time dateTime={article.created_at}>{formatDateUz(article.created_at)}</time>
              <span>·</span>
              <span>{timeAgoUz(article.created_at)}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {mins} daqiqa o'qish</span>
            </div>
          </header>

          <ArticleCover
            article={article}
            className="mb-8 h-[180px] w-full rounded-2xl sm:h-[240px]"
            iconClassName="h-16 w-16 opacity-90"
          />

          {/* Maqola matni — serverda sanitizatsiya qilingan HTML */}
          <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Telegram CTA */}
          <div className="mt-14 rounded-2xl bg-navy px-7 py-8 text-center text-white">
            <h2 className="font-heading text-[22px] font-bold">Hisobotingizni tahlil qildiring</h2>
            <p className="mx-auto mt-2 max-w-[440px] text-[15px] text-slate-300">
              1C hisobotingizni yuboring — 50+ ko'rsatkich va tayyor PDF hisobotni
              bir necha daqiqada oling.
            </p>
            <a
              href={BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <Send className="h-[18px] w-[18px]" /> Telegram botga o'tish
            </a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20 border-t border-navy/[.06] bg-softbg px-6 py-16 dark:border-white/[.06] dark:bg-[#0a1020]">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="mb-8 font-heading text-[24px] font-bold text-navy dark:text-white">
              O'xshash maqolalar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
