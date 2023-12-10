import { useCallback, useEffect, useState } from "react";

import { fullSync } from "@skylar/gmail-api";
import type { SyncResponseType } from "@skylar/parsers-and-types";
import type { SupportedEmailProviderType } from "@skylar/parsers-and-types/src/api/email-provider/oauth";

import { useLogger } from "~/lib/logger";
import { useAccessToken } from "~/lib/provider/use-access-token";

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
  GETTING_ACCESS_TO_INBOX: "Getting access to inbox",
  FETCHING_EMAIL_LIST: "Fetching email list",
  FETCHING_EMAILS: "Fetching emails",
  FETCHING_EMAILS_ATTACHMENTS: "Fetching email attachments",
  SYNC_COMPLETED: "Sync completed",
} as const;

export const useEmailFullSync = () => {
  const [isSyncingMap, setIsSyncingMap] = useState<Record<string, boolean>>({});
  const emailsToSync = Object.keys(isSyncingMap).filter((email) => {
    return isSyncingMap[email];
  });
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStep, setSyncStep] = useState<
    (typeof SYNC_STEPS)[keyof typeof SYNC_STEPS]
  >("Getting access to inbox");
  const { mutateAsync: fetchGmailAccessToken } = useAccessToken();
  const logger = useLogger();

  useEffect(() => {
    if (Object.values(isSyncingMap).some((arg) => arg)) {
      const interval = setInterval(
        () => {
          setSyncProgress((prev) => {
            if (prev >= 90) {
              return prev;
            }
            return prev + 1;
          });
        },
        genRand(400, 600, 0),
      );
      return () => clearInterval(interval);
    } else if (
      Object.values(isSyncingMap).every((arg) => !arg) &&
      syncProgress > 0
    ) {
      setSyncProgress(100);
    }
  }, [isSyncingMap, syncProgress]);

  useEffect(() => {
    if (syncProgress < 11) {
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

  const startGmailFullSync = useCallback(
    async (gmailToSync: string) => {
      const accessToken = await fetchGmailAccessToken({
        email: gmailToSync,
      });

      const emailData = await fullSync({
        accessToken,
        emailId: gmailToSync,
        logger,
      });
      return emailData;
    },
    [fetchGmailAccessToken, logger],
  );

  const startEmailFullSync = useCallback(
    async (emailToSync: string, emailProvider: SupportedEmailProviderType) => {
      setIsSyncingMap((prev) => ({ ...prev, [emailToSync]: true }));
      let emailData: SyncResponseType;
      try {
        switch (emailProvider) {
          case "gmail": {
            emailData = await startGmailFullSync(emailToSync);
            break;
          }
          default:
            throw new Error(`unsupported email provider ${emailProvider}`);
        }
        setIsSyncingMap((prev) => ({ ...prev, [emailToSync]: false }));
        return emailData;
      } catch (e) {
        setIsSyncingMap((prev) => ({ ...prev, [emailToSync]: false }));
        throw e;
      }
    },
    [startGmailFullSync],
  );

  return {
    emailsToSync,
    startEmailFullSync,
    syncProgress,
    syncStep,
  };
};
