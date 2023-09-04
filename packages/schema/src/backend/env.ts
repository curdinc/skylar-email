import type { Output } from "valibot";
import { object, string } from "valibot";

export const BackendEnvSchema = object({
  APP_URL: string(),
  SUPABASE_JWT_SECRET: string(),
  DATABASE_URL: string(),
  AXIOM_TOKEN: string(),
  AXIOM_DATASET: string(),
  AXIOM_ORG_ID: string(),
  AXIOM_URL: string(),
});

export type BackendEnvType = Output<typeof BackendEnvSchema>;
