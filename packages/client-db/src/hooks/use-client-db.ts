import { useLiveQuery } from "dexie-react-hooks";

import type { ClientDb } from "../db";

export function useClientDb<T>({
  db,
  query,
  deps,
}: {
  db?: ClientDb;
  query: (db: ClientDb) => Promise<T> | T;
  deps: Parameters<typeof useLiveQuery<T>>[1];
}) {
  const result = useLiveQuery(async () => {
    if (!db) {
      return;
    }
    const result = await query(db);
    return [result].flat() ?? [];
  }, [...((deps as unknown[]) ?? []), db?.name]);

  return {
    result: result,
    isLoading: !result,
  };
}
