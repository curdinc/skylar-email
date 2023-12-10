import { withAxiom } from "next-axiom";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@skylar/logic",
    "@skylar/logger",
    "@skylar/parsers-and-types",
    "@skylar/tinykeys",
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default withAxiom(config);
