export const DEFAULT_EMAIL_SYNC_INFO_ID = "email_sync_info";

export type EmailSyncInfoIndexType = {
  email_sync_info_id: string;
  last_sync_history_id: string;
  last_sync_history_id_updated_at: number;
};

export type EmailSyncInfoType = EmailSyncInfoIndexType & {
  full_sync_completed_on: number;
};

export const EMAIL_SYNC_INFO_INDEX = `&email_sync_info_id,
last_sync_history_id,
last_sync_history_id_updated_at` as const;
