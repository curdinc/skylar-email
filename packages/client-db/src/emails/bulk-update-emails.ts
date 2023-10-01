import type { EmailIndexType, EmailType } from "../../schema/email";
import type { ClientDb } from "../db";
import { bulkGetEmails } from "./bulk-get-emails";
import { bulkPutEmails } from "./bulk-put-emails";

export async function bulkUpdateEmails({
  db,
  emails,
}: {
  db: ClientDb;
  emails: (Partial<EmailType> &
    Pick<EmailIndexType, "email_provider_message_id">)[];
}) {
  await db.transaction("rw", db.email, db.thread, async () => {
    const emailIdToEmail = new Map<string, Partial<EmailType>>();
    emails.forEach((email) => {
      emailIdToEmail.set(email.email_provider_message_id, email);
    });
    const emailIds = Array.from(emailIdToEmail.keys());

    const fullEmails = (
      await bulkGetEmails({
        db,
        emailIds: emailIds,
      })
    ).filter((email) => !!email) as EmailType[];
    const updatedEmails = fullEmails.map((email) => {
      const update = emailIdToEmail.get(email.email_provider_message_id);
      if (!update) {
        throw new Error(
          `Could not find email with email_provider_message_id: ${email.email_provider_message_id}`,
        );
      }
      return {
        ...email,
        ...update,
      };
    });

    await bulkPutEmails({ db, emails: updatedEmails });
  });
}
