import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@Shared": path.resolve(__dirname, "./src/Shared"),
      "@Components": path.resolve(__dirname, "./src/Components"),
      "@Pages": path.resolve(__dirname, "./src/Pages"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
