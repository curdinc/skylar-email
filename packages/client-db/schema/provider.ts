import type { SupportedEmailProviderType } from "@skylar/parsers-and-types";

export type ProviderIndexType = {
  email: string;
  created_at?: number;
  updated_at?: number;
};

export type ProviderType = ProviderIndexType & {
  email_provider: SupportedEmailProviderType;
  inbox_name: string;
  image_uri: string;
  refresh_token: string;
};

export const PROVIDER_INDEX = `&email, created_at` as const;
