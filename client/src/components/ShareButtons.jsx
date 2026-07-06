import { useState } from "react";
import { Send, Linkedin, Facebook, Link2, Check } from "lucide-react";
import { SITE_URL } from "@/data/articles";

// Ijtimoiy tarmoqlarda ulashish tugmalari.
export default function ShareButtons({ slug, title }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/blog/${slug}`;
  const t = encodeURIComponent(title || "");
  const u = encodeURIComponent(url);

  const links = [
    { label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}`, Icon: Send, color: "hover:bg-[#229ED9] hover:text-white" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: Linkedin, color: "hover:bg-[#0A66C2] hover:text-white" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: Facebook, color: "hover:bg-[#1877F2] hover:text-white" },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: XIcon, color: "hover:bg-black hover:text-white" },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[13px] font-semibold text-slate-500 dark:text-slate-400">Ulashish:</span>
      {links.map(({ label, href, Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          title={label}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border border-navy/10 text-slate-500 transition-colors dark:border-white/10 dark:text-slate-300 ${color}`}
        >
          <Icon className="h-[17px] w-[17px]" />
        </a>
      ))}
      <button
        onClick={copy}
        title="Havolani nusxalash"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy/10 text-slate-500 transition-colors hover:bg-emerald-500 hover:text-white dark:border-white/10 dark:text-slate-300"
      >
        {copied ? <Check className="h-[17px] w-[17px]" /> : <Link2 className="h-[17px] w-[17px]" />}
      </button>
    </div>
  );
}

// X (Twitter) logotipi — lucide'da yo'q, o'zimiz chizamiz.
function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}
