import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: "./src/index.ts",
      name: "Frontify",
      fileName: "frontify",
    },
  },
  plugins: [dts()],
});
