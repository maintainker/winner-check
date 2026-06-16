import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@Shared": path.resolve(__dirname, "./src/Shared"),
      "@Components": path.resolve(__dirname, "./src/Components"),
      "@Pages": path.resolve(__dirname, "./src/Pages"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
