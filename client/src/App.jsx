import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Home from "./pages/Home.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import TelegramFAB from "./components/TelegramFAB.jsx";
import AIAssistant from "./components/AIAssistant.jsx";

// Single route "/" -> Home. All navigation is in-page anchor scrolling.
// MotionConfig reducedMotion="user" — animatsiyalar OS sozlamasiga bo'ysunadi.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Home />
      <TelegramFAB />
      <AIAssistant />
      <Toaster position="top-center" richColors closeButton />
    </MotionConfig>
  );
}
