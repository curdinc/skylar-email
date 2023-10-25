import { useQuery } from "@tanstack/react-query";

import type { EmailSyncInfoType } from "../../schema/sync";
import { clientDb } from "../db";
import { getEmailSyncInfo } from "../emails/get-email-sync-info";

export const EMAIL_SYNC_INFO_QUERY_KEY = "emailSyncInfo";

export function useEmailSyncInfo({
  emailAddresses,
}: {
  emailAddresses: string[];
}) {
  const { data: emailSyncInfo, isLoading } = useQuery({
    queryKey: [EMAIL_SYNC_INFO_QUERY_KEY, emailAddresses, emailAddresses[0]],
    queryFn: async () => {
      if (!emailAddresses.length) return undefined;
      const syncInfoResp = await Promise.allSettled(
        emailAddresses.map((emailAddress) => {
          return getEmailSyncInfo({
            emailAddress,
            db: clientDb,
          });
        }),
      );
      const syncInfo = syncInfoResp
        .map((resp) => (resp.status === "fulfilled" ? resp.value : undefined))
        .filter((emailSyncInfo) => !!emailSyncInfo) as EmailSyncInfoType[];
      return syncInfo;
    },
    enabled: !!emailAddresses.length,
  });

  return { emailSyncInfo, isLoading };
}
