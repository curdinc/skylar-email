import { NextjsSite, StackContext } from "sst/constructs";

export function Frontend({ stack }: StackContext) {
  const site = new NextjsSite(stack, "frontend", {
    path: "./apps/frontend",
    runtime: "nodejs20.x",
    environment: {
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID:
        process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
