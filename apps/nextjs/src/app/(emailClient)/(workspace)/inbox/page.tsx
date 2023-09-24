"use client";

import { Button } from "~/components/ui/button";
import { useFullSync } from "~/lib/email-provider/gmail/use-full-sync";
import { usePartialSync } from "~/lib/email-provider/gmail/use-partial-sync";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const startHistoryId = "1626097";
  const { fetch: partialSync, isFetching: isFetchingPartialSync } =
    usePartialSync(startHistoryId);
  const { fetch: fullSync, isFetching: isFetchingFullSync } = useFullSync();
  useInboxPage();

  return (
    <div>
      <div>Important Inbox</div>
      <Button
        onClick={() => {
          fullSync().catch((err) => console.log("err", err));
        }}
        isLoading={isFetchingFullSync}
      >
        Full-sync
      </Button>
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
