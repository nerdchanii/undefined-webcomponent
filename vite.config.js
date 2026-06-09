import { resolve } from "path";
import { defineConfig } from "vite";

const exampleRoot = resolve(__dirname, "examples/bla-bla");

export default defineConfig({
  root: exampleRoot,
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@packages/cheapers",
  },
  build: {
    outDir: resolve(__dirname, "dist/examples/bla-bla"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(exampleRoot, "index.html"),
    },
  },
  resolve: {
    alias: {
      "@packages/cheapers": resolve(__dirname, "packages/cheapers/src"),
      "@examples": resolve(__dirname, "examples"),
    },
  },
});
