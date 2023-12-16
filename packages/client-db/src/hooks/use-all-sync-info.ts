import { useQuery } from "@tanstack/react-query";

import { getAllSyncInfo } from "../sync/get-all-sync-info";

const GET_ALL_SYNC_INFO = "GET_ALL_SYNC_INFO"; // FIXME: add to parsers and types
export function useAllSyncInfo() {
  return useQuery({
    queryKey: [GET_ALL_SYNC_INFO],
    queryFn: async () => {
      const syncInfo = await getAllSyncInfo();
      return syncInfo;
    },
  });
}
