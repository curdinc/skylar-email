"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  bulkDeleteMessages,
  bulkPutMessages,
  bulkUpdateMessages,
  getAllProviders,
  getEmailSyncInfo,
  updateEmailSyncInfo,
  useAllSyncInfo,
} from "@skylar/client-db";
import { resetActiveThread, resetComposeMessage } from "@skylar/logic";
import type { EmailSyncInfoType } from "@skylar/parsers-and-types";

import { identifyUser } from "~/lib/analytics/capture-event";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useInboxKeymaps } from "~/lib/keymap-hooks";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { ROUTE_ONBOARDING_CONNECT, ROUTE_ONBOARDING_SYNC } from "~/lib/routes";
import { useEmailPartialSync } from "./use-email-partial-sync";
import type { GmailBackgroundSyncWorker } from "./web-workers/gmail-background-sync/types";

// HANDLES PARTIAL SYNCING OF EMAILS and continues full sync
export const ClientLayout = () => {
  useInboxKeymaps();
  const router = useRouter();
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const { data: allSyncInfo } = useAllSyncInfo();

  useEffect(() => {
    if (activeEmailAddress) {
      identifyUser(activeEmailAddress);
    }
    resetActiveThread();
    resetComposeMessage();
  }, [activeEmailAddress]);

  const { mutateAsync: emailPartialSync } = useEmailPartialSync();

  // create workers for each email address
  useEffect(() => {
    if (!allSyncInfo) return;
    console.log("allSyncInfo", allSyncInfo);

    console.log("creating workers for unsynced email addresses");
    const unsyncedEmailAddresses = allSyncInfo
      .filter((syncInfo) => !syncInfo.full_sync_completed_on)
      .map((syncInfo) => syncInfo.user_email_address);
    console.log("unsyncedEmailAddresses", unsyncedEmailAddresses);

    const createdWorkers = unsyncedEmailAddresses.map((emailAddress) => {
      const newWorker: GmailBackgroundSyncWorker = new Worker(
        new URL(
          "./web-workers/gmail-background-sync/worker.ts",
          import.meta.url,
        ),
      );
      newWorker.postMessage({
        emailAddress,
      });
      return newWorker;
    });

    // close workers on unmount
    return () => {
      // close workers
      createdWorkers.forEach((worker) => worker.terminate());
    };
  }, [allSyncInfo]);

  // partial sync emails
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
