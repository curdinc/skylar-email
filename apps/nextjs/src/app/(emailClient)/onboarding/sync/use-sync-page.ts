import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  bulkPutEmails,
  upsertEmailSyncInfo,
  useAllEmailProviders,
  useEmailSyncInfo,
} from "@skylar/client-db";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useLogger } from "~/lib/logger";
import {
  ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX,
  ROUTE_EMAIL_PROVIDER_INBOX,
  ROUTE_ONBOARDING_CONNECT,
} from "~/lib/routes";
import { useEmailFullSync } from "./use-email-full-sync";

export function useSyncPage() {
  const { data: allEmailProviders, isPending: isLoadingAllEmailProviders } =
    useAllEmailProviders();

  const { data: emailSyncInfo, isLoading: isLoadingEmailSyncInfo } =
    useEmailSyncInfo({
      emailAddresses: (allEmailProviders ?? []).map(
        (provider) => provider.email,
      ),
    });
  const runOnceRef = useRef(false);
  const {
    syncProgress,
    syncStep,
    emailFullSyncMutation: { mutateAsync: startEmailFullSync },
    providersSyncing,
  } = useEmailFullSync();
  const router = useRouter();
  const logger = useLogger();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoadingEmailSyncInfo || isLoadingAllEmailProviders) {
      return;
    }
    if (!allEmailProviders?.length) {
      router.push(ROUTE_ONBOARDING_CONNECT);
      return;
    }
    if (emailSyncInfo?.length === allEmailProviders.length) {
      router.push(
        ROUTE_EMAIL_PROVIDER_INBOX(ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX),
      );
    } else if (!runOnceRef.current) {
      runOnceRef.current = true;
      for (const emailProvider of allEmailProviders) {
        const syncInfo = emailSyncInfo?.find(
          (info) =>
            info.email_sync_info_id.toLowerCase() ===
            emailProvider.email.toLowerCase(),
        );
        if (syncInfo?.full_sync_completed_on) {
          continue;
        }
        startEmailFullSync({
          emailToSync: emailProvider.email,
          emailProvider: emailProvider.email_provider,
        })
          .then(async (emailData) => {
            console.log("emailData", emailData);
            const emailToSave = convertGmailEmailToClientDbEmail(
              emailProvider.email,
              emailData.newMessages,
            );
            await bulkPutEmails({
              emails: emailToSave,
            });
            await upsertEmailSyncInfo({
              emailSyncInfo: {
                email_sync_info_id: emailProvider.email,
                full_sync_completed_on: new Date().getTime(),
                last_sync_history_id: emailData.lastCheckedHistoryId,
                last_sync_history_id_updated_at: new Date().getTime(),
              },
            });
          })
          .catch((e) => {
            logger.error("Error performing full sync for user gmail inbox", {
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
    }
  }, [
    allEmailProviders,
    emailSyncInfo,
    isLoadingAllEmailProviders,
    isLoadingEmailSyncInfo,
    logger,
    router,
    startEmailFullSync,
    toast,
  ]);

  return {
    emailProviders: allEmailProviders,
    providersSyncing,
    syncProgress,
    syncStep,
    startEmailFullSync,
  };
}
