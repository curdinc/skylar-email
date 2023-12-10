import type { SupportedEmailProviderType } from "../api/email-provider/oauth";

export const PROVIDER_INDEX =
  `++provider_id, &user_email_address, type` as const;

export type ProviderIndexType = {
  provider_id?: number;
  user_email_address: string;
  type: SupportedEmailProviderType;
};

export type ProviderType = ProviderIndexType & {
  created_at?: number;
  updated_at?: number;
  inbox_name: string;
  image_uri: string;
  refresh_token: string;
};

export type ProviderInfoType = Omit<ProviderType, "refresh_token">;
export type ProviderInsertType = Omit<
  ProviderType,
  "provider_id" | "created_at" | "updated_at"
>;
