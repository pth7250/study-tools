import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const pagesDirectory = resolve(projectRoot, "src/pages");
const pages = Object.fromEntries(
  readdirSync(pagesDirectory)
    .filter((file) => file.endsWith(".html"))
    .map((file) => [file.replace(".html", ""), resolve(pagesDirectory, file)])
);

export default defineConfig({
  root: pagesDirectory,
  publicDir: resolve(projectRoot, "public"),
  base: "/study-tools/",
  build: {
    outDir: resolve(projectRoot, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: pages
    }
  },
  test: {
    root: projectRoot,
    include: ["tests/**/*.test.js"]
  }
});
