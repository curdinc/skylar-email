import type { MessageType } from "@skylar/client-db/schema/message";
import type { State } from "@skylar/logic";
import type {
  EmailSenderType,
  SenderType,
  SyncResponseType,
} from "@skylar/parsers-and-types";

import { sanitize } from "./htmlSanitizer";

export function convertGmailEmailToClientDbEmail(
  emailAddress: string,
  messages: SyncResponseType["newMessages"],
): MessageType[] {
  return messages.map((message) => {
    const emailTextContent = message.emailData.plain
      .map((content) => {
        return Buffer.from(content, "base64").toString("utf-8");
      })
      .join(" ");

    const emailHtmlContent = message.emailData.html
      .map((contentHtml) => {
        return Buffer.from(contentHtml, "base64").toString("utf-8");
      })
      .join(" ");

    return {
      user_email_address: emailAddress,
      attachment_names: message.emailData.attachments.map(
        (attachment) => attachment.filename,
      ),
      attachments: message.emailData.attachments.reduce(
        (prev, current) => {
          prev[current.filename] = current;
          return prev;
        },
        {} as MessageType["attachments"],
      ),
      created_at: message.emailMetadata.createdAt.getTime(),
      provider_thread_id: message.emailProviderThreadId,
      provider_message_id: message.emailProviderMessageId,
      rfc822_message_id: message.emailMetadata.rfc822MessageId,
      bcc: convertGmailSendersToClientDbSender([message.emailMetadata.bcc])[0],
      cc: convertGmailSendersToClientDbSender(message.emailMetadata.cc),
      from: convertGmailSendersToClientDbSender([
        message.emailMetadata.from,
      ])[0]!,
      to: convertGmailSendersToClientDbSender(message.emailMetadata.to),
      reply_to: convertGmailSendersToClientDbSender(
        message.emailMetadata.replyTo,
      ),
      delivered_to: convertGmailSendersToClientDbSender(
        message.emailMetadata.deliveredTo,
      ),
      in_reply_to: message.emailMetadata.inReplyTo.emailAddress,
      email_provider_labels: message.providerLabels,
      skylar_labels: [],
      subject: message.emailMetadata.subject,
      snippet_html: sanitize(message.snippet).__html,
      content_text: sanitize(emailTextContent).__html,
      content_html: sanitize(emailHtmlContent).__html,
    };
  });
}

function convertGmailSendersToClientDbSender(senders?: EmailSenderType[]) {
  return (
    senders?.map((sender) => ({
      name: sender.name,
      email_address: sender.emailAddress,
    })) ?? []
  );
}

export function formatTimeToMMMDD(time: number): string {
  return new Date(time).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
export function formatTimeToMMMDDYYYYHHmm(time: number): string {
  return new Date(time).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export const getSenderReplyToEmailAddresses = (
  fromAddresses?: SenderType[],
  replyToAddresses?: SenderType[],
): string[] => {
  if (replyToAddresses?.length) {
    return replyToAddresses.map(
      (replyToAddress) => replyToAddress.email_address,
    );
  }
  if (fromAddresses?.length) {
    return fromAddresses.map((fromAddress) => {
      return fromAddress.email_address;
    });
  }
  return [];
};

export const formatEmailAddresses = (
  userEmailAddress?: string,
  emailAddresses?: SenderType[],
): string[] => {
  return (
    emailAddresses
      ?.map((emailAddress) => emailAddress.email_address)
      ?.filter((emailAddress) => {
        return emailAddress !== userEmailAddress;
      }) ?? []
  );
};

export const ATTACHMENT_SIZE_LIMIT_IN_BYTES = 25_000_000;
export const isAttachmentSizeValid = (
  attachments: State["EMAIL_CLIENT"]["COMPOSING"]["attachments"],
): boolean => {
  const totalSize = attachments.reduce((prev, current) => {
    return prev + current.file.size;
  }, 0);
  return totalSize < ATTACHMENT_SIZE_LIMIT_IN_BYTES;
};
