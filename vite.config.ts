import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 10888,
  },
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
  ],
  esbuild: {
    loader: "tsx",
    include: /.*\.jsx?$|.*\.tsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".tsx": "tsx",
      },
    },
  },
});
