"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  bulkDeleteEmails,
  bulkPutEmails,
  bulkUpdateEmails,
  updateEmailSyncInfo,
  useEmailSyncInfo,
} from "@skylar/client-db";
import {
  state$,
  useActiveEmailClientDb,
  useActiveEmailProvider,
} from "@skylar/logic";

import { api } from "~/lib/api";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
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
    // Missing activeClientDb which has recursive dependency, causing errors
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      isLoadingEmailSyncInfo,
      emailSyncInfo?.last_sync_history_id,
      activeEmailClient?.email,
    ],
    queryFn: async () => {
      let updatedEmails = false;
      if (
        isLoadingEmailSyncInfo ||
        !activeEmailClient?.email ||
        !activeClientDb
      ) {
        return updatedEmails;
      }
      if (!emailSyncInfo?.last_sync_history_id) {
        router.push("/onboarding/sync");
        return updatedEmails;
      }
      const emailData = await startEmailPartialSync(
        activeEmailClient?.email,
        emailSyncInfo?.last_sync_history_id,
      );
      if (!emailData) {
        return updatedEmails;
      }

      console.log("emailData", emailData);
      if (emailData.newMessages.length) {
        const emailToSave = convertGmailEmailToClientDbEmail(
          emailData.newMessages,
        );
        await bulkPutEmails({
          db: activeClientDb,
          emails: emailToSave,
        });
        updatedEmails = true;
      }
      if (emailData.messagesDeleted?.length) {
        await bulkDeleteEmails({
          db: activeClientDb,
          emailIds: emailData.messagesDeleted,
        });
        updatedEmails = true;
      }
      if (emailData.labelsModified?.length) {
        await bulkUpdateEmails({
          db: activeClientDb,
          emails: emailData.labelsModified.map((email) => {
            return {
              email_provider_message_id: email.emailProviderMessageId,
              email_provider_labels: email.newLabels,
            };
          }),
        });
        updatedEmails = true;
      }
      await updateEmailSyncInfo({
        db: activeClientDb,
        emailSyncInfo: {
          last_sync_history_id: emailData.lastCheckedHistoryId,
          last_sync_history_id_updated_at: new Date().getTime(),
        },
      });
      return updatedEmails;
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
