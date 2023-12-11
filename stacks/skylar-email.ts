import { Api, NextjsSite, StackContext } from "sst/constructs";

export function SkylarEmailConstructs({ stack }: StackContext) {
  const backend = new Api(stack, "Api", {
    defaults: {
      function: {
        runtime: "nodejs20.x",
        environment: {
          FRONTEND_URL: process.env.FRONTEND_URL!,
          DATABASE_URL: process.env.DATABASE_URL!,
          NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN!,
          NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET!,
          AXIOM_ORG_ID: process.env.AXIOM_ORG_ID!,
          AXIOM_URL: process.env.AXIOM_URL!,
          GOOGLE_PROVIDER_CLIENT_SECRET:
            process.env.GOOGLE_PROVIDER_CLIENT_SECRET!,
          NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID:
            process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID!,
        },
      },
    },
    cors: {
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["*"],
      allowOrigins: [stack.stage === "prod" ? "https://curdinc.com" : "*"],
    },
    routes: {
      "ANY /{proxy+}": "./apps/backend/src/index.handler",
    },
  });
  console.log("backend.url", backend.url);
  const frontend = new NextjsSite(stack, "frontend", {
    path: "./apps/frontend",
    runtime: "nodejs20.x",
    dev: {
      url: "http://localhost:3000",
    },
    environment: {
      NEXT_PUBLIC_BACKEND_URL: `${backend.url}/trpc`,
      NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID:
        process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID!,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
      NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN!,
      NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET!,
    },
  });

  stack.addOutputs({
    BackendUrl: backend.url,
    FrontendUrl: frontend.url,
  });
}
