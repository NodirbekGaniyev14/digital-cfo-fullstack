import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Loader2, Save, Upload, X, Plus, Trash2, ChevronDown, History, User,
  Sparkles, Copy,
} from "lucide-react";
import AdminShell from "./AdminShell";
import TiptapEditor from "./TiptapEditor";
import SeoHealth from "./SeoHealth";
import SocialPanel from "./SocialPanel";
import QualityPanel from "./QualityPanel";
import {
  ArticleCover, ArticleIcon, ICON_OPTIONS, COLOR_OPTIONS,
} from "@/components/ArticleCard";
import { adminGetArticle, adminCreate, adminUpdate, uploadImage, adminMeta, adminRevisions, adminRevision, aiStatus, aiGenerate } from "@/lib/api";

const DEFAULT_CATEGORIES = ["Asoslar", "Likvidlik", "Risk", "Rentabellik", "Barqarorlik", "Amaliyot", "CFO", "IFRS", "KPI", "Budget", "Case Study"];

// Oddiy slug (server saqlashda baribir unikal qiladi).
function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const empty = {
  title: "", slug: "", excerpt: "", content: "", category: "",
  icon: "chart", icon_color: "blue", cover_image: "", cover_alt: "", cover_caption: "",
  author: "Digital CFO", author_avatar: "", author_bio: "",
  status: "draft", published_at: "", is_featured: 0,
  seo_title: "", seo_description: "", focus_keyword: "", canonical_url: "",
  robots_index: 1, robots_follow: 1, tags: [], faqs: [],
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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [meta, setMeta] = useState({ authors: [], tags: [], categories: [] });
  const [tagInput, setTagInput] = useState("");
  const [autosaveFound, setAutosaveFound] = useState(null);
  const [revisions, setRevisions] = useState(null);
  const [showRevisions, setShowRevisions] = useState(false);
  const slugTouched = useRef(false);
  const AUTOSAVE_KEY = `cfo_autosave_${id || "new"}`;

  // AI generator (DCOS) holati
  const [aiOn, setAiOn] = useState(null); // null=yuklanmoqda, true/false
  const [aiOpen, setAiOpen] = useState(!isEdit); // yangi maqolada ochiq
  const [aiBusy, setAiBusy] = useState(false);
  const [ai, setAi] = useState({ topic: "", keyword: "", length: "standard", notes: "" });
  const [aiImagePrompt, setAiImagePrompt] = useState("");

  useEffect(() => {
    adminMeta().then(setMeta).catch(() => {});
    aiStatus().then(setAiOn).catch(() => setAiOn(false));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    adminGetArticle(Number(id))
      .then((a) => {
        slugTouched.current = true;
        setForm({
          ...empty,
          ...a,
          tags: (a.tags || []).map((t) => t.name),
          author_avatar: a.author_obj?.avatar || "",
          author_bio: a.author_obj?.bio || "",
        });
      })
      .catch((e) => {
        toast.error(e.message);
        nav("/admin", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Autosave: mavjud qoralamani (localStorage) o'qib olamiz (tiklash taklifi uchun).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d?.form) setAutosaveFound(d);
      }
    } catch { /* ignore */ }
  }, [AUTOSAVE_KEY]);

  // Autosave: forma o'zgarganda 1.2s dan so'ng localStorage'ga yozamiz.
  useEffect(() => {
    if (loading) return;
    if (!form.title && !form.content) return; // bo'sh formani saqlamaymiz
    const t = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ savedAt: Date.now(), form }));
      } catch { /* ignore */ }
    }, 1200);
    return () => clearTimeout(t);
  }, [form, loading, AUTOSAVE_KEY]);

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

  const onAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImage(file);
      set("author_avatar", url);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  // Teglar (chips)
  const addTag = (name) => {
    const nm = String(name).trim().replace(/,+$/, "");
    if (nm && !form.tags.includes(nm)) set("tags", [...form.tags, nm]);
    setTagInput("");
  };
  const removeTag = (nm) => set("tags", form.tags.filter((t) => t !== nm));
  const onTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
    else if (e.key === "Backspace" && !tagInput && form.tags.length) removeTag(form.tags[form.tags.length - 1]);
  };

  // FAQ builder
  const addFaq = () => set("faqs", [...(form.faqs || []), { question: "", answer: "" }]);
  const updateFaq = (i, k, v) =>
    set("faqs", form.faqs.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));
  const removeFaq = (i) => set("faqs", form.faqs.filter((_, idx) => idx !== i));

  // AI generatsiya — natijani forma maydonlariga qo'shadi (mavjudlarini ustidan bosmaydi
  // agar AI bo'sh qaytarsa). Foydalanuvchi keyin ko'rib, tahrirlab saqlaydi.
  const runAi = async () => {
    if (!ai.topic.trim()) return toast.error("Mavzu majburiy");
    setAiBusy(true);
    setAiImagePrompt("");
    try {
      const a = await aiGenerate({
        topic: ai.topic.trim(),
        keyword: ai.keyword.trim(),
        category: form.category,
        length: ai.length,
        notes: ai.notes.trim(),
      });
      setForm((f) => ({
        ...f,
        title: a.title || f.title,
        slug: a.slug ? slugify(a.slug) : f.slug,
        excerpt: a.excerpt || f.excerpt,
        content: a.content || f.content,
        category: a.category || f.category,
        seo_title: a.seo_title || f.seo_title,
        seo_description: a.seo_description || f.seo_description,
        focus_keyword: a.focus_keyword || f.focus_keyword,
        cover_alt: a.cover_alt || f.cover_alt,
        cover_caption: a.cover_caption || f.cover_caption,
        tags: Array.isArray(a.tags) && a.tags.length ? a.tags : f.tags,
        faqs: Array.isArray(a.faqs) && a.faqs.length ? a.faqs : f.faqs,
      }));
      slugTouched.current = true;
      if (a.featured_image_prompt) setAiImagePrompt(a.featured_image_prompt);
      toast.success("Maqola yaratildi — ko'rib chiqing va tahrirlang");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAiBusy(false);
    }
  };

  const restoreAutosave = () => {
    if (autosaveFound?.form) {
      setForm({ ...empty, ...autosaveFound.form });
      slugTouched.current = true;
    }
    setAutosaveFound(null);
    toast.success("Qoralama tiklandi");
  };
  const dismissAutosave = () => {
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* ignore */ }
    setAutosaveFound(null);
  };
  const openRevisions = async () => {
    setShowRevisions(true);
    if (revisions === null) {
      try { setRevisions(await adminRevisions(Number(id))); }
      catch (e) { toast.error(e.message); setRevisions([]); }
    }
  };
  const restoreRevision = async (revId) => {
    try {
      const r = await adminRevision(revId);
      setForm((f) => ({ ...f, title: r.title, excerpt: r.excerpt, content: r.content }));
      setShowRevisions(false);
      toast.success("Versiya yuklandi — saqlashni unutmang");
    } catch (e) { toast.error(e.message); }
  };

  const save = async (statusOverride) => {
    if (!form.title.trim()) return toast.error("Sarlavha majburiy");
    const payload = { ...form, status: statusOverride || form.status };
    if (payload.status === "scheduled" && !payload.published_at) {
      return toast.error("Rejalashtirish uchun sana/vaqt tanlang");
    }
    setBusy(true);
    try {
      if (isEdit) await adminUpdate(Number(id), payload);
      else await adminCreate(payload);
      try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* ignore */ }
      toast.success(statusOverride === "published" ? "Chop etildi!" : "Saqlandi");
      nav("/admin/articles");
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

  const showRestore =
    autosaveFound &&
    (autosaveFound.form.title !== form.title || autosaveFound.form.content !== form.content);

  return (
    <AdminShell>
      <div className="mb-5 flex items-center justify-between">
        <Link to="/admin/articles" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-slate-500 hover:text-navy dark:text-slate-300 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Orqaga
        </Link>
        {isEdit && (
          <button
            onClick={openRevisions}
            className="flex items-center gap-1.5 rounded-lg border border-navy/15 px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:text-navy dark:border-white/15 dark:text-slate-300 dark:hover:text-white"
          >
            <History className="h-4 w-4" /> Versiyalar
          </button>
        )}
      </div>

      {showRestore && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13.5px] dark:border-amber-500/30 dark:bg-amber-500/10">
          <span className="text-amber-800 dark:text-amber-300">
            💾 Saqlanmagan qoralama topildi ({new Date(autosaveFound.savedAt).toLocaleString("uz")}).
          </span>
          <div className="flex gap-2">
            <button onClick={restoreAutosave} className="rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-white">Tiklash</button>
            <button onClick={dismissAutosave} className="rounded-lg border border-amber-300 px-3 py-1.5 font-medium text-amber-700 dark:text-amber-300">Bekor</button>
          </div>
        </div>
      )}

      {/* Versiyalar modali */}
      {showRevisions && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4" onClick={() => setShowRevisions(false)}>
          <div className="max-h-[70vh] w-full max-w-[440px] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-[#141b2e]" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 font-heading text-[16px] font-bold text-navy dark:text-white">Versiya tarixi</h3>
            {revisions === null ? (
              <div className="flex justify-center py-8 text-slate-400"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : revisions.length === 0 ? (
              <p className="py-6 text-center text-[13.5px] text-slate-400">Hozircha versiya yo'q. Har saqlashda oldingi holat shu yerga yoziladi.</p>
            ) : (
              <ul className="space-y-1.5">
                {revisions.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-navy/[.08] px-3 py-2.5 dark:border-white/[.08]">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-medium text-navy dark:text-white">{r.title || "(sarlavhasiz)"}</p>
                      <p className="text-[12px] text-slate-400">{new Date(r.created_at).toLocaleString("uz")}</p>
                    </div>
                    <button onClick={() => restoreRevision(r.id)} className="flex-none rounded-lg bg-navy px-3 py-1.5 text-[12.5px] font-semibold text-white">Tiklash</button>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowRevisions(false)} className="mt-4 w-full rounded-lg border border-navy/15 py-2 text-[13.5px] font-medium text-slate-600 dark:border-white/15 dark:text-slate-300">Yopish</button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Asosiy ustun */}
        <div className="space-y-5">
          {/* AI generator (DCOS) */}
          {aiOn === false && (
            <div className="rounded-2xl border border-navy/[.08] bg-white p-4 text-[13px] text-slate-500 dark:border-white/[.08] dark:bg-[#141b2e] dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-slate-400" />
                AI yordamchi o'chirilgan — <code className="rounded bg-navy/[.06] px-1 dark:bg-white/[.06]">server/.env</code> ga <code className="rounded bg-navy/[.06] px-1 dark:bg-white/[.06]">ANTHROPIC_API_KEY</code> qo'shing.
              </span>
            </div>
          )}
          {aiOn === true && (
            <div className="overflow-hidden rounded-2xl border border-azure/25 bg-gradient-to-br from-azure/[.05] to-emerald-500/[.04] dark:border-azure/25">
              <button
                type="button"
                onClick={() => setAiOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 px-5 py-3.5"
              >
                <span className="inline-flex items-center gap-2 font-heading text-[15px] font-bold text-navy dark:text-white">
                  <Sparkles className="h-[18px] w-[18px] text-azure" /> AI bilan yaratish
                  <span className="rounded-md bg-azure/10 px-1.5 py-0.5 text-[11px] font-semibold text-azure">DCOS</span>
                </span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${aiOpen ? "rotate-180" : ""}`} />
              </button>
              {aiOpen && (
                <div className="space-y-3 border-t border-azure/15 px-5 py-4">
                  <Field label="Mavzu" hint="Nima haqida maqola? (majburiy)">
                    <input
                      value={ai.topic}
                      onChange={(e) => setAi((s) => ({ ...s, topic: e.target.value }))}
                      className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-azure dark:border-white/15 dark:bg-white/[.03] dark:text-white"
                      placeholder="Masalan: Kichik biznes uchun pul oqimini boshqarish"
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Asosiy kalit so'z (ixtiyoriy)">
                      <input
                        value={ai.keyword}
                        onChange={(e) => setAi((s) => ({ ...s, keyword: e.target.value }))}
                        className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:bg-white/[.03] dark:text-white"
                        placeholder="masalan: pul oqimi"
                      />
                    </Field>
                    <Field label="Uzunlik">
                      <select
                        value={ai.length}
                        onChange={(e) => setAi((s) => ({ ...s, length: e.target.value }))}
                        className="w-full rounded-xl border border-navy/15 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:bg-white/[.03] dark:text-white"
                      >
                        <option value="short">Ixcham (~1500 so'z)</option>
                        <option value="standard">Standart (~2500 so'z)</option>
                        <option value="pillar">Pillar (~4000 so'z)</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Qo'shimcha ko'rsatmalar (ixtiyoriy)">
                    <textarea
                      value={ai.notes}
                      onChange={(e) => setAi((s) => ({ ...s, notes: e.target.value }))}
                      rows={2}
                      className="w-full resize-y rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:bg-white/[.03] dark:text-white"
                      placeholder="Masalan: ishlab chiqarish korxonasi misolida, jadval bilan"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={runAi}
                    disabled={aiBusy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-azure to-emerald-500 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                  >
                    {aiBusy ? <><Loader2 className="h-4 w-4 animate-spin" /> Yozilmoqda… (1–2 daqiqa)</> : <><Sparkles className="h-4 w-4" /> Maqola yaratish</>}
                  </button>
                  {isEdit && (
                    <p className="text-[12px] text-amber-600 dark:text-amber-400">
                      ⚠️ Diqqat: generatsiya joriy maydonlar (sarlavha, matn, SEO…) ustidan yozadi.
                    </p>
                  )}
                  {aiImagePrompt && (
                    <div className="rounded-xl border border-navy/[.08] bg-white/70 p-3 dark:border-white/[.08] dark:bg-white/[.03]">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">🖼️ Muqova rasmi uchun prompt (tavsiya)</span>
                        <button
                          type="button"
                          onClick={() => { navigator.clipboard?.writeText(aiImagePrompt); toast.success("Nusxalandi"); }}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-azure hover:underline"
                        >
                          <Copy className="h-3.5 w-3.5" /> Nusxalash
                        </button>
                      </div>
                      <p className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">{aiImagePrompt}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
            <TiptapEditor value={form.content} onChange={(v) => set("content", v)} />
          </Field>

          {/* FAQ builder — Google FAQ Schema uchun */}
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-heading text-[15px] font-bold text-navy dark:text-white">
                FAQ (savol-javob)
              </h3>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-1.5 rounded-lg bg-navy/[.06] px-3 py-1.5 text-[13px] font-semibold text-navy transition-colors hover:bg-navy/10 dark:bg-white/[.08] dark:text-white"
              >
                <Plus className="h-4 w-4" /> Savol qo'shish
              </button>
            </div>
            {(!form.faqs || form.faqs.length === 0) ? (
              <p className="text-[13px] text-slate-400">
                FAQ qo'shsangiz, Google qidiruvda "rich results" chiqishi mumkin.
              </p>
            ) : (
              <div className="space-y-3">
                {form.faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-navy/[.08] p-3 dark:border-white/[.08]">
                    <div className="flex items-center gap-2">
                      <input
                        value={f.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                        placeholder={`Savol ${i + 1}`}
                        className="flex-1 rounded-lg border border-navy/15 bg-transparent px-3 py-2 text-[14px] font-semibold outline-none focus:border-azure dark:border-white/15 dark:text-white"
                      />
                      <button type="button" onClick={() => removeFaq(i)} className="rounded-lg p-2 text-slate-400 hover:text-red-500" title="O'chirish">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      value={f.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      placeholder="Javob"
                      rows={2}
                      className="mt-2 w-full resize-y rounded-lg border border-navy/15 bg-transparent px-3 py-2 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <h3 className="mb-3 font-heading text-[15px] font-bold text-navy dark:text-white">SEO</h3>
            <Field label="SEO sarlavha (title)" hint={`${(form.seo_title || form.title).length}/60 — bo'sh bo'lsa sarlavha ishlatiladi`}>
              <input
                value={form.seo_title}
                onChange={(e) => set("seo_title", e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                placeholder="Qidiruvda ko'rinadigan sarlavha"
              />
            </Field>
            <Field label="Meta tavsif (description)" hint={`${(form.seo_description || form.excerpt).length}/160`}>
              <textarea
                value={form.seo_description}
                onChange={(e) => set("seo_description", e.target.value)}
                rows={2}
                className="w-full resize-y rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                placeholder="Qidiruv natijasidagi qisqa tavsif"
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Focus keyword">
                <input
                  value={form.focus_keyword}
                  onChange={(e) => set("focus_keyword", e.target.value)}
                  className="w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                  placeholder="masalan: likvidlik"
                />
              </Field>
              <Field label="Canonical URL (ixtiyoriy)">
                <input
                  value={form.canonical_url}
                  onChange={(e) => set("canonical_url", e.target.value)}
                  className="w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[13px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                  placeholder="https://…"
                />
              </Field>
            </div>
            <div className="mt-1 flex gap-5">
              <Toggle label="Index (Google'ga ko'rinsin)" on={form.robots_index === 1} onChange={(v) => set("robots_index", v ? 1 : 0)} />
              <Toggle label="Follow (havolalarga ergashsin)" on={form.robots_follow === 1} onChange={(v) => set("robots_follow", v ? 1 : 0)} />
            </div>
            {/* Google snippet preview */}
            <div className="mt-4 rounded-xl border border-navy/[.08] bg-softbg/60 p-3 dark:border-white/[.08] dark:bg-white/[.03]">
              <p className="truncate text-[15px] text-[#1a0dab] dark:text-[#8ab4f8]">{form.seo_title || form.title || "Sarlavha"}</p>
              <p className="truncate text-[12.5px] text-emerald-700 dark:text-emerald-500">digitalcfo.uz › blog › {form.slug || "slug"}</p>
              <p className="line-clamp-2 text-[12.5px] text-slate-500">{form.seo_description || form.excerpt || "Meta tavsif shu yerda ko'rinadi…"}</p>
            </div>
          </div>

          <SeoHealth form={form} />

          {/* Sifat bahosi + Social paket (DCOS Part 9/7) — saqlangan maqola uchun */}
          {isEdit && <QualityPanel articleId={Number(id)} />}
          {isEdit && <SocialPanel articleId={Number(id)} />}
        </div>

        {/* Yon panel */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <h3 className="mb-3 font-heading text-[14px] font-bold text-navy dark:text-white">Chop etish</h3>
            <Field label="Holat">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              >
                <option value="draft">Qoralama</option>
                <option value="published">Chop etilgan</option>
                <option value="scheduled">Rejalashtirilgan</option>
                <option value="archived">Arxivlangan</option>
              </select>
            </Field>
            {form.status === "scheduled" && (
              <Field label="Chop etish vaqti">
                <input
                  type="datetime-local"
                  value={toLocalInput(form.published_at)}
                  onChange={(e) => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : "")}
                  className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                />
              </Field>
            )}
            <label className="flex cursor-pointer items-center gap-2.5 py-1 text-[13.5px] font-medium text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={!!form.is_featured} onChange={(e) => set("is_featured", e.target.checked ? 1 : 0)} className="h-4 w-4 accent-azure" />
              Tanlangan (featured) — tepada qadab qo'yiladi
            </label>
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

          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
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

            {form.cover_image && (
              <>
                <Field label="Alt text (rasm tavsifi — SEO)">
                  <input
                    value={form.cover_alt}
                    onChange={(e) => set("cover_alt", e.target.value)}
                    className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2 text-[13.5px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                    placeholder="Rasmda nima tasvirlangan"
                  />
                </Field>
                <Field label="Izoh (caption)">
                  <input
                    value={form.cover_caption}
                    onChange={(e) => set("cover_caption", e.target.value)}
                    className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2 text-[13.5px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                    placeholder="Rasm ostidagi izoh"
                  />
                </Field>
              </>
            )}

            <Field label="Kategoriya">
              <input
                list="cat-list"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                placeholder="Masalan: Likvidlik"
              />
              <datalist id="cat-list">
                {[...new Set([...meta.categories, ...DEFAULT_CATEGORIES])].map((c) => <option key={c} value={c} />)}
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
                    className={`h-8 w-8 rounded-lg ring-2 ring-offset-2 transition-all dark:ring-offset-[#141b2e] ${
                      form.icon_color === o.key ? "ring-navy dark:ring-white" : "ring-transparent"
                    }`}
                    style={{ background: SWATCH[o.key] }}
                  />
                ))}
              </div>
            </Field>

            <Field label="Teglar" hint="Enter yoki vergul bilan qo'shing">
              <div className="flex flex-wrap gap-1.5 rounded-xl border border-navy/15 p-2 dark:border-white/15">
                {form.tags.map((tg) => (
                  <span key={tg} className="inline-flex items-center gap-1 rounded-lg bg-azure/10 px-2 py-1 text-[12.5px] font-medium text-azure">
                    {tg}
                    <button type="button" onClick={() => removeTag(tg)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                  </span>
                ))}
                <input
                  list="tag-list"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKey}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder={form.tags.length ? "" : "tag qo'shish…"}
                  className="min-w-[80px] flex-1 bg-transparent px-1 text-[13.5px] outline-none dark:text-white"
                />
              </div>
              <datalist id="tag-list">
                {meta.tags.map((t) => <option key={t.slug} value={t.name} />)}
              </datalist>
            </Field>
          </div>

          {/* Muallif */}
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <h3 className="mb-3 font-heading text-[14px] font-bold text-navy dark:text-white">Muallif</h3>
            <div className="mb-4 flex items-center gap-3">
              {form.author_avatar ? (
                <img src={form.author_avatar} alt="" className="h-14 w-14 flex-none rounded-full object-cover" />
              ) : (
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-navy/[.06] text-slate-400 dark:bg-white/[.06]">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-azure hover:underline">
                  {avatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Avatar yuklash
                  <input type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" />
                </label>
                {form.author_avatar && (
                  <button type="button" onClick={() => set("author_avatar", "")} className="text-left text-[12px] text-slate-400 hover:text-red-500">O'chirish</button>
                )}
              </div>
            </div>
            <Field label="Ism">
              <input
                list="author-list"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              />
              <datalist id="author-list">
                {meta.authors.map((au) => <option key={au.slug} value={au.name} />)}
              </datalist>
            </Field>
            <Field label="Bio (qisqa tavsif)">
              <textarea
                value={form.author_bio}
                onChange={(e) => set("author_bio", e.target.value)}
                rows={2}
                className="w-full resize-y rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[13.5px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                placeholder="Masalan: Moliyaviy tahlilchi, 10 yillik tajriba"
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

function Toggle({ label, on, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-slate-600 dark:text-slate-300">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
      {label}
    </label>
  );
}

// ISO -> datetime-local input qiymati (lokal vaqt).
function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
