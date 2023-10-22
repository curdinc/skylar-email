import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  bulkPutEmails,
  upsertEmailSyncInfo,
  useEmailSyncInfo,
} from "@skylar/client-db";
import {
  setEmailProviders,
  useActiveEmailProviders,
  useActiveEmails,
} from "@skylar/logic";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useLogger } from "~/lib/logger";
import { useEmailFullSync } from "./use-email-full-sync";

export function useSyncPage() {
  const activeEmails = useActiveEmails();
  const activeEmailProviders = useActiveEmailProviders();
  const { data: emailProviders, isLoading: isLoadingAllEmailProviders } =
    api.emailProvider.getAll.useQuery();

  const { emailSyncInfo, isLoading: isLoadingEmailSyncInfo } = useEmailSyncInfo(
    { emailAddresses: activeEmails },
  );
  const { syncProgress, syncStep, startEmailFullSync, emailsToSync } =
    useEmailFullSync();
  const router = useRouter();
  const logger = useLogger();
  const { toast } = useToast();

  useEffect(() => {
    if (
      !isLoadingAllEmailProviders &&
      emailProviders &&
      !activeEmailProviders?.length
    ) {
      setEmailProviders(emailProviders);
    }
  }, [
    activeEmailProviders?.length,
    emailProviders,
    isLoadingAllEmailProviders,
  ]);

  useEffect(() => {
    if (isLoadingEmailSyncInfo || !activeEmails.length) {
      return;
    } else if (
      !isLoadingEmailSyncInfo &&
      emailSyncInfo?.length === activeEmails.length
    ) {
      router.push("/inbox");
    } else {
      console.log("starting sync");
      for (const activeEmailProvider of activeEmailProviders) {
        const syncInfo = emailSyncInfo?.find(
          (info) =>
            info.email_sync_info_id.toLowerCase() ===
            activeEmailProvider.email.toLowerCase(),
        );
        if (syncInfo?.full_sync_completed_on) {
          continue;
        }
        startEmailFullSync(
          activeEmailProvider.email,
          activeEmailProvider.emailProvider,
        )
          .then(async (emailData) => {
            console.log("emailData", emailData);
            const emailToSave = convertGmailEmailToClientDbEmail(
              activeEmailProvider.email,
              emailData.newMessages,
            );
            await bulkPutEmails({
              emails: emailToSave,
            });
            await upsertEmailSyncInfo({
              emailSyncInfo: {
                email_sync_info_id: activeEmailProvider.email,
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
    activeEmails,
    activeEmailProviders,
    activeEmails.length,
    emailSyncInfo,
    emailSyncInfo?.length,
    isLoadingEmailSyncInfo,
    logger,
    router,
    startEmailFullSync,
    toast,
  ]);

  return {
    activeEmailProviders,
    emailsToSync,
    syncProgress,
    syncStep,
    startEmailFullSync,
  };
}
