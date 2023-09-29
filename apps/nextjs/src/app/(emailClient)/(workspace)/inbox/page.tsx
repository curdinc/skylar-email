"use client";

import { Button } from "~/components/ui/button";
import { ThreadRow } from "./thread-row";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const { isLoadingThreads, threads, nextPage, prevPage } = useInboxPage();

  if (isLoadingThreads) {
    return <div>Loading...</div>;
  }

  const ThreadList = threads?.map((thread) => {
    return <ThreadRow key={thread.email_provider_thread_id} thread={thread} />;
  });

  return (
    <div className="grid grid-cols-1 gap-5 p-1 ">
      {ThreadList}
      <div className="flex justify-between">
        <Button variant={"secondary"} onClick={prevPage}>
          Prev
        </Button>
        <Button variant={"secondary"} onClick={nextPage}>
          Next
        </Button>
      </div>
    </div>
  );
}
