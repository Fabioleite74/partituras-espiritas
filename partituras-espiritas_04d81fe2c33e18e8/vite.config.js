import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const vendorChunks = {
  "vendor-react": ["react", "react-dom", "react-router", "react-router-dom", "react-hot-toast", "scheduler", "goober"],
  "vendor-firebase": ["firebase", "@firebase"],
  "vendor-icons": ["lucide-react"],
  "vendor-motion": ["framer-motion", "motion-dom", "motion-utils"],
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const match = id.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
          if (!match) return;
          const pkg = match[1];
          for (const [chunk, pkgs] of Object.entries(vendorChunks)) {
            if (pkgs.some((p) => pkg === p || pkg.startsWith(p + "/"))) return chunk;
          }
        },
      },
    },
  },
});
