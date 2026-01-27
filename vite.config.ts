import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8081,
    fs: {
      allow: [".", "./client"],
      deny: [".env.local", ".env.local.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  preview: {
    allowedHosts: "all",
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
}));
