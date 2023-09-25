import { getEmailSyncInfo } from "../emails/get-email-sync-info";
import type { MakeDbOptional } from "../types/use-client-db-helper-type";
import { useClientDb } from "./use-client-db";

export function useEmailSyncInfo(
  args: MakeDbOptional<Parameters<typeof getEmailSyncInfo>[0]>,
) {
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
