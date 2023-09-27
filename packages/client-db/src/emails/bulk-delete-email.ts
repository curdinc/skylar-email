import type { ClientDb } from "../db";

export async function bulkDeleteEmail({
  db,
  emailIds,
}: {
  db: ClientDb;
  emailIds: string[];
}) {
  await db.email.bulkDelete(emailIds);
}
