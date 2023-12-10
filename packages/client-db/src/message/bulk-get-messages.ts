import { clientDb } from "../db";

export async function bulkGetMessages({ emailIds }: { emailIds: string[] }) {
  return await clientDb.message.bulkGet(emailIds);
}
