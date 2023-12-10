import type { SenderType } from "./shared";

export type ThreadIndexType = {
  provider_thread_id: string;
  user_email_address: string;
  email_provider_message_id: string[];
  subject_search: string[];
  from_search: string[];
  to_search: string[];
  cc_search: string[];
  bcc_search: string[];
  reply_to_search: string[];
  delivered_to_search: string[];
  content_search: string[];
  email_provider_labels: string[];
  attachment_names: string[];
  created_at: number;
  updated_at: number;
};

export type ThreadType = ThreadIndexType & {
  subject: string;
  content: string[];
  latest_snippet_html: string;
  rfc822_message_id: string[];
  from: SenderType[][];
  to: SenderType[][];
  cc: SenderType[][];
  bcc: SenderType[][];
  reply_to: SenderType[][];
  delivered_to: SenderType[][];
};

export const THREAD_INDEX = `&provider_thread_id,
user_email_address,
*email_provider_message_id,
*subject_search,
*from_search,
*to_search,
*cc_search,
*bcc_search,
*reply_to_search,
*delivered_to_search,
*content_search,
*email_provider_labels,
*attachment_names,
created_at,
updated_at` as const;