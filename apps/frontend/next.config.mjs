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
  async headers() {
    return Promise.resolve([
      {
        // matching all routes. This is set to prevent site.webmanifest from throwing a CORS error
        source: "/site.webmanifest",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*.curdinc.com" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
        ],
      },
    ]);
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // eslint-disable-next-line @typescript-eslint/require-await
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
      },
    ];
  },
};

export default withAxiom(config);
