"use client";

import { Button } from "~/components/ui/button";
import { ThreadRow, ThreadRowLoading } from "./thread-row";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const { isLoadingThreads, threads, nextPage, prevPage } = useInboxPage();

  let ThreadList = threads?.map((thread) => {
    return <ThreadRow key={thread.email_provider_thread_id} thread={thread} />;
  });
  if (isLoadingThreads) {
    ThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-1 ">
      {ThreadList}
      <div className="flex justify-between">
        <Button
          variant={"secondary"}
          disabled={isLoadingThreads}
          onClick={prevPage}
        >
          Prev
        </Button>
        <Button
          variant={"secondary"}
          disabled={isLoadingThreads}
          onClick={nextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
