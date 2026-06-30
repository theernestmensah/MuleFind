import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

const productPages = {
  dailyRunnerRotation: resolve(root, "products/daily-runner-rotation.html"),
  heavyweightFleeceHoodies: resolve(root, "products/heavyweight-fleece-hoodies.html"),
  cleanGraphicTeePack: resolve(root, "products/clean-graphic-tee-pack.html"),
  twoPieceTracksuitFinds: resolve(root, "products/two-piece-tracksuit-finds.html"),
  relaxedCargoDenimBoard: resolve(root, "products/relaxed-cargo-denim-board.html"),
  crossbodyTravelBags: resolve(root, "products/crossbody-travel-bags.html"),
  miniSpeakerDeskGadgets: resolve(root, "products/mini-speaker-desk-gadgets.html"),
  footballJerseyDirectory: resolve(root, "products/football-jersey-directory.html"),
};

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
        ...productPages,
      },
    },
  },
});
