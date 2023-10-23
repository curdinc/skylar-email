import { clientDb } from "../db";

export async function bulkGetEmails({ emailIds }: { emailIds: string[] }) {
  return await clientDb.email.bulkGet(emailIds);
}
