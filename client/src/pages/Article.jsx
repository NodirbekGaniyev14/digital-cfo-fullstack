import { useParams, Link } from "react-router-dom";
import { Clock, ChevronRight, Send } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ArticleCard, { ArticleIcon } from "@/components/ArticleCard";
import Seo from "@/lib/seo";
import NotFound from "@/pages/NotFound";
import { ARTICLES, getArticle, formatDateUz, BOT_URL } from "@/data/articles";
import { articleJsonLd } from "@/lib/schema";

// /article/:slug — bitta maqola sahifasi.
export default function Article() {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) return <NotFound />;

  const related = (article.relatedSlugs || [])
    .map((s) => getArticle(s))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="overflow-x-hidden bg-white dark:bg-[#070b16]">
      <Seo
        title={article.title}
        description={article.description}
        canonical={`/article/${article.slug}`}
        type="article"
        jsonLd={articleJsonLd(article)}
      />
      <Navbar />

      <article className="px-6 pt-28">
        <div className="mx-auto max-w-[760px]">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-slate-400"
          >
            <Link to="/" className="hover:text-azure">Bosh sahifa</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/maqolalar" className="hover:text-azure">Maqolalar</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-500 dark:text-slate-300">{article.category}</span>
          </nav>

          <header className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-navy text-emerald-400">
                <ArticleIcon name={article.icon} className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-azure/10 px-3 py-1 text-[13px] font-semibold text-azure">
                {article.category}
              </span>
            </div>
            <h1 className="font-heading text-[30px] font-extrabold leading-tight tracking-tight text-navy dark:text-white sm:text-[40px]">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[13.5px] text-slate-400">
              <time dateTime={article.datePublished}>{formatDateUz(article.datePublished)}</time>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {article.readingMinutes} daqiqa o'qish
              </span>
            </div>
          </header>

          {/* Maqola matni (SEO uchun HTML) */}
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* FAQ */}
          {article.faq?.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 font-heading text-[24px] font-bold text-navy dark:text-white">
                Ko'p so'raladigan savollar
              </h2>
              <div className="flex flex-col gap-3">
                {article.faq.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-xl border border-navy/[.08] bg-softbg/60 px-5 py-4 dark:border-white/[.08] dark:bg-white/[.03]"
                  >
                    <summary className="cursor-pointer list-none font-heading text-[16px] font-semibold text-navy marker:hidden dark:text-white">
                      {f.q}
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

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

      {/* O'xshash maqolalar */}
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
