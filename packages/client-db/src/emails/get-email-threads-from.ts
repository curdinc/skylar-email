import type { EmailIndexType } from "../../schema/email";
import type { ClientDb } from "../db";

export async function getEmailThreadsFrom({
  db,
  senderEmail,
}: {
  db: ClientDb;
  senderEmail: string;
}) {
  //FIXME: doesn't work
  return db.email
    .where({ from: senderEmail })
    .sortBy("created_at" satisfies keyof EmailIndexType);
}
