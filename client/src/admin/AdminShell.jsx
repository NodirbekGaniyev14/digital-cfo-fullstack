import { Link, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, LogOut, ExternalLink, FileText, Image, LayoutDashboard, FolderTree, Rocket } from "lucide-react";
import { auth } from "@/lib/api";

// Admin sahifalari uchun umumiy header + konteyner.
export default function AdminShell({ children }) {
  const nav = useNavigate();
  const logout = () => {
    auth.clear();
    nav("/admin/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-softbg dark:bg-[#0a0e1a]">
      <header className="sticky top-0 z-50 border-b border-navy/[.08] bg-white/90 backdrop-blur-xl dark:border-white/[.08] dark:bg-[#0c111f]/90">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-3">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-navy text-emerald-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="font-heading text-[17px] font-bold text-navy dark:text-white">
              Admin <span className="text-azure">panel</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <ShellLink to="/admin" end icon={LayoutDashboard}>Dashboard</ShellLink>
            <ShellLink to="/admin/articles" icon={FileText}>Maqolalar</ShellLink>
            <ShellLink to="/admin/categories" icon={FolderTree}>Kategoriyalar</ShellLink>
            <ShellLink to="/admin/autopilot" icon={Rocket}>Avtopilot</ShellLink>
            <ShellLink to="/admin/media" icon={Image}>Media</ShellLink>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/blog"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-slate-500 transition-colors hover:text-navy dark:text-slate-300 dark:hover:text-white"
            >
              <ExternalLink className="h-4 w-4" /> Saytda ko'rish
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-navy/15 px-3 py-2 text-[13.5px] font-medium text-slate-600 transition-colors hover:border-red-400 hover:text-red-500 dark:border-white/15 dark:text-slate-300"
            >
              <LogOut className="h-4 w-4" /> Chiqish
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-5 py-8">{children}</main>
    </div>
  );
}

function ShellLink({ to, end, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-semibold transition-colors ${
          isActive
            ? "bg-navy/[.06] text-navy dark:bg-white/[.08] dark:text-white"
            : "text-slate-500 hover:text-navy dark:text-slate-300 dark:hover:text-white"
        }`
      }
    >
      <Icon className="h-4 w-4" /> {children}
    </NavLink>
  );
}
