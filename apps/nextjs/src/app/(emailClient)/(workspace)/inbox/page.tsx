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

  if (isLoadingThreads) {
    return <div>Loading...</div>;
  }
  const ThreadList = threads?.map((thread) => {
    return (
      <div key={thread.email_provider_thread_id}>{thread.latest_snippet}</div>
    );
  });
  return (
    <div className="grid gap-3">
      <Button
        className="ml-10"
        onClick={() => {
          partialSync("name@example.com").catch((err) =>
            console.log("err", err),
          );
        }}
        isLoading={isFetchingPartialSync}
      >
        Partial-sync
      </Button>
      {ThreadList}
    </div>
  );
}
