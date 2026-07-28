import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    proxy: {
      // Forward API + uploaded-file requests to the Express backend.
      "/api": "http://localhost:4000",
    },
  },
  build: {
    // Bitta 533 KB'lik bundle o'rniga bo'laklarga bo'lamiz: bosh sahifa faqat
    // o'ziga kerakligini yuklaydi, qolgani keshda uzoq yashaydi (vendor
    // bo'laklari deploy'lar orasida o'zgarmaydi).
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils"))
            return "motion";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@tiptap") || id.includes("prosemirror") || id.includes("quill"))
            return "editor"; // faqat /admin
          if (
            id.includes("/react-router") ||
            id.includes("/react-dom/") ||
            id.includes("/react/") ||
            id.includes("/scheduler/")
          )
            return "react-vendor";
        },
      },
    },
  },
});
