import type {
  ProviderInsertType,
  ProviderType,
} from "@skylar/parsers-and-types";

import { clientDb } from "../db";

export async function putProvider({
  provider,
}: {
  provider: ProviderInsertType;
}) {
  console.log("put provider", provider);
  const updatedProvider: ProviderType = {
    ...provider,
    updated_at: Date.now(),
    created_at: Date.now(),
  };

  const existingProvider = await clientDb.provider.get(provider.email);

  if (existingProvider) {
    updatedProvider.created_at = existingProvider.created_at;
  }

  await clientDb.provider.put(updatedProvider);
}
