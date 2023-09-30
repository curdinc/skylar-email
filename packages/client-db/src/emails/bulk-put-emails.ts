import type { EmailType } from "../../schema/email";
import type { ClientDb } from "../db";
import { buildThreadList } from "../lib/build-thread-list";

export async function bulkPutEmails({
  db,
  emails,
}: {
  db: ClientDb;
  emails: EmailType[];
}) {
  await db.transaction("rw", db.email, db.thread, async () => {
    await db.email.bulkPut(emails);
    await db.thread.bulkPut(buildThreadList(emails));
  });
}
