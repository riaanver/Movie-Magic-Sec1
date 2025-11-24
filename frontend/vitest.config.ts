import { defineConfig } from "vitest/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      // Needed because @testing-library/jest-dom imports the bare module specifier
      // "lodash/isEqualWith" which lacks an extension under Node's ESM resolution.
      "lodash/isEqualWith": resolve(__dirname, "node_modules/lodash/isEqualWith.js")
    }
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
});
