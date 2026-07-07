import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Search, Trash2, Copy, Check, ImageOff } from "lucide-react";
import AdminShell from "./AdminShell";
import { adminMedia, adminDeleteMedia } from "@/lib/api";

// /admin/media — yuklangan rasmlarni boshqarish (ko'rish, qidirish, o'chirish).
export default function AdminMedia() {
  const [media, setMedia] = useState(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    adminMedia().then(setMedia).catch((e) => { toast.error(e.message); setMedia([]); });
  }, []);

  const shown = useMemo(() => {
    if (!media) return [];
    const q = query.trim().toLowerCase();
    return q ? media.filter((m) => m.name.toLowerCase().includes(q)) : media;
  }, [media, query]);

  const remove = async (m) => {
    if (!window.confirm(`"${m.name}" o'chirilsinmi?`)) return;
    try {
      await adminDeleteMedia(m.name);
      setMedia((list) => list.filter((x) => x.name !== m.name));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(""), 1500);
    } catch { /* ignore */ }
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-heading text-[24px] font-bold text-navy dark:text-white">Media</h1>
        <p className="text-[14px] text-slate-400">
          {media ? `${media.length} ta rasm` : "Yuklanmoqda…"}
        </p>
      </div>

      {media?.length > 0 && (
        <div className="relative mb-5 sm:max-w-[360px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Fayl nomi bo'yicha qidirish…"
            className="w-full rounded-xl border border-navy/10 bg-white py-2.5 pl-10 pr-4 text-[14px] outline-none focus:border-azure dark:border-white/10 dark:bg-[#141b2e] dark:text-white"
          />
        </div>
      )}

      {media === null ? (
        <div className="flex justify-center py-20 text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-navy/[.08] bg-white p-12 text-center text-slate-500 dark:border-white/[.08] dark:bg-[#141b2e]">
          <ImageOff className="h-8 w-8 text-slate-300" />
          {query ? `"${query}" topilmadi.` : "Hozircha rasm yo'q. Editorda rasm yuklang."}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((m) => (
            <div key={m.name} className="group overflow-hidden rounded-xl border border-navy/[.08] bg-white dark:border-white/[.08] dark:bg-[#141b2e]">
              <div className="relative aspect-[4/3] bg-softbg dark:bg-white/[.03]">
                <img src={m.url} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => copy(m.url)} title="URL nusxalash" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-navy hover:bg-white">
                    {copied === m.url ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={() => remove(m)} title="O'chirish" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-red-500 hover:bg-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="truncate text-[12px] text-slate-500 dark:text-slate-400" title={m.name}>{m.name}</p>
                <p className="text-[11px] text-slate-400">{(m.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
