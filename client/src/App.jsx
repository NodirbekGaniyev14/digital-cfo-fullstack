import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Home from "./pages/Home.jsx";
import ArticlesIndex from "./pages/ArticlesIndex.jsx";
import Article from "./pages/Article.jsx";
import NotFound from "./pages/NotFound.jsx";

// Admin panel — faqat kerak bo'lganda yuklanadi (Quill public bundle'ga tushmaydi).
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));
import ScrollProgress from "./components/ScrollProgress.jsx";
import TelegramFAB from "./components/TelegramFAB.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import ContactModal from "./components/ContactModal.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AppProvider } from "./lib/i18n.jsx";

// Route almashganda: hash bo'lsa — o'sha bo'limga scroll; aks holda tepaga.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Sayt tashriflari analitikasi: har route almashganda public sahifa ko'rishini
// serverga xabar qiladi (admin sahifalar hisoblanmaydi). Xato foydalanuvchini buzmaydi.
function PageTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    try {
      const body = JSON.stringify({ path: pathname });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
      }
    } catch { /* analitika jim ishlaydi */ }
  }, [pathname]);
  return null;
}

// Eski /article/:slug -> /blog/:slug (slug saqlanadi).
function RedirectToBlog() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
}

// Public elementlar (FAB, chatbot, kontakt modal) — admin sahifalarida ko'rinmasin.
function PublicChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <div className="print:hidden">
      <TelegramFAB />
      <AIAssistant />
      <ContactModal />
    </div>
  );
}

// Routing: "/" bosh sahifa, "/maqolalar" ro'yxat, "/article/:slug" maqola.
// ErrorBoundary — istalgan komponent xatosi "oq ekran" o'rniga do'stona sahifa.
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <MotionConfig reducedMotion="user">
            <ScrollManager />
            <PageTracker />
            <div className="print:hidden"><ScrollProgress /></div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<ArticlesIndex />} />
              <Route path="/blog/:slug" element={<Article />} />
              {/* Eski URL'lar -> yangi (/blog) */}
              <Route path="/maqolalar" element={<Navigate to="/blog" replace />} />
              <Route path="/article/:slug" element={<RedirectToBlog />} />
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={null}>
                    <AdminApp />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PublicChrome />
            <Toaster position="top-center" richColors closeButton />
          </MotionConfig>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
