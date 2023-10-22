import { useQuery } from "@tanstack/react-query";

import { getEmailSyncInfo } from "../emails/get-email-sync-info";
import type { MakeDbOptional } from "../types/use-client-db-helper-type";
import { useClientDb } from "./use-client-db";

export function useEmailSyncInfo(
  args: MakeDbOptional<Parameters<typeof getEmailSyncInfo>[0]>,
) {
  const { data } = useQuery({
    queryKey: ["emailSyncInfo", args],
    queryFn: async () => {
      if (!args.db) {
        throw new Error("db is not defined");
      }
      const syncInfo = await getEmailSyncInfo({ ...args, db: args.db });
      return syncInfo;
    },
    enabled: !!args.db,
  });

  const { result: emailSyncInfo, isLoading } = useClientDb({
    db: args.db,
    deps: [],
    query: async (db) => {
      const syncInfo = await getEmailSyncInfo({ ...args, db });
      return syncInfo;
    },
  });

  return { emailSyncInfo: emailSyncInfo?.[0], isLoading };
}
