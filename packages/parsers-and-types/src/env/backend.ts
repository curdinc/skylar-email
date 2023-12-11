import type { Output } from "valibot";
import { object, string } from "valibot";

export const BackendEnvSchema = object({
  FRONTEND_URL: string(),
  DATABASE_URL: string(),
  NEXT_PUBLIC_AXIOM_TOKEN: string(),
  NEXT_PUBLIC_AXIOM_DATASET: string(),
  AXIOM_ORG_ID: string(),
  AXIOM_URL: string(),
  GOOGLE_PROVIDER_CLIENT_SECRET: string(),
  NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID: string(),
});

export type BackendEnvType = Output<typeof BackendEnvSchema>;
