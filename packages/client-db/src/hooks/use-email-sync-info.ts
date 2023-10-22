import { useQuery } from "@tanstack/react-query";

import { clientDb } from "../db";
import { getEmailSyncInfo } from "../emails/get-email-sync-info";
import type { GetParameters } from "../types/extract-params";

export const EMAIL_SYNC_INFO_QUERY_KEY = "emailSyncInfo";

export function useEmailSyncInfo(args: GetParameters<typeof getEmailSyncInfo>) {
  const { data: emailSyncInfo, isLoading } = useQuery({
    queryKey: [EMAIL_SYNC_INFO_QUERY_KEY, args.emailAddress],
    queryFn: async () => {
      const syncInfo = await getEmailSyncInfo({
        emailAddress: args.emailAddress,
        db: clientDb,
      });
      return syncInfo;
    },
  });

  return { emailSyncInfo, isLoading };
}
