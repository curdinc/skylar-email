// Importing env files here to validate on build
import "@skylar/auth/env.mjs";

import { withLoggerForNextConfig } from "@skylar/logger";

import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@skylar/api", "@skylar/auth", "@skylar/db"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withLoggerForNextConfig(config);
