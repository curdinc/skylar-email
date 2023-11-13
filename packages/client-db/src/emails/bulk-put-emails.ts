import type { EmailType } from "../../schema/email";
import { clientDb } from "../db";
import { buildThreadList } from "../lib/build-thread-list";

export async function bulkPutEmails({ emails }: { emails: EmailType[] }) {
  await clientDb.transaction(
    "rw",
    clientDb.email,
    clientDb.thread,
    async () => {
      await clientDb.email.bulkPut(emails);
      await clientDb.thread.bulkPut(buildThreadList(emails));
    },
  );
}
