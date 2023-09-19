export type EmailIndexType = {
  email_id?: number;
  email_provider_thread_id: string;
  rfc822_message_id: string;
};

export type EmailType = EmailIndexType & {
  email_provider_message_id: string;
  subject: string;
  from: string;
  to: EmailSenderType[];
  cc: EmailSenderType[];
  bcc: EmailSenderType[];
  in_reply_to: string;
  snippet: string;
  content_html: string;
  content_text: string;
  labels: string[];
  attachment_names: string[];
  attachments: string[];
  created_at: number;
  updated_at: number;
};

type EmailSenderType = { name?: string; email: string };

export const EMAIL_INDEX = `++email_id,
  email_provider_thread_id,
  rfc822_message_id` as const;
