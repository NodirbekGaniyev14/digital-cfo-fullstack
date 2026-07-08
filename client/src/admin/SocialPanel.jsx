import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Share2, Loader2, Sparkles, Copy, ChevronDown, RefreshCw } from "lucide-react";
import { socialGet, socialGenerate } from "@/lib/api";

// Har platforma uchun ko'rsatiladigan bo'limlar (tartib bilan).
const SECTIONS = [
  { key: "linkedin_post", label: "LinkedIn post", icon: "💼" },
  { key: "linkedin_carousel", label: "LinkedIn karusel", icon: "🎠" },
  { key: "telegram", label: "Telegram", icon: "✈️" },
  { key: "facebook", label: "Facebook", icon: "📘" },
  { key: "instagram_caption", label: "Instagram caption", icon: "📸" },
  { key: "instagram_carousel", label: "Instagram karusel", icon: "🖼️" },
  { key: "threads", label: "Threads", icon: "🧵" },
  { key: "x_thread", label: "X (Twitter) thread", icon: "𝕏" },
  { key: "youtube_community", label: "YouTube community", icon: "▶️" },
  { key: "email", label: "Email newsletter", icon: "✉️" },
  { key: "reels_script", label: "Reels ssenariy", icon: "🎬" },
  { key: "shorts_script", label: "YouTube Shorts", icon: "📱" },
  { key: "podcast", label: "Podkast g'oyasi", icon: "🎙️" },
  { key: "hashtags", label: "Hashtaglar", icon: "#️⃣" },
];

// Har xil qiymatni nusxalash uchun matnga aylantiradi.
function toText(key, v) {
  if (v == null) return "";
  if (Array.isArray(v)) {
    return v.map((s, i) => `${i + 1}. ${String(s)}`).join("\n");
  }
  if (typeof v === "object") {
    if (key === "email") {
      return [v.subject && `Sarlavha: ${v.subject}`, v.preview && `Preview: ${v.preview}`, "", v.body].filter(Boolean).join("\n");
    }
    if (key === "podcast") {
      return [v.title, "", ...(v.points || []).map((p) => `• ${p}`), "", v.duration && `Davomiyligi: ${v.duration}`].filter(Boolean).join("\n");
    }
    // hashtags — {platform: [..]}
    return Object.entries(v)
      .map(([plat, arr]) => `${plat}: ${(arr || []).map((h) => (h.startsWith("#") ? h : "#" + h)).join(" ")}`)
      .join("\n");
  }
  return String(v);
}

export default function SocialPanel({ articleId }) {
  const [open, setOpen] = useState(false);
  const [social, setSocial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    socialGet(articleId).then(setSocial).catch(() => {}).finally(() => setLoading(false));
  }, [articleId]);

  const generate = async () => {
    setBusy(true);
    try {
      const s = await socialGenerate(articleId);
      setSocial(s);
      toast.success("Social paket yaratildi");
      setOpen(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success("Nusxalandi");
  };

  const has = social && typeof social === "object";

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/[.08] bg-white dark:border-white/[.08] dark:bg-[#141b2e]">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-2 px-5 py-3.5">
        <span className="inline-flex items-center gap-2 font-heading text-[15px] font-bold text-navy dark:text-white">
          <Share2 className="h-[18px] w-[18px] text-azure" /> Social paket
          <span className="rounded-md bg-azure/10 px-1.5 py-0.5 text-[11px] font-semibold text-azure">Part 7</span>
          {has && <span className="text-[12px] font-normal text-emerald-500">✓ tayyor</span>}
        </span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-navy/[.06] px-5 py-4 dark:border-white/[.06]">
          {loading ? (
            <div className="flex justify-center py-4 text-slate-400"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[13px] text-slate-500 dark:text-slate-400">
                  Maqoladan 13 ta platforma uchun kontent (LinkedIn, Telegram, Instagram, X, email…).
                </p>
                <button
                  onClick={generate}
                  disabled={busy}
                  className="flex flex-none items-center gap-1.5 rounded-xl bg-gradient-to-r from-azure to-emerald-500 px-3.5 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
                >
                  {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Yaratilmoqda…</> : has ? <><RefreshCw className="h-4 w-4" /> Qayta yaratish</> : <><Sparkles className="h-4 w-4" /> Yaratish</>}
                </button>
              </div>

              {!has ? (
                <p className="py-3 text-center text-[13px] text-slate-400">Hali yaratilmagan. "Yaratish"ni bosing.</p>
              ) : (
                <div className="space-y-2.5">
                  {SECTIONS.filter((s) => social[s.key] != null && (Array.isArray(social[s.key]) ? social[s.key].length : true)).map((s) => {
                    const text = toText(s.key, social[s.key]);
                    return (
                      <div key={s.key} className="rounded-xl border border-navy/[.06] bg-softbg/50 p-3 dark:border-white/[.06] dark:bg-white/[.02]">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[12.5px] font-semibold text-navy dark:text-white">{s.icon} {s.label}</span>
                          <button onClick={() => copy(text)} className="inline-flex items-center gap-1 text-[12px] font-medium text-azure hover:underline">
                            <Copy className="h-3.5 w-3.5" /> Nusxalash
                          </button>
                        </div>
                        <pre className="max-h-[220px] overflow-y-auto whitespace-pre-wrap break-words font-sans text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">{text}</pre>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
