import { useEffect, useState } from "react";
import { List } from "lucide-react";

// Maqola mundarijasi (H2/H3 asosida). `items`: [{id, text, level}].
// Faol bo'limni scroll bo'yicha ajratadi.
export default function TableOfContents({ items }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -70% 0px", threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  if (!items.length) return null;

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.history.replaceState(null, "", `#${id}`);
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav aria-label="Mundarija" className="text-[13.5px]">
      <p className="mb-3 flex items-center gap-2 font-heading text-[13px] font-bold uppercase tracking-wide text-slate-400">
        <List className="h-4 w-4" /> Mundarija
      </p>
      <ul className="space-y-1.5 border-l border-navy/10 dark:border-white/10">
        {items.map((it) => (
          <li key={it.id} style={{ paddingLeft: it.level === 3 ? 22 : 12 }}>
            <a
              href={`#${it.id}`}
              onClick={(e) => go(e, it.id)}
              className={`-ml-px block border-l-2 py-0.5 pl-3 transition-colors ${
                active === it.id
                  ? "border-azure font-semibold text-azure"
                  : "border-transparent text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
