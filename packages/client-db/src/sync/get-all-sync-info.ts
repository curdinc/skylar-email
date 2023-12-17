import { clientDb } from "../db";

export async function getAllSyncInfo() {
  return await clientDb.sync.toArray();
}
