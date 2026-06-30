import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        products: resolve(root, "products.html"),
        spreadsheet: resolve(root, "spreadsheet.html"),
        guide: resolve(root, "guide.html"),
        agents: resolve(root, "agents.html"),
        faq: resolve(root, "faq.html"),
        mulebuySpreadsheet: resolve(root, "mulebuy-spreadsheet.html"),
      },
    },
  },
});
