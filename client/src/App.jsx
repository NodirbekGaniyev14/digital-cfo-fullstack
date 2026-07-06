import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Home from "./pages/Home.jsx";
import ArticlesIndex from "./pages/ArticlesIndex.jsx";
import Article from "./pages/Article.jsx";
import NotFound from "./pages/NotFound.jsx";
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
              <Route path="*" element={<NotFound />} />
            </Routes>
            <TelegramFAB />
            <AIAssistant />
            <ContactModal />
            <Toaster position="top-center" richColors closeButton />
          </MotionConfig>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
