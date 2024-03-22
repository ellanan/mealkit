import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import vercel from "vite-plugin-vercel";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [vercel(), react(), svgr()],
  };
});
