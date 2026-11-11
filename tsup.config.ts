import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    http: "src/http.ts",
  },
  format: ["esm"],
  target: "node22",
  platform: "node",
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
