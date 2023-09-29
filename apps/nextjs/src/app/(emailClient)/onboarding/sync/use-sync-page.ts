import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  bulkPutEmails,
  upsertEmailSyncInfo,
  useEmailSyncInfo,
} from "@skylar/client-db";
import {
  state$,
  useActiveEmailClientDb,
  useActiveEmailProvider,
} from "@skylar/logic";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { convertGmailEmailToClientDbEmail } from "~/lib/email";
import { useLogger } from "~/lib/logger";
import { useEmailFullSync } from "./use-email-full-sync";

export function useSyncPage() {
  const activeClientDb = useActiveEmailClientDb();
  const activeEmailProvider = useActiveEmailProvider();
  const { emailSyncInfo, isLoading: isLoadingEmailSyncInfo } = useEmailSyncInfo(
    { db: activeClientDb },
  );
  const { syncProgress, syncStep, startEmailFullSync } = useEmailFullSync();
  const router = useRouter();
  const logger = useLogger();
  const { toast } = useToast();

  useEffect(() => {
    state$.EMAIL_CLIENT.initializeClientDbs();
  }, []);

  useEffect(() => {
    if (
      isLoadingEmailSyncInfo ||
      !activeEmailProvider?.email ||
      !activeClientDb
    ) {
      return;
    } else if (
      !isLoadingEmailSyncInfo &&
      emailSyncInfo?.full_sync_completed_on
    ) {
      router.push("/inbox");
    } else {
      console.log("starting sync");
      startEmailFullSync(
        activeEmailProvider.email,
        activeEmailProvider.emailProvider,
      )
        .then(async (emailData) => {
          console.log("emailData", emailData);
          const emailToSave = convertGmailEmailToClientDbEmail(
            emailData.newMessages,
          );
          await bulkPutEmails({
            db: activeClientDb,
            emails: emailToSave,
          });
          await upsertEmailSyncInfo({
            db: activeClientDb,
            emailSyncInfo: {
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
  }, [
    activeClientDb,
    activeEmailProvider?.email,
    activeEmailProvider?.emailProvider,
    emailSyncInfo?.full_sync_completed_on,
    isLoadingEmailSyncInfo,
    logger,
    router,
    startEmailFullSync,
    toast,
  ]);

  return { activeEmailProvider, syncProgress, syncStep, startEmailFullSync };
}
