import type { MessageIndexType, MessageType } from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { bulkGetMessages } from "./bulk-get-messages";
import { bulkPutMessages } from "./bulk-put-messages";

export async function bulkUpdateMessages({
  messages,
}: {
  messages: (Partial<MessageType> &
    Pick<MessageIndexType, "provider_message_id">)[];
}) {
  await clientDb.transaction(
    "rw",
    clientDb.message,
    clientDb.thread,
    async () => {
      const emailIdToEmail = new Map<string, Partial<MessageType>>();
      messages.forEach((email) => {
        emailIdToEmail.set(email.provider_message_id, email);
      });
      const emailIds = Array.from(emailIdToEmail.keys());

      const fullEmails = (
        await bulkGetMessages({
          providerMessageIds: emailIds,
        })
      ).filter((email) => !!email) as MessageType[];
      const updatedEmails = fullEmails.map((email) => {
        const update = emailIdToEmail.get(email.provider_message_id);
        if (!update) {
          throw new Error(
            `Could not find email with provider_message_id: ${email.provider_message_id}`,
          );
        }
        return {
          ...email,
          ...update,
        };
      });

      await bulkPutMessages({ messages: updatedEmails });
    },
  );
}
