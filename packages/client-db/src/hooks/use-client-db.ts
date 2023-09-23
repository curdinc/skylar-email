import { useLiveQuery } from "dexie-react-hooks";

import type { ClientDbHookOptionType } from "../types/base-client-db-hook-types";
import { DEFAULT_CLIENT_DB_HOOK_OPTIONS } from "../types/base-client-db-hook-types";

export function useClientDb<T>({
  query,
  deps,
  options = DEFAULT_CLIENT_DB_HOOK_OPTIONS,
}: {
  query: Parameters<typeof useLiveQuery<T>>[0];
  deps: Parameters<typeof useLiveQuery<T>>[1];
  options?: ClientDbHookOptionType;
}) {
  return useLiveQuery(async () => {
    if (!options.enabled) {
      return;
    }
    const result = await query();
    return result;
  }, deps);
}
