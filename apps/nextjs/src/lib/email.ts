import type { EmailType } from "@skylar/client-db/schema/email";
import type { SyncResponseType } from "@skylar/parsers-and-types";

import { sanitize } from "./htmlSanitizer";

export function convertGmailEmailToClientDbEmail(
  emails: SyncResponseType["newMessages"],
): EmailType[] {
  return emails.map((email) => {
    return {
      attachment_names: email.emailData.attachments.map(
        (attachment) => attachment.filename,
      ),
      attachments: email.emailData.attachments.reduce(
        (prev, current) => {
          prev[current.filename] = current;
          return prev;
        },
        {} as EmailType["attachments"],
      ),
      created_at: email.emailMetadata.createdAt.getTime(),
      email_provider_thread_id: email.emailProviderThreadId,
      email_provider_message_id: email.emailProviderMessageId,
      rfc822_message_id: email.emailMetadata.rfc822MessageId,
      bcc: email.emailMetadata.bcc,
      cc: email.emailMetadata.cc,
      from: email.emailMetadata.from,
      to: email.emailMetadata.to,
      reply_to: email.emailMetadata.replyTo,
      delivered_to: email.emailMetadata.deliveredTo,
      in_reply_to: email.emailMetadata.inReplyTo.email,
      email_provider_labels: email.providerLabels,
      skylar_labels: [],
      subject: email.emailMetadata.subject,
      snippet_html: sanitize(email.snippet).__html,
      content_text: email.emailData.plain.join(" "),
      content_html: sanitize(email.emailData.html.join(" ")).__html,
    };
  });
}
