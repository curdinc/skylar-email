import type { Output } from "valibot";
import { object, string } from "valibot";

export const BackendEnvSchema = object({
  APP_URL: string(),
  SUPABASE_JWT_SECRET: string(),
  SUPABASE_ANON_KEY: string(),
  SUPABASE_URL: string(),
  DATABASE_URL: string(),
  AXIOM_TOKEN: string(),
  AXIOM_DATASET: string(),
  AXIOM_ORG_ID: string(),
  AXIOM_URL: string(),
  GOOGLE_PROVIDER_CLIENT_SECRET: string(),
  GOOGLE_PROVIDER_CLIENT_ID: string(),
});

export type BackendEnvType = Output<typeof BackendEnvSchema>;
