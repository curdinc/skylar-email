"use client";

import { Button } from "~/components/ui/button";
import { usePartialSync } from "~/lib/email-provider/gmail/use-partial-sync";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const startHistoryId = "1626097";
  const { fetch: partialSync, isFetching: isFetchingPartialSync } =
    usePartialSync(startHistoryId);
  const { isLoadingThreads, threads } = useInboxPage();
  console.log("isLoadingThreads,threads", isLoadingThreads, threads);
  return (
    <div>
      <Button
        className="ml-10"
        onClick={() => {
          partialSync().catch((err) => console.log("err", err));
        }}
        isLoading={isFetchingPartialSync}
      >
        Partial-sync
      </Button>
    </div>
  );
}
