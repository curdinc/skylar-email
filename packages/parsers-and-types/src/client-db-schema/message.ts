import type { SenderType } from "./shared";

export type MessageIndexType = {
  provider_message_id: string;
  provider_thread_id: string;
  user_email_address: string;
  rfc822_message_id: string;
  created_at: number;
};

export type MessageType = MessageIndexType & {
  subject: string;
  from: SenderType;
  to: SenderType[];
  cc: SenderType[];
  bcc?: SenderType;
  reply_to: SenderType[];
  delivered_to: SenderType[];
  in_reply_to?: string;
  content_html?: string;
  content_text: string;
  provider_message_labels: string[];
  snippet_html: string;
  attachment_names: string[];
  attachments: Record<
    string,
    {
      partId: string;
      mimeType: string;
      filename: string;
      body: {
        attachmentId: string;
        size: number;
        data?: string;
      };
    }
  >;
};

export const MESSAGE_INDEX = `&provider_message_id,
provider_thread_id,
user_email_address,
rfc822_message_id,
created_at` as const;
