import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2, FileText, CheckCircle2, FileEdit, Eye, Mail, Image, Clock,
  Plus, TrendingUp,
} from "lucide-react";
import AdminShell from "./AdminShell";
import { adminStats } from "@/lib/api";
import { formatDateUz } from "@/data/articles";

// /admin — statistika boshqaruv paneli.
export default function AdminDashboard() {
  const [s, setS] = useState(null);

  useEffect(() => {
    adminStats().then(setS).catch((e) => { toast.error(e.message); setS({}); });
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
