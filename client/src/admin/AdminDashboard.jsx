import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2, FileText, CheckCircle2, FileEdit, Eye, Mail, Image, Clock,
  Plus, TrendingUp, Users, BarChart3, MousePointerClick,
} from "lucide-react";
import AdminShell from "./AdminShell";
import { adminStats, adminAnalytics } from "@/lib/api";
import { formatDateUz } from "@/data/articles";

// /admin — statistika boshqaruv paneli.
export default function AdminDashboard() {
  const [s, setS] = useState(null);
  const [a, setA] = useState(null);

  useEffect(() => {
    adminStats().then(setS).catch((e) => { toast.error(e.message); setS({}); });
    adminAnalytics(30).then(setA).catch(() => setA({}));
  }, []);

  if (!s) {
    return (
      <AdminShell>
        <div className="flex justify-center py-24 text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      </AdminShell>
    );
  }

  const cards = [
    { label: "Jami maqolalar", value: s.total || 0, Icon: FileText, color: "text-azure" },
    { label: "Chop etilgan", value: s.published || 0, Icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Qoralama", value: s.draft || 0, Icon: FileEdit, color: "text-amber-500" },
    { label: "Jami ko'rishlar", value: s.views || 0, Icon: Eye, color: "text-violet-500" },
    { label: "Obunachilar", value: s.subscribers || 0, Icon: Mail, color: "text-cyan-500" },
    { label: "Media fayllar", value: s.media || 0, Icon: Image, color: "text-slate-500" },
  ];

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-navy dark:text-white">Boshqaruv paneli</h1>
          <p className="text-[14px] text-slate-400">Umumiy ko'rsatkichlar</p>
        </div>
        <Link to="/admin/articles/new" className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5">
          <Plus className="h-[18px] w-[18px]" /> Yangi maqola
        </Link>
      </div>

      {/* Stat kartalar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
            <c.Icon className={`mb-3 h-6 w-6 ${c.color}`} />
            <p className="font-heading text-[26px] font-extrabold text-navy dark:text-white">{c.value}</p>
            <p className="text-[12.5px] text-slate-400">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Sayt tashriflari analitikasi */}
      <AnalyticsBlock a={a} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Top maqolalar (views) */}
        <Panel title="Ommabop maqolalar" icon={TrendingUp}>
          {s.top?.length ? (
            <ol className="space-y-1">
              {s.top.map((a, i) => (
                <li key={a.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-navy/[.03] dark:hover:bg-white/[.03]">
                  <span className="w-5 flex-none text-center font-heading text-[14px] font-bold text-slate-300">{i + 1}</span>
                  <Link to={`/admin/articles/${a.id}/edit`} className="flex-1 truncate text-[14px] font-medium text-navy hover:text-azure dark:text-white">{a.title}</Link>
                  <span className="flex flex-none items-center gap-1 text-[12.5px] text-slate-400"><Eye className="h-3.5 w-3.5" /> {a.views}</span>
                </li>
              ))}
            </ol>
          ) : <Empty />}
        </Panel>

        {/* Eng yangi maqolalar */}
        <Panel title="Eng yangi maqolalar" icon={Clock}>
          {s.newest?.length ? (
            <ul className="space-y-1">
              {s.newest.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-navy/[.03] dark:hover:bg-white/[.03]">
                  <Link to={`/admin/articles/${a.id}/edit`} className="flex-1 truncate text-[14px] font-medium text-navy hover:text-azure dark:text-white">{a.title}</Link>
                  <StatusDot status={a.status} />
                  <span className="flex-none text-[12px] text-slate-400">{formatDateUz(a.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : <Empty />}
        </Panel>
      </div>
    </AdminShell>
  );
}

// Sayt tashriflari: bugungi/oylik tashrifchi + ko'rishlar, 30 kunlik grafik, top sahifalar.
function AnalyticsBlock({ a }) {
  if (!a) {
    return (
      <div className="mt-6 flex justify-center rounded-2xl border border-navy/[.08] bg-white py-10 dark:border-white/[.08] dark:bg-[#141b2e]">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }
  const series = a.series || [];
  const maxV = Math.max(1, ...series.map((d) => d.views || 0));
  const tiles = [
    { label: "Bugun tashrifchi", value: a.todayVisitors || 0, Icon: Users, color: "text-azure" },
    { label: "Bugun ko'rishlar", value: a.todayViews || 0, Icon: MousePointerClick, color: "text-emerald-500" },
    { label: `${a.days || 30} kun tashrifchi`, value: a.rangeVisitors || 0, Icon: Users, color: "text-violet-500" },
    { label: "Jami ko'rishlar", value: a.totalViews || 0, Icon: BarChart3, color: "text-cyan-500" },
  ];
  return (
    <div className="mt-6 rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
      <h2 className="mb-4 flex items-center gap-2 font-heading text-[15px] font-bold text-navy dark:text-white">
        <BarChart3 className="h-4 w-4 text-azure" /> Sayt tashriflari
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-navy/[.06] p-4 dark:border-white/[.06]">
            <t.Icon className={`mb-2 h-5 w-5 ${t.color}`} />
            <p className="font-heading text-[22px] font-extrabold text-navy dark:text-white">{t.value.toLocaleString("uz")}</p>
            <p className="text-[12px] text-slate-400">{t.label}</p>
          </div>
        ))}
      </div>

      {/* 30 kunlik grafik */}
      {series.length > 0 ? (
        <div className="mt-5">
          <p className="mb-2 text-[12.5px] font-medium text-slate-500 dark:text-slate-400">Kunlik ko'rishlar ({a.days} kun)</p>
          <div className="flex h-28 items-end gap-[3px]">
            {series.map((d) => (
              <div key={d.ymd} className="group relative flex-1" title={`${d.ymd}: ${d.views} ko'rish, ${d.visitors} tashrifchi`}>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-azure to-emerald-400 transition-opacity hover:opacity-80"
                  style={{ height: `${Math.max(4, ((d.views || 0) / maxV) * 100)}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-navy/[.03] px-4 py-6 text-center text-[13px] text-slate-400 dark:bg-white/[.03]">
          Hali tashrif ma'lumoti yo'q. Saytga tashriflar kela boshlagach, bu yerda dinamika ko'rinadi.
        </p>
      )}

      {/* Top sahifalar */}
      {a.topPages?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[12.5px] font-medium text-slate-500 dark:text-slate-400">Eng ko'p ochilgan sahifalar</p>
          <ul className="space-y-0.5">
            {a.topPages.slice(0, 6).map((p) => (
              <li key={p.path} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-[13px] hover:bg-navy/[.03] dark:hover:bg-white/[.03]">
                <span className="flex-1 truncate font-mono text-[12.5px] text-slate-600 dark:text-slate-300">{p.path}</span>
                <span className="flex-none text-slate-400">{p.views.toLocaleString("uz")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-navy/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-[#141b2e]">
      <h2 className="mb-3 flex items-center gap-2 font-heading text-[15px] font-bold text-navy dark:text-white">
        <Icon className="h-4 w-4 text-azure" /> {title}
      </h2>
      {children}
    </div>
  );
}

function StatusDot({ status }) {
  const map = {
    published: "bg-emerald-500", draft: "bg-amber-500",
    scheduled: "bg-azure", archived: "bg-slate-400",
  };
  return <span className={`h-2 w-2 flex-none rounded-full ${map[status] || "bg-slate-400"}`} title={status} />;
}

function Empty() {
  return <p className="px-2 py-4 text-[13px] text-slate-400">Hozircha ma'lumot yo'q.</p>;
}
