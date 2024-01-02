import type { SenderType } from "./shared";

export type ThreadIndexType = {
  provider_thread_id: string;
  user_email_address: string;
  provider_message_ids: string[];
  subject_search: string[];
  from_search: string[];
  to_search: string[];
  cc_search: string[];
  bcc_search: string[];
  reply_to_search: string[];
  delivered_to_search: string[];
  content_search: string[];
  provider_message_labels: string[];
  attachment_names_search: string[];
  created_at: number;
  updated_at: number;
};

export type ThreadType = ThreadIndexType & {
  subject: string;
  content: string[];
  latest_snippet_html: string;
  rfc822_message_ids: string[];
  from: SenderType[][];
  to: SenderType[][];
  cc: SenderType[][];
  bcc: SenderType[][];
  reply_to: SenderType[][];
  delivered_to: SenderType[][];
  attachment_names: string[];
};

export const THREAD_INDEX = `&provider_thread_id,
user_email_address,
*provider_message_id,
*subject_search,
*from_search,
*to_search,
*cc_search,
*bcc_search,
*reply_to_search,
*delivered_to_search,
*content_search,
*provider_message_labels,
*attachment_names_search,
created_at,
updated_at` as const;
