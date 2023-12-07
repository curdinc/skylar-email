import { clientDb } from "../db";

export async function getProviderById({ id }: { id: number }) {
  return clientDb.provider.get(id as unknown as string);
}
