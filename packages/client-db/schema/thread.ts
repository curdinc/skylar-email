export type ThreadIndexType = {
  email_provider_thread_id: string;
  subject_search: string[];
  from: string[];
  to: string[];
  cc: string[];
  bcc: string[];
  reply_to: string[];
  delivered_to: string[];
  content_search: string[];
  email_provider_labels: string[];
  skylar_labels: string[];
  attachment_names: string[];
  created_at: number;
  updated_at: number;
};

export type ThreadType = ThreadIndexType & {
  subject: string;
  content: string[];
  latest_snippet: string;
  rfc822_message_id: string[];
  email_provider_message_id: string[];
};

export const THREAD_INDEX = `&email_provider_thread_id,
*subject_search,
*from,
*to,
*cc,
*bcc,
*reply_to,
*delivered_to,
*content_search,
*email_provider_labels,
*skylar_labels,
*attachment_names,
created_at,
updated_at` as const;
