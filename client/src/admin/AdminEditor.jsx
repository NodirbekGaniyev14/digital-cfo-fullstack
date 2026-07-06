import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";
import AdminShell from "./AdminShell";
import {
  ArticleCover, ArticleIcon, ICON_OPTIONS, COLOR_OPTIONS,
} from "@/components/ArticleCard";
import { adminGetArticle, adminCreate, adminUpdate, uploadImage } from "@/lib/api";

const DEFAULT_CATEGORIES = ["Asoslar", "Likvidlik", "Risk", "Rentabellik", "Barqarorlik", "Amaliyot"];

// Oddiy slug (server saqlashda baribir unikal qiladi).
function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const empty = {
  title: "", slug: "", excerpt: "", content: "", category: "",
  icon: "chart", icon_color: "blue", cover_image: "", author: "Digital CFO",
  status: "draft",
};

// /admin/articles/new va /admin/articles/:id/edit
export default function AdminEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const slugTouched = useRef(false);

  useEffect(() => {
    if (!isEdit) return;
    adminGetArticle(Number(id))
      .then((a) => {
        slugTouched.current = true;
        setForm({ ...empty, ...a });
      })
      .catch((e) => {
        toast.error(e.message);
        nav("/admin", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onTitle = (v) => {
    set("title", v);
    if (!slugTouched.current) set("slug", slugify(v));
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      set("cover_image", url);
      toast.success("Rasm yuklandi");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async (statusOverride) => {
    if (!form.title.trim()) return toast.error("Sarlavha majburiy");
    const payload = { ...form, status: statusOverride || form.status };
    setBusy(true);
    try {
      if (isEdit) await adminUpdate(Number(id), payload);
      else await adminCreate(payload);
      toast.success(statusOverride === "published" ? "Chop etildi!" : "Saqlandi");
      nav("/admin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Link to="/admin" className="mb-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-slate-500 hover:text-navy dark:text-slate-300 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Orqaga
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Asosiy ustun */}
        <div className="space-y-5">
          <Field label="Sarlavha">
            <input
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              className="w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[16px] font-semibold outline-none focus:border-azure dark:border-white/15 dark:text-white"
              placeholder="Maqola sarlavhasi"
            />
          </Field>

          <Field label="Slug (URL)" hint="/blog/… — bo'sh qoldirsangiz sarlavhadan avtomatik">
            <input
              value={form.slug}
              onChange={(e) => { slugTouched.current = true; set("slug", e.target.value); }}
              className="w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 font-mono text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              placeholder="masalan: foyda-va-zarar-hisoboti"
            />
          </Field>

          <Field label="Qisqa tavsif (excerpt)" hint="Ro'yxatda sarlavha ostida chiqadi (1–2 jumla)">
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              className="w-full resize-y rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[15px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              placeholder="Maqola haqida qisqacha…"
            />
          </Field>

          <Field label="Matn">
            <div className="admin-quill rounded-xl border border-navy/15 dark:border-white/15">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(v) => set("content", v)}
                modules={QUILL_MODULES}
                placeholder="Maqola matnini yozing…"
              />
            </div>
          </Field>
        </div>

        {/* Yon panel */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#0d182b]">
            <h3 className="mb-3 font-heading text-[14px] font-bold text-navy dark:text-white">Chop etish</h3>
            <Field label="Holat">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              >
                <option value="draft">Qoralama</option>
                <option value="published">Chop etilgan</option>
              </select>
            </Field>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => save()}
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-xl border border-navy/20 py-2.5 font-semibold text-navy transition-colors hover:bg-navy/[.04] disabled:opacity-60 dark:border-white/20 dark:text-white"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Saqlash
              </button>
              <button
                onClick={() => save("published")}
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                Chop etish
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#0d182b]">
            <h3 className="mb-3 font-heading text-[14px] font-bold text-navy dark:text-white">Ko'rinish</h3>

            <Field label="Muqova (oldindan ko'rish)">
              <ArticleCover article={form} className="h-[110px] w-full rounded-xl" iconClassName="h-8 w-8" />
            </Field>

            <Field label="Muqova rasmi (ixtiyoriy)" hint="Bo'lmasa — ikonka + rang ko'rinadi">
              {form.cover_image ? (
                <div className="flex items-center gap-2">
                  <span className="flex-1 truncate rounded-lg bg-navy/[.05] px-3 py-2 text-[12.5px] text-slate-500 dark:bg-white/[.05]">
                    {form.cover_image}
                  </span>
                  <button onClick={() => set("cover_image", "")} className="rounded-lg p-2 text-slate-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-navy/25 py-3 text-[13.5px] font-medium text-slate-500 hover:border-azure hover:text-azure dark:border-white/20">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Yuklanmoqda…" : "Rasm yuklash"}
                  <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                </label>
              )}
            </Field>

            <Field label="Kategoriya">
              <input
                list="cat-list"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                placeholder="Masalan: Likvidlik"
              />
              <datalist id="cat-list">
                {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </Field>

            <Field label="Ikonka">
              <div className="grid grid-cols-6 gap-1.5">
                {ICON_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    title={o.label}
                    onClick={() => set("icon", o.key)}
                    className={`flex h-9 items-center justify-center rounded-lg border transition-colors ${
                      form.icon === o.key
                        ? "border-azure bg-azure/10 text-azure"
                        : "border-navy/10 text-slate-400 hover:text-navy dark:border-white/10 dark:hover:text-white"
                    }`}
                  >
                    <ArticleIcon name={o.key} className="h-[18px] w-[18px]" />
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Rang">
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    title={o.label}
                    onClick={() => set("icon_color", o.key)}
                    className={`h-8 w-8 rounded-lg ring-2 ring-offset-2 transition-all dark:ring-offset-[#0d182b] ${
                      form.icon_color === o.key ? "ring-navy dark:ring-white" : "ring-transparent"
                    }`}
                    style={{ background: SWATCH[o.key] }}
                  />
                ))}
              </div>
            </Field>

            <Field label="Muallif">
              <input
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              />
            </Field>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

const SWATCH = {
  blue: "linear-gradient(135deg,#3b82f6,#2563eb)", sky: "linear-gradient(135deg,#06b6d4,#3b82f6)",
  red: "linear-gradient(135deg,#ef4444,#f97316)", green: "linear-gradient(135deg,#10b981,#14b8a6)",
  violet: "linear-gradient(135deg,#6366f1,#8b5cf6)", amber: "linear-gradient(135deg,#f59e0b,#ef4444)",
  teal: "linear-gradient(135deg,#14b8a6,#0ea5e9)", slate: "linear-gradient(135deg,#64748b,#334155)",
};

function Field({ label, hint, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-600 dark:text-slate-300">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-slate-400">{hint}</p>}
    </div>
  );
}
