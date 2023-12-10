import { clientDb } from "../db";

export async function bulkGetMessages({
  providerMessageIds,
}: {
  providerMessageIds: string[];
}) {
  return await clientDb.message.bulkGet(providerMessageIds);
}
