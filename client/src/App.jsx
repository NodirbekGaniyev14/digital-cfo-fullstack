import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

// Public elementlar (FAB, chatbot, kontakt modal) — admin sahifalarida ko'rinmasin.
function PublicChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <TelegramFAB />
      <AIAssistant />
      <ContactModal />
    </>
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
            <ScrollProgress />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/maqolalar" element={<ArticlesIndex />} />
              <Route path="/article/:slug" element={<Article />} />
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
