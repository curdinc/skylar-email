import type { ProviderType } from "../../schema/provider";
import { clientDb } from "../db";

export async function putProvider({
  provider,
}: {
  provider: Omit<ProviderType, "created_at" | "updated_at">;
}) {
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
