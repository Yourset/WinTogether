import { cp, rm } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));
const memoryTemplatesPlugin = {
  name: "copy-win-memory-templates",
  apply: "build" as const,
  async closeBundle() {
    const source = fileURLToPath(new URL("./WIN_MEMORY", import.meta.url));
    const target = fileURLToPath(new URL("./out/WIN_MEMORY", import.meta.url));

    await rm(target, { recursive: true, force: true });
    await cp(source, target, { recursive: true });
  }
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), memoryTemplatesPlugin],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
  },
});
