"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  bulkDeleteMessages,
  bulkPutMessages,
  bulkUpdateMessages,
  getAllProviders,
  getEmailSyncInfo,
  updateEmailSyncInfo,
} from "@skylar/client-db";
import type { EmailSyncInfoType } from "@skylar/client-db/schema/sync";
import { resetActiveThread, resetComposeMessage } from "@skylar/logic";

import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useInboxKeymaps } from "~/lib/keymap-hooks";
import { ROUTE_ONBOARDING_CONNECT, ROUTE_ONBOARDING_SYNC } from "~/lib/routes";
import { useEmailPartialSync } from "./use-email-partial-sync";

export const ClientLayout = () => {
  useInboxKeymaps();
  const router = useRouter();

  const { providerIndex } = useParams();
  useEffect(() => {
    resetActiveThread();
    resetComposeMessage();
  }, [providerIndex]);

  const { mutateAsync: emailPartialSync } = useEmailPartialSync();

  useQuery({
    queryKey: [],
    queryFn: async () => {
      let updatedEmails = false;

      const connectedProviders = await getAllProviders();
      if (!connectedProviders.length) {
        router.push(ROUTE_ONBOARDING_CONNECT);
        return updatedEmails;
      }

      const emailSyncInfo: EmailSyncInfoType[] = [];
      for (const provider of connectedProviders) {
        const syncInfo = await getEmailSyncInfo({
          emailAddress: provider.user_email_address,
        });
        if (!syncInfo) {
          router.push(ROUTE_ONBOARDING_SYNC);
          return updatedEmails;
        }
        emailSyncInfo.push(syncInfo);
      }

      for (const provider of connectedProviders) {
        const syncInfo = emailSyncInfo.find(
          (syncInfo) =>
            syncInfo.user_email_address.toLowerCase() ===
            provider.user_email_address.toLowerCase(),
        );
        if (!syncInfo) {
          router.push(ROUTE_ONBOARDING_SYNC);
          return updatedEmails;
        }

        const emailData = await emailPartialSync({
          emailAddressToSync: provider.user_email_address,
          startHistoryId: syncInfo?.last_sync_history_id,
        });
        if (!emailData) {
          return updatedEmails;
        }

        console.log("emailData", emailData);
        if (emailData.newMessages.length) {
          const emailToSave = convertGmailEmailToClientDbEmail(
            provider.user_email_address,
            emailData.newMessages,
          );
          await bulkPutMessages({
            messages: emailToSave,
          });
          updatedEmails = true;
        }
        if (emailData.messagesDeleted?.length) {
          await bulkDeleteMessages({
            providerMessageIds: emailData.messagesDeleted,
          });
          updatedEmails = true;
        }
        if (emailData.labelsModified?.length) {
          await bulkUpdateMessages({
            messages: emailData.labelsModified.map((email) => {
              return {
                provider_message_id: email.emailProviderMessageId,
                email_provider_labels: email.newLabels,
              };
            }),
          });
          updatedEmails = true;
        }
        await updateEmailSyncInfo({
          syncEmailAddressToUpdate: provider.user_email_address,
          emailSyncInfo: {
            last_sync_history_id: emailData.lastCheckedHistoryId,
            last_sync_history_id_updated_at: new Date().getTime(),
          },
        });
        return updatedEmails;
      }
    },
    refetchInterval: 20_000, // 20 seconds in milliseconds
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return <></>;
};
