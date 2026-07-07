import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Search, Eye } from "lucide-react";
import AdminShell from "./AdminShell";
import { ArticleCover } from "@/components/ArticleCard";
import { adminGetArticles, adminDelete } from "@/lib/api";
import { formatDateUz } from "@/data/articles";

// /admin — barcha maqolalar (draft + published) jadvali.
export default function AdminList() {
  const [articles, setArticles] = useState(null);
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    if (!articles) return [];
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) =>
      `${a.title} ${a.category} ${a.status} ${a.author}`.toLowerCase().includes(q)
    );
  }, [articles, query]);

  const load = () =>
    adminGetArticles()
      .then(setArticles)
      .catch((e) => {
        toast.error(e.message);
        setArticles([]);
      });

  useEffect(() => {
    load();
  }, []);

  const remove = async (a) => {
    if (!window.confirm(`"${a.title}" maqolasi o'chirilsinmi?`)) return;
    try {
      await adminDelete(a.id);
      toast.success("O'chirildi");
      setArticles((list) => list.filter((x) => x.id !== a.id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-navy dark:text-white">Maqolalar</h1>
          <p className="text-[14px] text-slate-400">
            {articles ? `Jami: ${articles.length} ta` : "Yuklanmoqda…"}
          </p>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-[18px] w-[18px]" /> Yangi maqola
        </Link>
      </div>

      {articles?.length > 0 && (
        <div className="relative mb-4 sm:max-w-[360px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sarlavha, kategoriya, holat…"
            className="w-full rounded-xl border border-navy/10 bg-white py-2.5 pl-10 pr-4 text-[14px] outline-none focus:border-azure dark:border-white/10 dark:bg-[#141b2e] dark:text-white"
          />
        </div>
      )}

      {articles === null ? (
        <div className="flex justify-center py-20 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-navy/[.08] bg-white p-12 text-center text-slate-500 dark:border-white/[.08] dark:bg-[#141b2e]">
          {query ? `"${query}" bo'yicha topilmadi.` : "Hozircha maqola yo'q. «Yangi maqola» bilan boshlang."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy/[.08] bg-white dark:border-white/[.08] dark:bg-[#141b2e]">
          {shown.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-4 border-b border-navy/[.06] px-4 py-3 last:border-b-0 dark:border-white/[.06]"
            >
              <ArticleCover article={a} className="hidden h-12 w-16 flex-none rounded-lg sm:flex" iconClassName="h-5 w-5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-navy dark:text-white">{a.title}</span>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12.5px] text-slate-400">
                  {a.category && <span>{a.category}</span>}
                  {a.category && <span>·</span>}
                  <span>{formatDateUz(a.created_at)}</span>
                  {a.views > 0 && (
                    <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {a.views}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {a.status === "published" && (
                  <a
                    href={`/blog/${a.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Saytda ochish"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-navy/[.05] hover:text-azure"
                  >
                    <ExternalLink className="h-[18px] w-[18px]" />
                  </a>
                )}
                <Link
                  to={`/admin/articles/${a.id}/edit`}
                  title="Tahrirlash"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-navy/[.05] hover:text-azure"
                >
                  <Pencil className="h-[18px] w-[18px]" />
                </Link>
                <button
                  onClick={() => remove(a)}
                  title="O'chirish"
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function StatusBadge({ status }) {
  const published = status === "published";
  return (
    <span
      className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        published
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
      }`}
    >
      {published ? "Chop etilgan" : "Qoralama"}
    </span>
  );
}
