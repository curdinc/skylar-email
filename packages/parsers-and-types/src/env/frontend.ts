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
  NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID: string(),
  NEXT_PUBLIC_POSTHOG_KEY: string(),
};

export const ServerEnvSchemaObject = {};

export const SharedEnvSchemaObject = {
  VERCEL_URL: transform(optional(string()), (v) => {
    return v ? `https://${v}` : undefined;
  }),
  PORT: withDefault(
    coerce(number(), (raw) => Number(raw)),
    3000,
  ),
};
