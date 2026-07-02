import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Home from "./pages/Home.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import TelegramFAB from "./components/TelegramFAB.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import ContactModal from "./components/ContactModal.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AppProvider } from "./lib/i18n.jsx";

// Single route "/" -> Home. All navigation is in-page anchor scrolling.
// MotionConfig reducedMotion="user" — animatsiyalar OS sozlamasiga bo'ysunadi.
// ErrorBoundary — istalgan komponent xatosi "oq ekran" o'rniga do'stona sahifa.
export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
      <MotionConfig reducedMotion="user">
        <ScrollProgress />
        <Home />
        <TelegramFAB />
        <AIAssistant />
        <ContactModal />
        <Toaster position="top-center" richColors closeButton />
      </MotionConfig>
      </AppProvider>
    </ErrorBoundary>
  );
}
