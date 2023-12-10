"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  bulkDeleteMessages,
  bulkPutMessages,
  bulkUpdateMessages,
  updateEmailSyncInfo,
  useConnectedProviders,
  useProviderSyncInfo,
} from "@skylar/client-db";
import {
  resetActiveThread,
  resetComposeMessage,
  setActiveEmailAddress,
} from "@skylar/logic";

import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useInboxKeymaps } from "~/lib/keymap-hooks";
import { useEmailPartialSync } from "./use-email-partial-sync";

export const ClientLayout = () => {
  useInboxKeymaps();
  const router = useRouter();
  const { data: allEmailProviders } = useConnectedProviders();
  const { providerIndex } = useParams();

  useEffect(() => {
    resetActiveThread();
    resetComposeMessage();

    if (!allEmailProviders) {
      return;
    }
    const activeEmail = allEmailProviders.find(
      (p) => p.provider_id?.toString() === (providerIndex as string),
    )?.email;

    setActiveEmailAddress(activeEmail);
  }, [providerIndex, allEmailProviders]);

  const { emailSyncInfo, isLoading: isLoadingEmailSyncInfo } =
    useProviderSyncInfo({
      emailAddresses: (allEmailProviders ?? []).map(
        (provider) => provider.email,
      ),
    });
  const { emailPartialSync } = useEmailPartialSync();

  useQuery({
    queryKey: [
      isLoadingEmailSyncInfo,
      allEmailProviders,
      emailSyncInfo?.length,
    ],
    queryFn: async () => {
      if (!allEmailProviders) {
        throw new Error("Reached a bad state");
      }
      let updatedEmails = false;
      if (isLoadingEmailSyncInfo || !allEmailProviders.length) {
        throw new Error("Not ready to sync emails");
      }

      if (emailSyncInfo?.length !== allEmailProviders.length) {
        router.push("/onboarding/sync");
        return updatedEmails;
      }

      for (const activeEmailProvider of allEmailProviders) {
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
          await bulkPutMessages({
            emails: emailToSave,
          });
          updatedEmails = true;
        }
        if (emailData.messagesDeleted?.length) {
          await bulkDeleteMessages({
            emailIds: emailData.messagesDeleted,
          });
          updatedEmails = true;
        }
        if (emailData.labelsModified?.length) {
          await bulkUpdateMessages({
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
    enabled:
      !isLoadingEmailSyncInfo &&
      allEmailProviders &&
      !!allEmailProviders.length,
  });

  return <></>;
};
