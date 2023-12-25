import { useCallback, useEffect, useRef, useState } from "react";
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
import { useProviderInitialSync } from "./use-provider-initial-sync";

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
  const [isError, setIsError] = useState(false);

  const startSync = useCallback(async () => {
    // get all connected providers
    const providers = await getAllProviders();
    if (!providers?.length) {
      // nothing connected, go connect first
      router.push(ROUTE_ONBOARDING_CONNECT({ type: "initialConnection" }));
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

    router.push(ROUTE_EMAIL_PROVIDER_INBOX(ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX));
  }, [router, startProviderInitialSync]);

  const runStartSync = useCallback(() => {
    startSync()
      .then(() => {
        performance.mark("initSyncCompleted");
        const measure = performance.measure(
          "initSync",
          "initSyncStarted",
          "initSyncCompleted",
        );
        const timeTakenInSeconds = measure.duration / 1000;
        captureEvent({
          event: TrackingEvents.initSyncCompleted,
          properties: {
            timeTakenInSeconds,
          },
        });
      })
      .catch((e: unknown) => {
        captureEvent({
          event: TrackingEvents.initSyncFailed,
          properties: {},
        });
        logger.error("Error performing initial sync for user gmail inbox", {
          parserError: JSON.stringify(formatValidatorError(e), null, 2),
          error: e,
        });
        setIsError(true);
        toast({
          variant: "destructive",
          title: "Error syncing your inbox",
          description: "Please try again later.",
        });
      });
  }, [logger, startSync, toast]);

  const retrySync = useCallback(() => {
    setIsError(false);
    runStartSync();
  }, [runStartSync]);

  useEffect(() => {
    if (!runOnceRef.current) {
      runOnceRef.current = true;

      performance.mark("initSyncStarted");
      captureEvent({
        event: TrackingEvents.initSyncStarted,
        properties: {},
      });
      runStartSync();
    }
  }, [runStartSync]);

  return {
    providersSyncing,
    syncProgress,
    syncStep,
    isError,
    retrySync,
  };
}
