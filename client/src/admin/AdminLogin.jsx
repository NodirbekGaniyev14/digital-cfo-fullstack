import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import { login, auth } from "@/lib/api";

// /admin/login — admin kirishi.
export default function AdminLogin() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { token } = await login(username.trim(), password);
      auth.set(token);
      toast.success("Xush kelibsiz!");
      nav("/admin", { replace: true });
    } catch (err) {
      toast.error(err.message || "Kirib bo'lmadi");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-softbg px-6 dark:bg-[#070b16]">
      <form
        onSubmit={submit}
        className="w-full max-w-[380px] rounded-2xl border border-navy/[.08] bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,.1)] dark:border-white/[.08] dark:bg-[#0d182b]"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-emerald-400">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-[20px] font-bold text-navy dark:text-white">
            Admin panel
          </h1>
          <p className="mt-1 text-[13.5px] text-slate-400">Digital CFO — maqolalar boshqaruvi</p>
        </div>

        <label className="mb-1.5 block text-[13.5px] font-medium text-slate-600 dark:text-slate-300">Login</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mb-4 w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[15px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
          placeholder="admin"
        />

        <label className="mb-1.5 block text-[13.5px] font-medium text-slate-600 dark:text-slate-300">Parol</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mb-6 w-full rounded-xl border border-navy/15 bg-transparent px-4 py-2.5 text-[15px] outline-none focus:border-azure dark:border-white/15 dark:text-white"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kirish"}
        </button>
      </form>
    </div>
  );
}
