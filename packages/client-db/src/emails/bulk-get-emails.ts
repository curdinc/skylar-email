import type { ClientDb } from "../db";

export async function bulkGetEmails({
  db,
  emailIds,
}: {
  db: ClientDb;
  emailIds: string[];
}) {
  return await db.email.bulkGet(emailIds);
}
