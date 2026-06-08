import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: resolve(__dirname, "examples/bla-bla/index.html"),
    },
  },
  resolve: {
    alias: {
      "@packages/cheapers": resolve(__dirname, "packages/cheapers/src"),
      "@examples": resolve(__dirname, "examples"),
    },
  },
});
