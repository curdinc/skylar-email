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
import { setEmailProviders, useActiveEmailProviders } from "@skylar/logic";

import { api } from "~/lib/api";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useInboxKeymaps } from "~/lib/keymap-hooks";
import { useEmailPartialSync } from "./use-email-partial-sync";

export const ClientLayout = () => {
  useInboxKeymaps();
  const activeEmailProviders = useActiveEmailProviders();

  const router = useRouter();
  const { data: emailProviders, isLoading: isLoadingEmailProviders } =
    api.emailProvider.getAll.useQuery();

  const { emailSyncInfo, isLoading: isLoadingEmailSyncInfo } = useEmailSyncInfo(
    {
      emailAddresses: activeEmailProviders.map(
        (emailProvider) => emailProvider.email,
      ),
    },
  );
  const { emailPartialSync } = useEmailPartialSync();

  useQuery({
    queryKey: [
      isLoadingEmailSyncInfo,
      activeEmailProviders.length,
      emailSyncInfo?.length,
    ],
    queryFn: async () => {
      let updatedEmails = false;
      if (isLoadingEmailSyncInfo || !activeEmailProviders.length) {
        throw new Error("Not ready to sync emails");
      }

      if (emailSyncInfo?.length !== activeEmailProviders.length) {
        router.push("/onboarding/sync");
        return updatedEmails;
      }

      for (const activeEmailProvider of activeEmailProviders) {
        const syncInfo = emailSyncInfo.find(
          (syncInfo) =>
            syncInfo.email_sync_info_id.toLowerCase() ===
            activeEmailProvider.email.toLowerCase(),
        );
        if (!syncInfo) {
          router.push("/onboarding/sync");
          return updatedEmails;
        }
        const emailData = await emailPartialSync(
          activeEmailProvider?.email,
          syncInfo?.last_sync_history_id,
        );
        if (!emailData) {
          return updatedEmails;
        }

        console.log("emailData", emailData);
        if (emailData.newMessages.length) {
          const emailToSave = convertGmailEmailToClientDbEmail(
            activeEmailProvider.email,
            emailData.newMessages,
          );
          await bulkPutEmails({
            emails: emailToSave,
          });
          updatedEmails = true;
        }
        if (emailData.messagesDeleted?.length) {
          await bulkDeleteEmails({
            emailIds: emailData.messagesDeleted,
          });
          updatedEmails = true;
        }
        if (emailData.labelsModified?.length) {
          await bulkUpdateEmails({
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
          syncEmailAddressToUpdate: activeEmailProvider.email,
          emailSyncInfo: {
            last_sync_history_id: emailData.lastCheckedHistoryId,
            last_sync_history_id_updated_at: new Date().getTime(),
          },
        });
        return updatedEmails;
      }
    },
    refetchInterval: 40_000, // 40 seconds in milliseconds
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !isLoadingEmailSyncInfo && !!activeEmailProviders.length,
  });

  useEffect(() => {
    if (isLoadingEmailProviders) {
      return;
    } else if (emailProviders) {
      setEmailProviders(emailProviders);
    }
  }, [emailProviders, isLoadingEmailProviders]);

  return <></>;
};
