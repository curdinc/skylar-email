import { useQuery } from "@tanstack/react-query";

import type { EmailSyncInfoType } from "../../schema/sync";
import { getEmailSyncInfo } from "../email/get-email-sync-info";

export const EMAIL_SYNC_INFO_QUERY_KEY = "emailSyncInfo";

export function useEmailSyncInfo({
  emailAddresses,
}: {
  emailAddresses: string[];
}) {
  return useQuery({
    queryKey: [EMAIL_SYNC_INFO_QUERY_KEY, emailAddresses, emailAddresses[0]],
    queryFn: async () => {
      if (!emailAddresses.length) return undefined;
      const syncInfoResp = await Promise.allSettled(
        emailAddresses.map((emailAddress) => {
          return getEmailSyncInfo({
            emailAddress,
          });
        }),
      );
      const syncInfo = syncInfoResp
        .map((resp) => (resp.status === "fulfilled" ? resp.value : undefined))
        .filter((emailSyncInfo) => !!emailSyncInfo) as EmailSyncInfoType[];
      return syncInfo;
    },
    enabled: !!emailAddresses.length,
    gcTime: 0,
  });
}
