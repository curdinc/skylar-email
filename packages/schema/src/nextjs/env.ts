import {
  coerce,
  number,
  optional,
  string,
  transform,
  url,
  withDefault,
} from "valibot";

export const ClientEnvSchemaObject = {
  NEXT_PUBLIC_BACKEND_URL: string([url()]),
  NEXT_PUBLIC_SUPABASE_URL: string([url()]),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string(),
};

export const ServerEnvSchemaObject = {
  SUPABASE_JWT_SECRET: string(),
};

export const SharedEnvSchemaObject = {
  VERCEL_URL: transform(optional(string()), (v) => {
    return v ? `https://${v}` : undefined;
  }),
  PORT: withDefault(
    coerce(number(), (raw) => Number(raw)),
    3000,
  ),
};
