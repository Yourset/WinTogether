import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const rendererRoot = fileURLToPath(new URL("./src/renderer", import.meta.url));

export default defineConfig(({ mode }) => {
  const isTestMode = mode === "test";

  return {
    plugins: [react()],
    test: {
      exclude: ["tests/e2e/**", "node_modules/**", "out/**"]
    },
    ...(isTestMode
      ? {}
      : {
          root: rendererRoot,
          server: {
            host: "127.0.0.1",
            port: 5173,
            strictPort: true,
            fs: {
              allow: [projectRoot]
            }
          }
        }),
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  };
});
