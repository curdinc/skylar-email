import { withAxiom } from "next-axiom";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@skylar/client-db",
    "@skylar/logic",
    "@skylar/logger",
    "@skylar/parsers-and-types",
    "@skylar/tinykeys",
    "@skylar/trpc-web-workers"
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return Promise.resolve([
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
      },
    ]);
  },
};

export default withAxiom(config);
