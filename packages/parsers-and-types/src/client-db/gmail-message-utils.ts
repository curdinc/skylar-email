import type { EmailSenderType } from "../api/email";
import type { SyncResponseType } from "../api/email-provider/gmail-provider";
import type { MessageType } from "../client-db-schema/message";

export function convertGmailEmailToClientDbEmail(
  emailAddress: string,
  messages: SyncResponseType["newMessages"],
): MessageType[] {
  return messages.map((message) => {
    const messageTextContent = message.emailData.plain
      .map((content) => {
        return Buffer.from(content, "base64").toString("utf-8");
      })
      .join(" ");

    const messageHtmlContent = message.emailData.html
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
      provider_message_labels: message.providerLabels,
      subject: message.emailMetadata.subject,
      snippet_html: message.snippet,
      content_text: messageTextContent,
      content_html: messageHtmlContent,
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
