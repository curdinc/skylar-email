import type {
  ProviderInsertType,
  ProviderType,
} from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { ACCESS_TOKEN_EXPIRY_MILLIS } from "./constants";

export async function putProvider({
  provider,
}: {
  provider: ProviderInsertType;
}) {
  const existingProvider = await clientDb.provider.get({
    user_email_address: provider.user_email_address,
  });

  const updatedProvider: ProviderType = {
    ...provider,
    updated_at: Date.now(),
    created_at: Date.now(),
    provider_id: existingProvider?.provider_id,
    access_token_expires_at: Date.now() + ACCESS_TOKEN_EXPIRY_MILLIS,
  };

  if (existingProvider) {
    updatedProvider.created_at = existingProvider.created_at;
  }

  await clientDb.provider.put(updatedProvider);
}
