import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  FileText,
  Activity,
  Phone,
  Star,
  Clock,
  Bot,
  Video,
  Bell,
  TrendingUp,
} from "lucide-react";
import { base44Client } from "@/api/base44Client";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useApp } from "@/lib/i18n";

// Namuna (ma'lumot kelmaguncha ko'rsatiladi)
const SAMPLE = {
  cards: [
    { label: "Foydalanuvchilar", value: "24", Icon: Users },
    { label: "Murojaatlar", value: "120", Icon: MessageSquare },
    { label: "Tahlillar", value: "86", Icon: FileText },
    { label: "Bugun faol", value: "7", Icon: Activity },
  ],
  bars: [
    { label: "Telefon ulashgan", pct: 72, color: "#3B82F6" },
    { label: "Premium", pct: 28, color: "#10B981" },
  ],
};

const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

function fmtTashkent(iso) {
  try {
    return new Date(iso).toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

export default function DashboardPreview() {
  const { t } = useApp();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(`${base44Client.baseURL}/stats`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => alive && d && d.updated_at && setStats(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const live = !!stats;
  const cardVals = live
    ? [stats.users, stats.visits, stats.reports, stats.today_active]
    : SAMPLE.cards.map((c) => c.value);
  const cards = [
    { label: t("db.users"), value: cardVals[0], Icon: Users },
    { label: t("db.visits"), value: cardVals[1], Icon: MessageSquare },
    { label: t("db.reports"), value: cardVals[2], Icon: FileText },
    { label: t("db.todayActive"), value: cardVals[3], Icon: Activity },
  ];
  const bars = [
    { label: t("db.phoneShared"), pct: live ? pct(stats.with_phone, stats.users) : SAMPLE.bars[0].pct, color: "#3B82F6" },
    { label: t("db.premiumUsers"), pct: live ? pct(stats.premium, stats.users) : SAMPLE.bars[1].pct, color: "#10B981" },
  ];

  // AI Sotuv agenti metrikalari (faqat bot yuborgan bo'lsa ko'rinadi)
  const agent = live && stats.agent ? stats.agent : null;
  const funnel = agent
    ? [
        { label: t("db.fStartPhone"), pct: agent.conversions?.start_phone ?? 0, color: "#3B82F6" },
        { label: t("db.fPhoneReport"), pct: agent.conversions?.phone_report ?? 0, color: "#8B5CF6" },
        { label: t("db.fReportPremium"), pct: agent.conversions?.report_premium ?? 0, color: "#10B981" },
      ]
    : [];
  const aiActivity = agent
    ? [
        { label: t("db.aConversations"), value: agent.today?.conversations ?? 0, Icon: MessageSquare },
        { label: t("db.aMessages"), value: agent.today?.messages ?? 0, Icon: Bot },
        { label: t("db.aVideos"), value: agent.today?.videos ?? 0, Icon: Video },
        { label: t("db.aReminders"), value: agent.today?.reminders ?? 0, Icon: Bell },
      ]
    : [];

  return (
    <section id="dashboard" className="bg-navy px-6 py-[90px]">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mb-11 max-w-[680px] text-center"
        >
          <div className="font-mono text-[13px] font-semibold uppercase tracking-[0.08em] text-emerald-300">
            {t("db.eyebrow")}
          </div>
          <h2 className="mt-3 font-heading text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em] text-white">
            {t("db.title")}
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-1.5 text-[12px] font-medium text-slate-300">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-400 pulse-dot" : "bg-slate-400"}`} />
            {live ? t("db.live") : t("db.sampleStatus")}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0b1220] shadow-[0_40px_80px_rgba(0,0,0,.4)]"
        >
          <div className="flex items-center gap-2.5 border-b border-white/[.07] bg-white/[.03] px-[18px] py-3.5">
            <span className="h-[11px] w-[11px] rounded-full bg-red-500" />
            <span className="h-[11px] w-[11px] rounded-full bg-amber-500" />
            <span className="h-[11px] w-[11px] rounded-full bg-emerald-500" />
            <div className="ml-2 flex-1 rounded-lg bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-500">
              digitalcfo.uz/dashboard
            </div>
          </div>

          <div className="p-[26px]">
            <div className="mb-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((s) => (
                <div key={s.label} className="rounded-[14px] border border-white/10 bg-white/[.04] p-[18px]">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[13px] text-slate-400">{s.label}</span>
                    <s.Icon className="h-[18px] w-[18px] text-azure" />
                  </div>
                  <div className="font-mono text-[28px] font-bold text-white">
                    <CountUp value={s.value} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Faollik darajasi */}
              <div className="rounded-[14px] border border-white/[.07] bg-white/[.03] p-5">
                <div className="mb-[18px] font-heading text-[15px] font-bold text-white">
                  {t("db.composition")}
                </div>
                <div className="flex flex-col gap-4">
                  {bars.map((b) => (
                    <div key={b.label}>
                      <div className="mb-1.5 flex justify-between text-[13px] text-slate-300">
                        <span>{b.label}</span>
                        <span className="font-mono" style={{ color: b.color }}>{b.pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-md bg-white/[.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-md"
                          style={{ background: b.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qisqacha ma'lumot */}
              <div className="rounded-[14px] border border-white/[.07] bg-white/[.03] p-5">
                <div className="mb-[18px] font-heading text-[15px] font-bold text-white">
                  {t("db.brief")}
                </div>
                <div className="flex flex-col gap-3.5">
                  <Row Icon={Phone} bg="bg-azure/15" color="text-azure"
                    text={t("db.phoneShared")} value={live ? stats.with_phone : 18} />
                  <Row Icon={Star} bg="bg-amber-500/15" color="text-amber-400"
                    text={t("db.premiumUsers")} value={live ? stats.premium : 5} />
                  <Row Icon={FileText} bg="bg-emerald-500/15" color="text-emerald-500"
                    text={t("db.totalReports")} value={live ? stats.reports : 86} />
                  <div className="mt-1 flex items-center gap-1.5 border-t border-white/[.07] pt-3 font-mono text-[11.5px] text-slate-500">
                    <Clock className="h-[13px] w-[13px]" />
                    {live
                      ? `${t("db.lastUpdate")}: ${fmtTashkent(stats.updated_at)} (GMT+5)`
                      : t("db.updatedDaily")}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Sotuv agenti — voronka konversiyalari + bugungi faollik */}
            {agent && (
              <div className="mt-6 rounded-[14px] border border-emerald-400/15 bg-emerald-400/[.03] p-5">
                <div className="mb-[18px] flex items-center gap-2">
                  <Bot className="h-[18px] w-[18px] text-emerald-400" />
                  <span className="font-heading text-[15px] font-bold text-white">
                    {t("db.agent")}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-300">
                    <TrendingUp className="h-[13px] w-[13px]" /> {t("db.funnel")}
                  </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Voronka konversiyalari */}
                  <div className="flex flex-col gap-4">
                    {funnel.map((f) => (
                      <div key={f.label}>
                        <div className="mb-1.5 flex justify-between text-[13px] text-slate-300">
                          <span>{f.label}</span>
                          <span className="font-mono" style={{ color: f.color }}>{f.pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-md bg-white/[.06]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${f.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-md"
                            style={{ background: f.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bugungi AI faolligi */}
                  <div className="grid grid-cols-2 gap-3">
                    {aiActivity.map((s) => (
                      <div key={s.label} className="rounded-[12px] border border-white/10 bg-white/[.04] p-3.5">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[12px] text-slate-400">{s.label}</span>
                          <s.Icon className="h-[15px] w-[15px] text-emerald-400/80" />
                        </div>
                        <div className="font-mono text-[22px] font-bold text-white">
                          <CountUp value={s.value} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ Icon, bg, color, text, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] ${bg} ${color}`}>
        <Icon className="h-[17px] w-[17px]" />
      </div>
      <span className="flex-1 text-[13.5px] text-slate-300">{text}</span>
      <span className="font-mono text-[15px] font-bold text-white">
        <CountUp value={value} />
      </span>
    </div>
  );
}

// Ko'rinishga kelganda 0 dan qiymatgacha sanab ko'tariladigan raqam.
function CountUp({ value }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = Number(value) || 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1100;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{Number(n).toLocaleString("uz-UZ")}</span>;
}
