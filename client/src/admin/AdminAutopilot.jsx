import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Rocket, Play, Loader2, Plus, Trash2, RotateCcw, Check, Clock,
  AlertTriangle, Sparkles, ListPlus,
} from "lucide-react";
import AdminShell from "./AdminShell";
import {
  autopilotGet, autopilotSettings, autopilotTopics, autopilotAddTopic,
  autopilotRemoveTopic, autopilotRetryTopic, autopilotSeedStarter, autopilotRunNow,
} from "@/lib/api";

const MODE_LABEL = {
  draft: "Qoralama — inson chop etadi",
  scheduled: "Rejalashtirilgan — slot vaqtiga",
  published: "Darhol jonli (avtonom)",
};

export default function AdminAutopilot() {
  const [status, setStatus] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const [form, setForm] = useState({ topic: "", keyword: "", category: "", length: "standard" });

  const refresh = async () => {
    try {
      const [s, t] = await Promise.all([autopilotGet(), autopilotTopics()]);
      setStatus(s);
      setTopics(t);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const setSetting = async (payload) => {
    setBusy(true);
    try {
      const s = await autopilotSettings(payload);
      setStatus(s);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const addTopic = async (e) => {
    e.preventDefault();
    if (!form.topic.trim()) return toast.error("Mavzu majburiy");
    try {
      await autopilotAddTopic({ ...form, topic: form.topic.trim() });
      setForm({ topic: "", keyword: "", category: "", length: "standard" });
      toast.success("Mavzu qo'shildi");
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const removeTopic = async (id) => {
    try { await autopilotRemoveTopic(id); refresh(); }
    catch (e) { toast.error(e.message); }
  };
  const retryTopic = async (id) => {
    try { await autopilotRetryTopic(id); toast.success("Qayta navbatga qo'yildi"); refresh(); }
    catch (e) { toast.error(e.message); }
  };
  const seedStarter = async () => {
    try {
      const r = await autopilotSeedStarter();
      toast.success(`${r.added} ta boshlang'ich mavzu qo'shildi`);
      refresh();
    } catch (e) { toast.error(e.message); }
  };

  const runNow = async () => {
    setRunning(true);
    try {
      const r = await autopilotRunNow();
      if (r.status === "ok") toast.success("Maqola yaratildi: " + r.message);
      else if (r.status === "skipped") toast(`O'tkazib yuborildi: ${r.message}`);
      else toast.error("Xato: " + r.message);
      refresh();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20 text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      </AdminShell>
    );
  }

  const s = status || {};
  const q = s.queue || {};

  return (
    <AdminShell>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-azure to-emerald-500 text-white">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-[20px] font-bold text-navy dark:text-white">Avtopilot</h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">DCOS avtomatik maqola generatsiyasi (Faza 2)</p>
        </div>
      </div>

      {!s.aiEnabled && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13.5px] text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 flex-none" />
          AI o'chirilgan — <code className="rounded bg-amber-500/15 px-1">server/.env</code> ga <code className="rounded bg-amber-500/15 px-1">ANTHROPIC_API_KEY</code> qo'shmaguningizcha avtopilot ishlamaydi.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Chap: navbat */}
        <div className="space-y-5">
          {/* Mavzu qo'shish */}
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-heading text-[15px] font-bold text-navy dark:text-white">Mavzu navbati</h3>
              <span className="text-[12.5px] text-slate-400">
                {q.pending || 0} kutmoqda · {q.done || 0} bajarilgan · {q.failed || 0} xato
              </span>
            </div>
            <form onSubmit={addTopic} className="space-y-2.5">
              <input
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                placeholder="Mavzu (masalan: Pul oqimini boshqarish asoslari)"
                className="w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              />
              <div className="grid gap-2.5 sm:grid-cols-3">
                <input
                  value={form.keyword}
                  onChange={(e) => setForm((f) => ({ ...f, keyword: e.target.value }))}
                  placeholder="Kalit so'z"
                  className="rounded-xl border border-navy/15 bg-transparent px-3 py-2 text-[13.5px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                />
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Kategoriya"
                  className="rounded-xl border border-navy/15 bg-transparent px-3 py-2 text-[13.5px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                />
                <select
                  value={form.length}
                  onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))}
                  className="rounded-xl border border-navy/15 bg-transparent px-3 py-2 text-[13.5px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                >
                  <option value="short">Ixcham</option>
                  <option value="standard">Standart</option>
                  <option value="pillar">Pillar</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-[13.5px] font-semibold text-white dark:bg-white dark:text-navy">
                  <Plus className="h-4 w-4" /> Qo'shish
                </button>
                {topics.length === 0 && (
                  <button type="button" onClick={seedStarter} className="flex items-center gap-1.5 rounded-xl border border-navy/15 px-4 py-2 text-[13.5px] font-medium text-slate-600 dark:border-white/15 dark:text-slate-300">
                    <ListPlus className="h-4 w-4" /> Boshlang'ich mavzular
                  </button>
                )}
              </div>
            </form>

            {/* Navbat ro'yxati */}
            <div className="mt-4 space-y-1.5">
              {topics.length === 0 ? (
                <p className="py-4 text-center text-[13px] text-slate-400">Navbat bo'sh. Mavzu qo'shing yoki "Boshlang'ich mavzular"ni bosing.</p>
              ) : (
                topics.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-xl border border-navy/[.06] px-3 py-2.5 dark:border-white/[.06]">
                    <StatusDot status={t.status} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-navy dark:text-white">{t.topic}</p>
                      <p className="truncate text-[12px] text-slate-400">
                        {[t.category, t.keyword, t.length].filter(Boolean).join(" · ")}
                        {t.status === "failed" && t.error ? ` — ${t.error}` : ""}
                      </p>
                    </div>
                    {t.status === "failed" && (
                      <button onClick={() => retryTopic(t.id)} title="Qayta urinish" className="rounded-lg p-1.5 text-slate-400 hover:text-azure">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => removeTopic(t.id)} title="O'chirish" className="rounded-lg p-1.5 text-slate-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ishga tushirish jurnali */}
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <h3 className="mb-3 font-heading text-[15px] font-bold text-navy dark:text-white">Jurnal (oxirgi ishlar)</h3>
            {(!s.runs || s.runs.length === 0) ? (
              <p className="py-3 text-[13px] text-slate-400">Hali ishga tushmagan.</p>
            ) : (
              <ul className="space-y-1">
                {s.runs.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 border-b border-navy/[.05] py-1.5 text-[12.5px] last:border-0 dark:border-white/[.05]">
                    <RunBadge status={r.status} />
                    <span className="flex-1 truncate text-slate-600 dark:text-slate-300">{r.message || "—"}</span>
                    <span className="flex-none text-slate-400">{new Date(r.ran_at).toLocaleString("uz")}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* O'ng: boshqaruv */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <h3 className="mb-3 font-heading text-[14px] font-bold text-navy dark:text-white">Boshqaruv</h3>

            {/* Yoqish/o'chirish */}
            <label className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${s.enabled ? "border-emerald-400/40 bg-emerald-500/[.06]" : "border-navy/10 dark:border-white/10"}`}>
              <span className="text-[13.5px] font-semibold text-navy dark:text-white">Avtopilot yoqilgan</span>
              <input
                type="checkbox"
                checked={!!s.enabled}
                disabled={busy || !s.aiEnabled}
                onChange={(e) => setSetting({ enabled: e.target.checked })}
                className="h-5 w-5 accent-emerald-500 disabled:opacity-40"
              />
            </label>
            <p className="mt-1.5 text-[12px] text-slate-400">
              {s.active ? "Faol — belgilangan slotlarda maqola yaratadi." : "O'chiq — hech narsa yaratmaydi."}
            </p>

            {/* Rejim */}
            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-600 dark:text-slate-300">Nashr rejimi</label>
              <select
                value={s.mode || "draft"}
                disabled={busy}
                onChange={(e) => setSetting({ mode: e.target.value })}
                className="w-full rounded-xl border border-navy/15 bg-transparent px-3 py-2.5 text-[14px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
              >
                <option value="draft">Qoralama (draft)</option>
                <option value="scheduled">Rejalashtirilgan</option>
                <option value="published">Darhol jonli</option>
              </select>
              <p className="mt-1.5 text-[12px] text-slate-400">{MODE_LABEL[s.mode] || MODE_LABEL.draft}</p>
              {s.mode === "published" && (
                <p className="mt-1.5 flex items-start gap-1 text-[12px] text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" /> Kontent inson ko'rmasdan jonli chiqadi.
                </p>
              )}
            </div>

            {/* Social paket */}
            <label className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-navy/10 px-3 py-2.5 dark:border-white/10">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">Social paket ham yaratilsin</span>
              <input
                type="checkbox"
                checked={!!s.social}
                disabled={busy}
                onChange={(e) => setSetting({ social: e.target.checked })}
                className="h-5 w-5 accent-azure disabled:opacity-40"
              />
            </label>
            <p className="mt-1.5 text-[12px] text-slate-400">Har maqola bilan 13 kanal uchun kontent (qo'shimcha xarajat).</p>

            {/* Telegram avto-post (bepul) */}
            <label className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-navy/10 px-3 py-2.5 dark:border-white/10">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">Telegram avto-post (bepul)</span>
              <input
                type="checkbox"
                checked={!!s.telegram}
                disabled={busy || !s.telegramReady}
                onChange={(e) => setSetting({ telegram: e.target.checked })}
                className="h-5 w-5 accent-azure disabled:opacity-40"
              />
            </label>
            <p className="mt-1.5 text-[12px] text-slate-400">
              {s.telegramReady
                ? "Maqola chop etilganda kanalga sarlavha + qisqacha + havola ketadi (AI'siz, xarajat 0)."
                : "TELEGRAM_BOT_TOKEN va TELEGRAM_CHANNEL_ID sozlanmagan."}
            </p>

            {/* Quality gate */}
            <label className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-navy/10 px-3 py-2.5 dark:border-white/10">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">Sifat nazorati (quality gate)</span>
              <input
                type="checkbox"
                checked={!!s.qgate}
                disabled={busy}
                onChange={(e) => setSetting({ qgate: e.target.checked })}
                className="h-5 w-5 accent-azure disabled:opacity-40"
              />
            </label>
            {s.qgate && (
              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <span className="text-[12.5px] text-slate-500 dark:text-slate-400">Minimal ball (50–100)</span>
                <input
                  type="number"
                  min={50}
                  max={100}
                  key={s.qgateMin}
                  defaultValue={s.qgateMin}
                  onBlur={(e) => setSetting({ qgateMin: Number(e.target.value) })}
                  className="w-[70px] rounded-lg border border-navy/15 bg-transparent px-2 py-1 text-right text-[13px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
                />
              </div>
            )}
            <p className="mt-1.5 text-[12px] text-slate-400">Baho past bo'lsa maqola avtomatik qayta yoziladi (qo'shimcha xarajat).</p>

            {/* Qo'lda ishga tushirish */}
            <button
              onClick={runNow}
              disabled={running || !s.aiEnabled}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-azure to-emerald-500 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
            >
              {running ? <><Loader2 className="h-4 w-4 animate-spin" /> Yaratilmoqda…</> : <><Play className="h-4 w-4" /> Hozir bitta yaratish</>}
            </button>
            <p className="mt-1.5 text-[12px] text-slate-400">Test uchun: navbatdan keyingi mavzuni darhol yaratadi.</p>
          </div>

          {/* Jadval */}
          <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <h3 className="mb-3 flex items-center gap-1.5 font-heading text-[14px] font-bold text-navy dark:text-white">
              <Clock className="h-4 w-4 text-azure" /> Kunlik slotlar
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(s.slots || []).map((slot) => (
                <span key={slot} className="rounded-lg bg-navy/[.06] px-2.5 py-1 text-[12.5px] font-medium text-navy dark:bg-white/[.08] dark:text-white">{slot}</span>
              ))}
            </div>
            <p className="mt-2.5 text-[12px] text-slate-400">
              Vaqt mintaqasi: {s.timezone || "Asia/Tashkent"}<br />
              Keyingi slot: <span className="font-semibold text-slate-500 dark:text-slate-300">{s.nextSlot || "—"}</span>
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

function StatusDot({ status }) {
  const map = {
    pending: "bg-amber-400",
    done: "bg-emerald-500",
    failed: "bg-red-500",
  };
  return <span className={`h-2.5 w-2.5 flex-none rounded-full ${map[status] || "bg-slate-300"}`} title={status} />;
}

function RunBadge({ status }) {
  if (status === "ok") return <Check className="h-4 w-4 flex-none text-emerald-500" />;
  if (status === "error") return <AlertTriangle className="h-4 w-4 flex-none text-red-500" />;
  return <Sparkles className="h-4 w-4 flex-none text-slate-400" />;
}
