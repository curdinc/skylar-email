"use client";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ThreadRow, ThreadRowLoading } from "./thread-row";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const {
    readThreads,
    isLoadingReadThreads,
    nextReadPage,
    prevReadPage,
    unreadThreads,
    isLoadingUnreadThreads,
    nextUnreadPage,
    prevUnreadPage,
  } = useInboxPage();

  console.log("unreadThreads", unreadThreads);
  let UnreadThreadList = unreadThreads?.map((thread) => {
    return (
      <ThreadRow
        key={thread.email_provider_thread_id}
        thread={thread}
        isRead={false}
      />
    );
  });
  if (isLoadingUnreadThreads) {
    UnreadThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }
  console.log("readThreads", readThreads);
  let ReadThreadList = readThreads?.map((thread) => {
    return (
      <ThreadRow key={thread.email_provider_thread_id} thread={thread} isRead />
    );
  });
  if (isLoadingReadThreads) {
    ReadThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-1 ">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Unread</h2>
        <p className="text-muted-foreground">
          All your unread emails in one place
        </p>
      </div>
      <Separator className="mt-1" />
      {UnreadThreadList}
      <div className="flex justify-between">
        <Button
          variant={"secondary"}
          disabled={isLoadingUnreadThreads}
          onClick={prevUnreadPage}
        >
          Prev
        </Button>
        <Button
          variant={"secondary"}
          disabled={isLoadingUnreadThreads}
          onClick={nextUnreadPage}
        >
          Next
        </Button>
      </div>
      <div className="mt-5 space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Read</h2>
        <p className="text-muted-foreground">All your completed emails</p>
      </div>
      <Separator className="mt-1" />
      {ReadThreadList}
      <div className="flex justify-between">
        <Button
          variant={"secondary"}
          disabled={isLoadingReadThreads}
          onClick={prevReadPage}
        >
          Prev
        </Button>
        <Button
          variant={"secondary"}
          disabled={isLoadingReadThreads}
          onClick={nextReadPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
