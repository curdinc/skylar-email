// Importing env files here to validate on build
import "@skylar/auth/env.mjs";

import { withAxiom } from "next-axiom";

import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@skylar/api",
    "@skylar/auth",
    "@skylar/db",
    "@skylar/logger",
    "@skylar/schema",
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withAxiom(config);
