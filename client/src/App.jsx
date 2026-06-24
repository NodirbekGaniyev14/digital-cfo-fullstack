import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Home from "./pages/Home.jsx";

// Single route "/" -> Home. All navigation is in-page anchor scrolling.
// MotionConfig reducedMotion="user" — animatsiyalar OS sozlamasiga bo'ysunadi.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Home />
      <Toaster position="bottom-right" richColors closeButton />
    </MotionConfig>
  );
}
