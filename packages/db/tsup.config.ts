import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/types/index.ts",
    "src/validators/index.ts",
    "src/schema/index.ts",
  ],
  format: ["esm", "cjs"],
  dts: {
    entry: {
      "index": "src/index.ts",
      "types/index": "src/types/index.ts",
      "schema/index": "src/schema/index.ts",
      "validators/index": "src/validators/index.ts"
    }
  },
  splitting: false,
  sourcemap: true,
  clean: true,
}); 