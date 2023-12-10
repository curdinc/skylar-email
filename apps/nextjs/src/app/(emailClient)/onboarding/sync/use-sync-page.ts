import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  bulkPutMessages,
  upsertEmailSyncInfo,
  useConnectedProviders,
  useProviderSyncInfo,
} from "@skylar/client-db";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useLogger } from "~/lib/logger";
import { useEmailFullSync } from "./use-email-full-sync";

export function useSyncPage() {
  const { data: allEmailProviders } = useConnectedProviders();

  const { emailSyncInfo, isLoading: isLoadingEmailSyncInfo } =
    useProviderSyncInfo({
      emailAddresses: (allEmailProviders ?? []).map(
        (provider) => provider.email,
      ),
    });
  const { syncProgress, syncStep, startEmailFullSync, emailsToSync } =
    useEmailFullSync();
  const router = useRouter();
  const logger = useLogger();
  const { toast } = useToast();

  useEffect(() => {
    if (!allEmailProviders) {
      return;
    }
    if (isLoadingEmailSyncInfo || !allEmailProviders.length) {
      return;
    } else if (
      !isLoadingEmailSyncInfo &&
      emailSyncInfo?.length === allEmailProviders.length
    ) {
      router.push("/1");
    } else {
      console.log("starting sync");
      for (const activeEmailProvider of allEmailProviders) {
        const syncInfo = emailSyncInfo?.find(
          (info) =>
            info.user_email_address.toLowerCase() ===
            activeEmailProvider.email.toLowerCase(),
        );
        if (syncInfo?.full_sync_completed_on) {
          continue;
        }
        startEmailFullSync(activeEmailProvider.email, activeEmailProvider.type)
          .then(async (emailData) => {
            console.log("emailData", emailData);
            const emailToSave = convertGmailEmailToClientDbEmail(
              activeEmailProvider.email,
              emailData.newMessages,
            );
            await bulkPutMessages({
              messages: emailToSave,
            });
            await upsertEmailSyncInfo({
              emailSyncInfo: {
                user_email_address: activeEmailProvider.email,
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
    allEmailProviders?.length,
    emailSyncInfo,
    emailSyncInfo?.length,
    isLoadingEmailSyncInfo,
    logger,
    router,
    startEmailFullSync,
    toast,
  ]);

  return {
    activeEmailProviders: allEmailProviders,
    emailsToSync,
    syncProgress,
    syncStep,
    startEmailFullSync,
  };
}
