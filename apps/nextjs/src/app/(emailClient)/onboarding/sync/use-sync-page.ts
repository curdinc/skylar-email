import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useEmailSyncInfo } from "@skylar/client-db";
import { useActiveEmailClientDb, useActiveEmailProvider } from "@skylar/logic";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
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
    console.log("Running sync page info");
    console.log("isLoadingEmailSyncInfo", isLoadingEmailSyncInfo);
    console.log("activeEmailProvider?.email", activeEmailProvider?.email);
    if (isLoadingEmailSyncInfo || !activeEmailProvider?.email) {
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
        .then((emailData) => {
          console.log("emailData", emailData);
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
    activeEmailProvider?.email,
    activeEmailProvider?.emailProvider,
    emailSyncInfo?.full_sync_completed_on,
    isLoadingEmailSyncInfo,
    router,
    logger,
    toast,
    startEmailFullSync,
  ]);

  return { activeEmailProvider, syncProgress, syncStep, startEmailFullSync };
}
