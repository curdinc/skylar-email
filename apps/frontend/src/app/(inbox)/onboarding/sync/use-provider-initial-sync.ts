import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLogger } from "next-axiom";

import { incrementalSync } from "@skylar/gmail-api";
import type { SyncResponseType } from "@skylar/parsers-and-types";
import type { SupportedEmailProviderType } from "@skylar/parsers-and-types/src/api/email-provider/oauth";

import { useAccessToken } from "~/lib/provider/use-access-token";

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
  const { mutateAsync: fetchGmailAccessToken } = useAccessToken();

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

  const logger = useLogger();

  const { mutateAsync: startGmailInitialSync } = useMutation({
    mutationFn: async (gmailToSync: string) => {
      const accessToken = await fetchGmailAccessToken({
        email: gmailToSync,
      });

      const emailData = await incrementalSync({
        accessToken,
        emailId: gmailToSync,
        onError: (e) => {
          logger.error("Error performing incremental sync", { error: e });
        },
        numberOfMessagesToFetch: INITIAL_MESSAGES_TO_FETCH,
      });
      return emailData;
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
      await new Promise((_, rej) =>
        setTimeout(() => rej("Something went wrong"), 4_000),
      );
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
