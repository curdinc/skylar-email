import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type { SyncResponseType } from "@skylar/parsers-and-types";
import type { SupportedEmailProviderType } from "@skylar/parsers-and-types/src/api/email-provider/oauth";
import { gmailApiWorker } from "@skylar/web-worker-logic";
import { useLogger } from "~/lib/logger";


const INITIAL_MESSAGES_TO_FETCH = 150;

// source: https://stackoverflow.com/questions/45735472/generate-a-random-number-between-2-values-to-2-decimals-places-in-javascript
function genRand(min: number, max: number, decimalPlaces: number) {
  const rand =
    Math.random() < 0.5
      ? (1 - Math.random()) * (max - min) + min
      : Math.random() * (max - min) + min; // could be min or max or anything in between
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

const SYNC_STEPS = {
  ERROR_SYNCING_INBOX: "Error syncing inbox",
  GETTING_ACCESS_TO_INBOX: "Getting access to inbox",
  FETCHING_EMAIL_LIST: "Fetching email list",
  FETCHING_EMAILS: "Fetching emails",
  FETCHING_EMAILS_ATTACHMENTS: "Fetching email attachments",
  SYNC_COMPLETED: "Sync completed",
} as const;

export const useProviderInitialSync = () => {
  const [isSyncingMap, setIsSyncingMap] = useState<Record<string, boolean>>({});
  const providersToSync = Object.keys(isSyncingMap);
  const logger = useLogger();
  const providersSyncing = Object.keys(isSyncingMap).filter((email) => {
    return isSyncingMap[email];
  });
  const providersSyncCompleted = Object.keys(isSyncingMap).filter((email) => {
    return !isSyncingMap[email];
  });

  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStep, setSyncStep] = useState<
    (typeof SYNC_STEPS)[keyof typeof SYNC_STEPS]
  >("Getting access to inbox");

  useEffect(() => {
    if (Object.values(isSyncingMap).some((arg) => arg)) {
      const interval = setInterval(
        () => {
          setSyncProgress((prev) => {
            if (prev >= 90) {
              return prev;
            }
            return prev + genRand(1, 4, 0);
          });
        },
        genRand(400, 600, 0),
      );
      return () => clearInterval(interval);
    }
  }, [isSyncingMap, syncProgress]);

  useEffect(() => {
    if (syncProgress === -1) {
      setSyncStep(SYNC_STEPS.ERROR_SYNCING_INBOX);
    } else if (syncProgress < 11) {
      setSyncStep(SYNC_STEPS.GETTING_ACCESS_TO_INBOX);
    } else if (syncProgress < 37) {
      setSyncStep(SYNC_STEPS.FETCHING_EMAIL_LIST);
    } else if (syncProgress < 75) {
      setSyncStep(SYNC_STEPS.FETCHING_EMAILS);
    } else if (syncProgress < 100) {
      setSyncStep(SYNC_STEPS.FETCHING_EMAILS_ATTACHMENTS);
    } else {
      setSyncStep(SYNC_STEPS.SYNC_COMPLETED);
    }
  }, [syncProgress]);

  const { mutateAsync: startGmailInitialSync } = useMutation({
    mutationFn: async (gmailToSync: string) => {
      const syncResponse = await gmailApiWorker.sync.incrementalSync.mutate({
        emailAddress: gmailToSync,
        numberOfMessagesToFetch: INITIAL_MESSAGES_TO_FETCH,
      });

      return syncResponse;
    },
    onError: (e) => {
      logger.error("Error performing incremental sync", { error: e });
    },
  });

  const providerInitialSyncMutation = useMutation({
    mutationFn: async ({
      emailProvider,
      emailToSync,
    }: {
      emailToSync: string;
      emailProvider: SupportedEmailProviderType;
    }) => {
      let emailData: SyncResponseType;
      switch (emailProvider) {
        case "gmail": {
          emailData = await startGmailInitialSync(emailToSync);
          break;
        }
        default:
          throw new Error(`unsupported email provider ${emailProvider}`);
      }
      return emailData;
    },
    onMutate: (variables) => {
      setIsSyncingMap((prev) => ({ ...prev, [variables.emailToSync]: true }));
    },
    onSettled: (_, __, variables) => {
      setIsSyncingMap((prev) => ({ ...prev, [variables.emailToSync]: false }));
    },
    onError: () => {
      setSyncProgress(-1);
    },
    onSuccess: () => {
      setSyncProgress(100);
    },
  });

  return {
    providersToSync,
    providersSyncing,
    providersSyncCompleted,
    providerInitialSyncMutation,
    syncProgress,
    syncStep,
  };
};
