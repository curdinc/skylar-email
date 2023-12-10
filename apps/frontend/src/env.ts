import {
  ClientEnvSchemaObject,
  createEnv,
  ServerEnvSchemaObject,
  SharedEnvSchemaObject,
} from "@skylar/parsers-and-types";

export const env = createEnv({
  shared: SharedEnvSchemaObject,
  server: ServerEnvSchemaObject,
  clientPrefix: "NEXT_PUBLIC_",
  client: ClientEnvSchemaObject,
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnvStrict: {
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
