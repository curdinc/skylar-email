import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  bulkPutMessages,
  getAllProviders,
  getEmailSyncInfo,
  upsertEmailSyncInfo,
} from "@skylar/client-db";
import type { EmailSyncInfoType } from "@skylar/parsers-and-types";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useLogger } from "~/lib/logger";
import {
  ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX,
  ROUTE_EMAIL_PROVIDER_INBOX,
  ROUTE_ONBOARDING_CONNECT,
} from "~/lib/routes";
import { useProviderInitialSync } from "./use-email-full-sync";

export function useSyncPage() {
  const runOnceRef = useRef(false);
  const {
    syncProgress,
    syncStep,
    providerInitialSyncMutation: { mutateAsync: startProviderInitialSync },
    providersSyncing,
  } = useProviderInitialSync();
  const router = useRouter();
  const logger = useLogger();
  const { toast } = useToast();

  useEffect(() => {
    const startSync = async () => {
      // get all connected providers
      const providers = await getAllProviders();
      if (!providers?.length) {
        // nothing connected, go connect first
        router.push(ROUTE_ONBOARDING_CONNECT);
        return;
      }

      const emailSyncInfo: EmailSyncInfoType[] = [];
      for (const provider of providers) {
        const syncInfo = await getEmailSyncInfo({
          emailAddress: provider.user_email_address,
        });
        if (syncInfo) {
          emailSyncInfo.push(syncInfo);
        }
      }

      if (emailSyncInfo?.length === providers.length) {
        // everything is already synced, go to inbox
        router.push(
          ROUTE_EMAIL_PROVIDER_INBOX(ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX),
        );
        return;
      }

      // start syncing
      for (const provider of providers) {
        const syncInfo = emailSyncInfo?.find(
          (info) =>
            info.user_email_address.toLowerCase() ===
            provider.user_email_address.toLowerCase(),
        );

        if (syncInfo?.next_page_token ?? syncInfo?.full_sync_completed_on) {
          continue;
        }

        const messageData = await startProviderInitialSync({
          emailProvider: provider.type,
          emailToSync: provider.user_email_address,
        });
        console.log("messageData", messageData);
        const messagesToSave = convertGmailEmailToClientDbEmail(
          provider.user_email_address,
          messageData.newMessages,
        );
        await bulkPutMessages({
          messages: messagesToSave,
        });
        await upsertEmailSyncInfo({
          emailSyncInfo: {
            user_email_address: provider.user_email_address,
            last_sync_history_id: messageData.lastCheckedHistoryId,
            last_sync_history_id_updated_at: new Date().getTime(),
            next_page_token: messageData.nextPageToken,
          },
        });
      }

      router.push(
        ROUTE_EMAIL_PROVIDER_INBOX(ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX),
      );
    };
    if (!runOnceRef.current) {
      runOnceRef.current = true;

      captureEvent({
        event: TrackingEvents.syncStarted,
        properties: {},
      });

      startSync().catch((e) => {
        captureEvent({
          event: TrackingEvents.syncFailed,
          properties: {},
        });
        logger.error("Error performing initial sync for user gmail inbox", {
          parserError: JSON.stringify(formatValidatorError(e), null, 2),
          error: e,
        });
        toast({
          variant: "destructive",
          title: "Error syncing your inbox",
          description: "Please try again later.",
        });
      });
    }
  }, [logger, router, startProviderInitialSync, toast]);

  return {
    providersSyncing,
    syncProgress,
    syncStep,
  };
}
