import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  noExternal: ["@hono/trpc-server", "hono", "@skylar/api"],
  sourcemap: true,
});
