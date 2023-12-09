import type { SupportedEmailProviderType } from "../..";

export const PROVIDER_INDEX = `++provider_id, &email, provider_type` as const;

type ProviderIndexType = {
  provider_id?: number;
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

export type ProviderInfoType = Omit<ProviderType, "refresh_token">;
export type ProviderInsertType = Omit<
  ProviderType,
  "provider_id" | "created_at" | "updated_at"
>;
