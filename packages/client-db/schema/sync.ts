export type EmailSyncInfoIndexType = {
  user_email_address: string;
  last_sync_history_id: string;
  last_sync_history_id_updated_at: number;
};

export type EmailSyncInfoType = EmailSyncInfoIndexType & {
  full_sync_completed_on: number;
};

export const EMAIL_SYNC_INFO_INDEX = `&user_email_address,
last_sync_history_id,
last_sync_history_id_updated_at` as const;
