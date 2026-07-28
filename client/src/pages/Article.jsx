import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, ChevronRight, Send, Loader2, User, Download } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ArticleCard, { ArticleCover } from "@/components/ArticleCard";
import ShareButtons from "@/components/ShareButtons";
import TableOfContents from "@/components/TableOfContents";
import NewsletterForm from "@/components/NewsletterForm";
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

function slugifyHeading(s, i) {
  const base = String(s || "").toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return `${base || "bolim"}-${i}`;
}

// /article/:slug — bitta maqola. API'dan slug bo'yicha yuklanadi.
export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(undefined); // undefined=yuklanmoqda, null=topilmadi
  const [related, setRelated] = useState([]);
  const [toc, setToc] = useState([]);
  const contentRef = useRef(null);

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

  // Mundarija (TOC): matn render bo'lgach H2/H3 ga id beramiz va ro'yxat quramiz.
  useEffect(() => {
    if (!article || !contentRef.current) return setToc([]);
    const heads = contentRef.current.querySelectorAll("h2, h3");
    const items = [];
    heads.forEach((h, i) => {
      const id = slugifyHeading(h.textContent, i);
      h.id = id;
      items.push({ id, text: h.textContent, level: h.tagName === "H3" ? 3 : 2 });
    });
    setToc(items);
  }, [article]);

  if (article === undefined) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-[#0a0e1a]">
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
    <div className="overflow-x-hidden bg-white dark:bg-[#0a0e1a]">
      <Seo
        title={article.title}
        description={article.excerpt || article.title}
        canonical={`/blog/${article.slug}`}
        image={article.cover_image || undefined}
        type="article"
        jsonLd={articleJsonLd(article)}
      />
      <Navbar />

      <main id="main">
      <article className="px-6 pt-28">
       <div className="mx-auto max-w-[1120px]">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
         <div className="mx-auto max-w-[760px] lg:mx-0">
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
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy/[.06] pt-4 dark:border-white/[.06] print:hidden">
              <ShareButtons slug={article.slug} title={article.title} />
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-navy/10 px-3 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:border-navy hover:text-navy dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
              >
                <Download className="h-4 w-4" /> PDF
              </button>
            </div>
          </header>

          {/* Mobil mundarija (desktopda yon panelda) */}
          {toc.length > 0 && (
            <details className="mb-6 rounded-xl border border-navy/[.08] bg-softbg/60 p-4 dark:border-white/[.08] dark:bg-white/[.03] lg:hidden">
              <summary className="cursor-pointer font-heading text-[14px] font-bold text-navy dark:text-white">Mundarija</summary>
              <div className="mt-3"><TableOfContents items={toc} /></div>
            </details>
          )}

          <figure className="mb-8">
            <ArticleCover
              article={article}
              className="h-[180px] w-full rounded-2xl sm:h-[240px]"
              iconClassName="h-16 w-16 opacity-90"
            />
            {article.cover_caption && (
              <figcaption className="mt-2 text-center text-[13px] text-slate-400">
                {article.cover_caption}
              </figcaption>
            )}
          </figure>

          {/* Maqola matni — serverda sanitizatsiya qilingan HTML */}
          <div ref={contentRef} className="article-prose" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* FAQ */}
          {article.faqs?.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 font-heading text-[24px] font-bold text-navy dark:text-white">
                Ko'p so'raladigan savollar
              </h2>
              <div className="flex flex-col gap-3">
                {article.faqs.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-navy/[.08] bg-softbg/60 px-5 py-4 dark:border-white/[.08] dark:bg-white/[.03]">
                    <summary className="cursor-pointer list-none font-heading text-[16px] font-semibold text-navy marker:hidden dark:text-white">
                      {f.question}
                    </summary>
                    <div
                      className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300"
                      dangerouslySetInnerHTML={{ __html: f.answer }}
                    />
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Teglar */}
          {article.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <Link
                  key={t.slug}
                  to={`/blog?tag=${t.slug}`}
                  className="rounded-lg bg-navy/[.05] px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-azure hover:text-white dark:bg-white/[.06] dark:text-slate-300"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}

          {/* Muallif */}
          {article.author_obj && (article.author_obj.bio || article.author_obj.avatar) && (
            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-navy/[.08] bg-softbg/60 p-5 dark:border-white/[.08] dark:bg-white/[.03]">
              {article.author_obj.avatar ? (
                <img src={article.author_obj.avatar} alt={article.author_obj.name} className="h-14 w-14 flex-none rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-navy text-white">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Muallif</p>
                <p className="font-heading text-[16px] font-bold text-navy dark:text-white">{article.author_obj.name}</p>
                {article.author_obj.bio && (
                  <p className="mt-1 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">{article.author_obj.bio}</p>
                )}
              </div>
            </div>
          )}

          {/* Telegram CTA */}
          <div className="mt-14 rounded-2xl bg-navy px-7 py-8 text-center text-white print:hidden">
            <h2 className="font-heading text-[22px] font-bold">Hisobotingizni tahlil qildiring</h2>
            <p className="mx-auto mt-2 max-w-[440px] text-[15px] text-slate-300">
              1C hisobotingizni yuboring — 50+ ko'rsatkich va tayyor PDF hisobotni
              bir necha daqiqada oling.
            </p>
            <a
              href={BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#0f172a] transition-transform hover:-translate-y-0.5"
            >
              <Send className="h-[18px] w-[18px]" /> Telegram botga o'tish
            </a>
          </div>

          {/* Newsletter */}
          <div className="mt-8 print:hidden">
            <NewsletterForm source={`article:${article.slug}`} />
          </div>
         </div>

         {/* Sticky mundarija + share (desktop) */}
         <aside className="hidden lg:block">
           <div className="sticky top-24">
             <TableOfContents items={toc} />
             <div className="mt-8 border-t border-navy/[.08] pt-6 dark:border-white/[.08]">
               <ShareButtons slug={article.slug} title={article.title} />
             </div>
           </div>
         </aside>
        </div>
       </div>
      </article>

      {related.length > 0 && (
        <section className="mt-20 border-t border-navy/[.06] bg-softbg px-6 py-16 dark:border-white/[.06] dark:bg-[#0e1424] print:hidden">
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
      </main>

      <Footer />
    </div>
  );
}
