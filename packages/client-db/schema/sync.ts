export type EmailSyncInfoIndexType = {
  // This is the email address of the user
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
