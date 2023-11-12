export type EmailIndexType = {
  email_provider_message_id: string;
  email_provider_thread_id: string;
  user_email_address: string;
  rfc822_message_id: string;
  created_at: number;
};

export type EmailType = EmailIndexType & {
  subject: string;
  from: EmailSenderType;
  to: EmailSenderType[];
  cc: EmailSenderType[];
  bcc: EmailSenderType;
  reply_to: EmailSenderType[];
  delivered_to: EmailSenderType[];
  in_reply_to?: string;
  content_html?: string;
  content_text: string;
  skylar_labels: string[];
  email_provider_labels: string[];
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

type EmailSenderType = { name?: string; email: string };

export const EMAIL_INDEX = `&email_provider_message_id,
email_provider_thread_id,
user_email_address,
&rfc822_message_id,
created_at` as const;

export const EMAIL_PROVIDER_LABELS = {
  GMAIL: {
    UNREAD: "UNREAD",
    INBOX: "INBOX",
    STARRED: "STARRED",
    SENT: "SENT",
    DRAFT: "DRAFT",
    TRASH: "TRASH",
    SPAM: "SPAM",
    IMPORTANT: "IMPORTANT",
    CATEGORY_PERSONAL: "CATEGORY_PERSONAL",
    CATEGORY_SOCIAL: "CATEGORY_SOCIAL",
    CATEGORY_PROMOTIONS: "CATEGORY_PROMOTIONS",
  },
} as const;
export const EMAIL_PROVIDER_LABELS_ARRAY = Object.values(
  EMAIL_PROVIDER_LABELS,
).flatMap((labels) => Object.values(labels));
