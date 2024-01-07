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
import { resetComposeMessage } from "@skylar/logic";
import type { EmailSyncInfoType } from "@skylar/parsers-and-types";
import {
  convertGmailEmailToClientDbEmail,
  gmailApiWorker,
} from "@skylar/web-worker-logic";

import { identifyUser } from "~/lib/analytics/capture-event";
import { useLogger } from "~/lib/logger";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { ROUTE_ONBOARDING_CONNECT, ROUTE_ONBOARDING_SYNC } from "~/lib/routes";
import { useGlobalKeymap } from "~/lib/shortcuts/keymap-hooks";
import { useActiveItemIndex } from "~/lib/store/label-tree-viewer/active-item";

// HANDLES PARTIAL SYNCING OF EMAILS and continues incremental sync
export const ClientLayout = () => {
  useGlobalKeymap();
  const router = useRouter();
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const { data: allSyncInfo } = useAllSyncInfo();
  const [, setActiveItemIndex] = useActiveItemIndex();

  useEffect(() => {
    if (activeEmailAddress) {
      identifyUser(activeEmailAddress);
    }
    setActiveItemIndex(undefined);
    resetComposeMessage();
  }, [activeEmailAddress, setActiveItemIndex]);

  // create workers for each email address
  useEffect(() => {
    if (!allSyncInfo) return;
    const unsyncedEmailAddresses = allSyncInfo
      .filter((syncInfo) => !syncInfo.full_sync_completed_on)
      .map((syncInfo) => syncInfo.user_email_address);

    // const createdWorkers =
    unsyncedEmailAddresses.map((emailAddress) => {
      // GmailBackgroundSyncWorker
      gmailApiWorker.sync.backgroundFullSync
        .mutate({
          emailAddress,
        })
        .catch((error) => {
          console.error("Error in background sync worker: ", error);
        });
    });
    // shared workers close automatically when all ports are closed
  }, [allSyncInfo]);

  // partial sync emails
  const { error } = useQuery({
    queryKey: [],
    queryFn: async () => {
      let updatedEmails = false;

      const connectedProviders = await getAllProviders();
      if (!connectedProviders.length) {
        router.push(ROUTE_ONBOARDING_CONNECT({ type: "initialConnection" }));
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

        const syncResponse = await gmailApiWorker.sync.partialSync.mutate({
          emailAddress: provider.user_email_address,
          startHistoryId: syncInfo?.last_sync_history_id,
        });
        if (!syncResponse) {
          return updatedEmails;
        }

        if (syncResponse.newMessages.length) {
          const emailToSave = convertGmailEmailToClientDbEmail(
            provider.user_email_address,
            syncResponse.newMessages,
          );
          await bulkPutMessages({
            messages: emailToSave,
          });
          updatedEmails = true;
        }
        if (syncResponse.messagesDeleted?.length) {
          await bulkDeleteMessages({
            providerMessageIds: syncResponse.messagesDeleted,
          });
          updatedEmails = true;
        }
        if (syncResponse.labelsModified?.length) {
          await bulkUpdateMessages({
            messages: syncResponse.labelsModified.map((email) => {
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
            last_sync_history_id: syncResponse.lastCheckedHistoryId,
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
  const logger = useLogger();
  useEffect(() => {
    logger.error("Error in client layout", { error });
  }, [error, logger]);

  return <></>;
};
