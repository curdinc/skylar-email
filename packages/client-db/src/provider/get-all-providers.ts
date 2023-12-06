import { clientDb } from "../db";

export async function getAllProviders() {
  return await clientDb.provider.toArray();
}
