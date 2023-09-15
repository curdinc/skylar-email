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
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
