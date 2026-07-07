import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Copy, Check, Link2 } from "lucide-react";
import { getArticles } from "@/lib/api";

// Kalitsiz (lokal) SEO/kontent tahlili: tekshiruv ro'yxati, readability,
// keyword density, ichki-havola tavsiyalari. Editorda "SEO sog'lig'i" paneli.

const strip = (html) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = (t) => (t ? t.split(/\s+/).filter(Boolean) : []);
const STOP = new Set(["va", "bilan", "uchun", "ham", "bu", "shu", "yoki", "lekin", "hamda", "the", "and", "for", "nima"]);

export default function SeoHealth({ form }) {
  const [articles, setArticles] = useState([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    getArticles().then(setArticles).catch(() => {});
  }, []);

  const a = useMemo(() => {
    const text = strip(form.content);
    const ws = words(text);
    const kw = (form.focus_keyword || "").trim().toLowerCase();
    const title = (form.seo_title || form.title || "");
    const desc = (form.seo_description || form.excerpt || "");
    const sentences = text.split(/[.!?…]+/).filter((s) => s.trim().length > 0);
    const avgWps = sentences.length ? Math.round(ws.length / sentences.length) : 0;

    // Keyword density
    let kwCount = 0;
    if (kw) {
      const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      kwCount = (text.match(re) || []).length;
    }
    const density = ws.length ? ((kwCount / ws.length) * 100) : 0;

    // Readability (o'rtacha so'z/gap)
    let readLabel = "—", readState = "warn";
    if (avgWps > 0) {
      if (avgWps <= 12) { readLabel = "Oson"; readState = "good"; }
      else if (avgWps <= 18) { readLabel = "O'rtacha"; readState = "good"; }
      else if (avgWps <= 25) { readLabel = "Murakkab"; readState = "warn"; }
      else { readLabel = "Juda murakkab"; readState = "bad"; }
    }

    const firstChunk = ws.slice(0, Math.max(30, Math.round(ws.length * 0.1))).join(" ").toLowerCase();
    const hasInternalLink = /href=["']\/(blog|article)\//.test(form.content || "");

    const checks = [
      { label: `Sarlavha uzunligi (${title.length}) 30–60`, state: title.length >= 30 && title.length <= 60 ? "good" : title.length ? "warn" : "bad" },
      { label: `Meta tavsif (${desc.length}) 120–160`, state: desc.length >= 120 && desc.length <= 160 ? "good" : desc.length ? "warn" : "bad" },
      { label: "Focus keyword kiritilgan", state: kw ? "good" : "bad" },
      kw && { label: "Keyword sarlavhada", state: title.toLowerCase().includes(kw) ? "good" : "warn" },
      kw && { label: "Keyword matn boshida", state: firstChunk.includes(kw) ? "good" : "warn" },
      kw && { label: "Keyword slug'da", state: (form.slug || "").toLowerCase().includes(kw.replace(/\s+/g, "-")) ? "good" : "warn" },
      { label: `Matn uzunligi (${ws.length} so'z) ≥ 300`, state: ws.length >= 300 ? "good" : ws.length >= 100 ? "warn" : "bad" },
      { label: "Kamida bitta H2 sarlavha", state: /<h2/i.test(form.content || "") ? "good" : "warn" },
      { label: "Ichki havola bor", state: hasInternalLink ? "good" : "warn" },
      { label: "Muqova rasm + alt", state: form.cover_image && form.cover_alt ? "good" : form.cover_image ? "warn" : "warn" },
    ].filter(Boolean);

    const passed = checks.filter((c) => c.state === "good").length;
    const score = Math.round((passed / checks.length) * 100);

    // Ichki-havola tavsiyalari: sarlavha/keyword so'zlari mos keladigan boshqa maqolalar
    const myTerms = new Set(
      words(`${form.title} ${kw}`.toLowerCase()).filter((w) => w.length > 3 && !STOP.has(w))
    );
    const linkSuggestions = articles
      .filter((x) => x.slug !== form.slug)
      .map((x) => {
        const terms = words(`${x.title} ${x.category}`.toLowerCase());
        const overlap = terms.filter((t) => myTerms.has(t)).length;
        return { ...x, overlap };
      })
      .filter((x) => x.overlap > 0)
      .sort((x, y) => y.overlap - x.overlap)
      .slice(0, 4);

    return { score, checks, avgWps, readLabel, readState, kwCount, density, wordCount: ws.length, linkSuggestions };
  }, [form, articles]);

  const copy = async (url) => {
    try { await navigator.clipboard.writeText(url); setCopied(url); setTimeout(() => setCopied(""), 1400); } catch { /* ignore */ }
  };

  const scoreColor = a.score >= 80 ? "text-emerald-500" : a.score >= 50 ? "text-amber-500" : "text-red-500";

  return (
    <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-[15px] font-bold text-navy dark:text-white">SEO sog'lig'i</h3>
        <span className={`font-heading text-[22px] font-extrabold ${scoreColor}`}>{a.score}<span className="text-[13px] text-slate-400">/100</span></span>
      </div>

      {/* Metrikalar */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <Metric label="O'qilishi" value={a.readLabel} state={a.readState} />
        <Metric label="So'z/gap" value={a.avgWps || "—"} state={a.readState} />
        <Metric label="Keyword" value={a.density ? `${a.density.toFixed(1)}%` : "—"} state={a.density >= 0.5 && a.density <= 2.8 ? "good" : a.density ? "warn" : "bad"} />
      </div>

      {/* Tekshiruv ro'yxati */}
      <ul className="space-y-1.5">
        {a.checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-[13px]">
            <StateIcon state={c.state} />
            <span className={c.state === "good" ? "text-slate-500 dark:text-slate-400" : "text-navy dark:text-slate-200"}>{c.label}</span>
          </li>
        ))}
      </ul>

      {/* Ichki-havola tavsiyalari */}
      {a.linkSuggestions.length > 0 && (
        <div className="mt-4 border-t border-navy/[.06] pt-3 dark:border-white/[.06]">
          <p className="mb-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 dark:text-slate-400">
            <Link2 className="h-3.5 w-3.5" /> Ichki havola tavsiyalari
          </p>
          <div className="space-y-1.5">
            {a.linkSuggestions.map((s) => (
              <div key={s.slug} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-slate-600 dark:text-slate-300" title={s.title}>{s.title}</span>
                <button onClick={() => copy(`/blog/${s.slug}`)} title="Havolani nusxalash" className="flex-none rounded-md p-1.5 text-slate-400 hover:text-azure">
                  {copied === `/blog/${s.slug}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, state }) {
  const c = state === "good" ? "text-emerald-500" : state === "bad" ? "text-red-500" : "text-amber-500";
  return (
    <div className="rounded-lg bg-softbg/60 px-2 py-2 dark:bg-white/[.03]">
      <p className={`font-heading text-[14px] font-bold ${c}`}>{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  );
}

function StateIcon({ state }) {
  if (state === "good") return <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />;
  if (state === "bad") return <XCircle className="h-4 w-4 flex-none text-red-500" />;
  return <AlertTriangle className="h-4 w-4 flex-none text-amber-500" />;
}
