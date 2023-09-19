export type ThreadIndexType = {
  thread_id?: number;
  email_provider_thread_id: string;
  subject: string;
  subject_search: string[];
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
  content_search: string[];
  labels: string[];
  attachment_names: string[];
  created_at: number;
  updated_at: number;
};

export type ThreadType = ThreadIndexType & {
  rfc822_message_id: string[];
  email_provider_message_id: string[];
};

export const THREAD_INDEX = `++thread_id,
  &email_provider_thread_id,
  *subject_search,
  from,
  *to,
  *cc,
  *bcc,
  *content_search,
  *labels,
  *attachment_names,
  created_at,
  updated_at` as const;
