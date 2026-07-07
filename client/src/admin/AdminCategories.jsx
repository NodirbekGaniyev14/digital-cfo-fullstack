import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Check, X, FolderTree } from "lucide-react";
import AdminShell from "./AdminShell";
import {
  adminCategories, adminCreateCategory, adminRenameCategory, adminDeleteCategory,
} from "@/lib/api";

// /admin/categories — kategoriyalarni boshqarish (qo'shish, nomini o'zgartirish, o'chirish).
export default function AdminCategories() {
  const [cats, setCats] = useState(null);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const load = () =>
    adminCategories().then(setCats).catch((e) => { toast.error(e.message); setCats([]); });

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    try {
      await adminCreateCategory(newName.trim());
      setNewName("");
      toast.success("Qo'shildi");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveRename = async (id) => {
    if (!editName.trim()) return;
    try {
      await adminRenameCategory(id, editName.trim());
      setEditId(null);
      toast.success("Yangilandi");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async (c) => {
    const msg = c.count > 0
      ? `"${c.name}" o'chirilsinmi? ${c.count} ta maqola "kategoriyasiz" bo'ladi.`
      : `"${c.name}" o'chirilsinmi?`;
    if (!window.confirm(msg)) return;
    try {
      await adminDeleteCategory(c.id);
      setCats((list) => list.filter((x) => x.id !== c.id));
      toast.success("O'chirildi");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-heading text-[24px] font-bold text-navy dark:text-white">Kategoriyalar</h1>
        <p className="text-[14px] text-slate-400">{cats ? `${cats.length} ta kategoriya` : "Yuklanmoqda…"}</p>
      </div>

      <div className="mx-auto max-w-[560px]">
        {/* Qo'shish */}
        <form onSubmit={add} className="mb-5 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Yangi kategoriya nomi"
            className="flex-1 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-azure dark:border-white/15 dark:bg-[#141b2e] dark:text-white"
          />
          <button type="submit" disabled={busy} className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-[18px] w-[18px]" />} Qo'shish
          </button>
        </form>

        {cats === null ? (
          <div className="flex justify-center py-16 text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : cats.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-navy/[.08] bg-white p-12 text-center text-slate-500 dark:border-white/[.08] dark:bg-[#141b2e]">
            <FolderTree className="h-8 w-8 text-slate-300" /> Hozircha kategoriya yo'q.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-navy/[.08] bg-white dark:border-white/[.08] dark:bg-[#141b2e]">
            {cats.map((c) => (
              <div key={c.id} className="flex items-center gap-3 border-b border-navy/[.06] px-4 py-3 last:border-b-0 dark:border-white/[.06]">
                {editId === c.id ? (
                  <>
                    <input
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveRename(c.id)}
                      className="flex-1 rounded-lg border border-azure bg-transparent px-3 py-1.5 text-[14px] outline-none dark:text-white"
                    />
                    <button onClick={() => saveRename(c.id)} className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"><Check className="h-[18px] w-[18px]" /></button>
                    <button onClick={() => setEditId(null)} className="rounded-lg p-2 text-slate-400 hover:bg-navy/[.05]"><X className="h-[18px] w-[18px]" /></button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-navy dark:text-white">{c.name}</span>
                    <span className="rounded-full bg-navy/[.06] px-2.5 py-0.5 text-[12px] font-semibold text-slate-500 dark:bg-white/[.08] dark:text-slate-300">{c.count} maqola</span>
                    <button onClick={() => { setEditId(c.id); setEditName(c.name); }} title="Tahrirlash" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-navy/[.05] hover:text-azure"><Pencil className="h-[17px] w-[17px]" /></button>
                    <button onClick={() => remove(c)} title="O'chirish" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><Trash2 className="h-[17px] w-[17px]" /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-[12.5px] text-slate-400">
          Nomni o'zgartirsangiz, shu kategoriyadagi barcha maqolalar avtomatik yangilanadi.
        </p>
      </div>
    </AdminShell>
  );
}
