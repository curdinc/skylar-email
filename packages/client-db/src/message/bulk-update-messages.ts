import type { MessageIndexType, MessageType } from "../../schema/message";
import { clientDb } from "../db";
import { bulkGetMessages } from "./bulk-get-messages";
import { bulkPutMessages } from "./bulk-put-messages";

export async function bulkUpdateMessages({
  emails,
}: {
  emails: (Partial<MessageType> &
    Pick<MessageIndexType, "email_provider_message_id">)[];
}) {
  await clientDb.transaction(
    "rw",
    clientDb.message,
    clientDb.thread,
    async () => {
      const emailIdToEmail = new Map<string, Partial<MessageType>>();
      emails.forEach((email) => {
        emailIdToEmail.set(email.email_provider_message_id, email);
      });
      const emailIds = Array.from(emailIdToEmail.keys());

      const fullEmails = (
        await bulkGetMessages({
          emailIds: emailIds,
        })
      ).filter((email) => !!email) as MessageType[];
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

      await bulkPutMessages({ emails: updatedEmails });
    },
  );
}
