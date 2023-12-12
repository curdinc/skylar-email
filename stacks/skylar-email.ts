import { Api, NextjsSite, StackContext } from "sst/constructs";

const BASE_CUSTOM_DOMAIN = "curdinc.com";

export function SkylarEmailConstructs({ stack }: StackContext) {
  stack.addDefaultFunctionEnv({
    NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN!,
    NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET!,
    NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID!,
  });

  const backend = new Api(stack, "Api", {
    defaults: {
      function: {
        runtime: "nodejs20.x",
        environment: {
          FRONTEND_URL: `${stack.stage}.${BASE_CUSTOM_DOMAIN}`,
          DATABASE_URL: process.env.DATABASE_URL!,
          GOOGLE_PROVIDER_CLIENT_SECRET:
            process.env.GOOGLE_PROVIDER_CLIENT_SECRET!,
          AXIOM_ORG_ID: process.env.AXIOM_ORG_ID!,
          AXIOM_URL: process.env.AXIOM_URL!,
        },
      },
    },
    customDomain: {
      domainName:
        stack.stage === "prod"
          ? `api.${BASE_CUSTOM_DOMAIN}`
          : `${stack.stage}-api.${BASE_CUSTOM_DOMAIN}`,
      hostedZone: BASE_CUSTOM_DOMAIN,
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

  const frontend = new NextjsSite(stack, "frontend", {
    path: "./apps/frontend",
    runtime: "nodejs20.x",
    dev: {
      url: "http://localhost:3000",
    },
    customDomain: {
      domainName:
        stack.stage === "prod"
          ? BASE_CUSTOM_DOMAIN
          : `${stack.stage}.${BASE_CUSTOM_DOMAIN}`,
      hostedZone: BASE_CUSTOM_DOMAIN,
      domainAlias:
        stack.stage === "prod" ? `www.${BASE_CUSTOM_DOMAIN}` : undefined,
    },
    warm: 15,
    environment: {
      NEXT_PUBLIC_BACKEND_URL: backend.url,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    },
  });

  stack.addOutputs({
    BackendUrl: backend.customDomainUrl ?? backend.url,
    FrontendUrl: frontend.customDomainUrl ?? frontend.url,
  });
}
