export type SyncIndexType = {
  sync_id: string;
  last_sync_history_id: string;
  last_sync_history_id_updated_at: number;
};

export type SyncType = SyncIndexType & {
  full_sync_completed_on: number;
};

export const SYNC_INDEX = `&sync_id,
last_sync_history_id,
last_sync_history_id_updated_at` as const;
