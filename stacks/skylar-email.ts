import { Api, NextjsSite, StackContext } from "sst/constructs";

const BASE_CUSTOM_DOMAIN = "curdinc.com";

export function SkylarEmailConstructs({ stack }: StackContext) {
  stack.addDefaultFunctionEnv({
    NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN!,
    NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET!,
    NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID!,
  });

  const backendCustomDomain = `api.${BASE_CUSTOM_DOMAIN}`;
  const backendPreviewCustomDomain = `${stack.stage}.${backendCustomDomain}`;
  const frontendCustomDomainAlias = `www.${BASE_CUSTOM_DOMAIN}`;
  const frontendPreviewCustomDomain = `${stack.stage}.${BASE_CUSTOM_DOMAIN}`;
  const frontendPreviewCustomDomainWithProtocol = `https://${frontendPreviewCustomDomain}`;

  const backend = new Api(stack, "Api", {
    defaults: {
      function: {
        runtime: "nodejs20.x",
        environment: {
          FRONTEND_URL: frontendPreviewCustomDomainWithProtocol,
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
          ? backendCustomDomain
          : backendPreviewCustomDomain,
      hostedZone: BASE_CUSTOM_DOMAIN,
    },
    cors: {
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["*"],
      allowOrigins: [
        stack.stage === "prod"
          ? `https://${BASE_CUSTOM_DOMAIN}`
          : frontendPreviewCustomDomainWithProtocol,
      ],
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
          : frontendPreviewCustomDomain,
      hostedZone: BASE_CUSTOM_DOMAIN,
      domainAlias:
        stack.stage === "prod" ? frontendCustomDomainAlias : undefined,
    },
    warm: 15,
    environment: {
      NEXT_PUBLIC_BACKEND_URL: backend.customDomainUrl ?? backend.url,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    },
  });

  stack.addOutputs({
    BackendUrl: backend.customDomainUrl ?? backend.url,
    FrontendUrl: frontend.customDomainUrl ?? frontend.url,
  });
}
