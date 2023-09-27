"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useEmailSyncInfo } from "@skylar/client-db";
import {
  state$,
  useActiveEmailClientDb,
  useActiveEmailProvider,
} from "@skylar/logic";

import { api } from "~/lib/api";
import { useEmailPartialSync } from "./use-email-partial-sync";

export const ClientLayout = () => {
  const activeClientDb = useActiveEmailClientDb();
  const activeEmailClient = useActiveEmailProvider();
  const router = useRouter();
  const { data: emailProviders, isLoading: isLoadingEmailProviders } =
    api.emailProvider.getAll.useQuery();

  const { emailSyncInfo, isLoading: isLoadingEmailSyncInfo } = useEmailSyncInfo(
    { db: activeClientDb },
  );
  const { startEmailPartialSync } = useEmailPartialSync();

  useQuery({
    queryKey: [
      isLoadingEmailSyncInfo,
      emailSyncInfo?.last_sync_history_id,
      activeEmailClient?.email,
    ],
    queryFn: async () => {
      if (isLoadingEmailSyncInfo || !activeEmailClient?.email) {
        return false;
      }
      if (!emailSyncInfo?.last_sync_history_id) {
        router.push("/onboarding/sync");
        return false;
      }
      const emailData = await startEmailPartialSync(
        activeEmailClient?.email,
        emailSyncInfo?.last_sync_history_id,
      );
      console.log("emailData", emailData);
      return true;
    },
    refetchInterval: 50_000, // 50 seconds in milliseconds
    refetchIntervalInBackground: true,
    enabled: !isLoadingEmailSyncInfo && !!activeEmailClient?.email,
  });

  useEffect(() => {
    if (isLoadingEmailProviders) {
      return;
    } else if (emailProviders) {
      state$.EMAIL_CLIENT.emailProviders.set(emailProviders);
      state$.EMAIL_CLIENT.initializeClientDbs();
    }
  }, [emailProviders, isLoadingEmailProviders]);

  return <></>;
};
