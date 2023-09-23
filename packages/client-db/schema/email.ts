export type EmailIndexType = {
  email_provider_message_id: string;
  email_provider_thread_id: string;
  rfc822_message_id: string;
  created_at: number;
};

export type EmailType = EmailIndexType & {
  subject: string;
  from: EmailSenderType;
  to: EmailSenderType[];
  cc: EmailSenderType[];
  bcc: EmailSenderType[];
  reply_to: EmailSenderType[];
  delivered_to: EmailSenderType[];
  in_reply_to?: string;
  content_html?: string;
  content_text: string;
  labels: string[];
  attachment_names: string[];
  attachments?: Record<string, string>;
};

type EmailSenderType = { name?: string; email: string };

export const EMAIL_INDEX = `&email_provider_message_id,
email_provider_thread_id,
&rfc822_message_id,
created_at` as const;
