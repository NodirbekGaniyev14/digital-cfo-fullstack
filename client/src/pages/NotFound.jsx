import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/lib/seo";

// 404 — topilmagan sahifa.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-softbg dark:bg-[#070b16]">
      <Seo title="Sahifa topilmadi — Digital CFO" description="So'ralgan sahifa mavjud emas." />
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-heading text-[80px] font-extrabold leading-none text-navy/15 dark:text-white/15">
          404
        </p>
        <h1 className="mt-2 font-heading text-[26px] font-bold text-navy dark:text-white">
          Sahifa topilmadi
        </h1>
        <p className="mt-3 max-w-[420px] text-[15px] text-slate-500 dark:text-slate-400">
          Siz izlagan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-navy px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Bosh sahifa
          </Link>
          <Link
            to="/blog"
            className="rounded-xl border-[1.5px] border-navy/20 px-6 py-3 font-semibold text-navy transition-colors hover:border-navy dark:border-white/20 dark:text-white"
          >
            Maqolalar
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
