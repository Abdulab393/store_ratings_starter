import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // This makes asset paths relative, which works on GitHub Pages
  plugins: [react()],
});
