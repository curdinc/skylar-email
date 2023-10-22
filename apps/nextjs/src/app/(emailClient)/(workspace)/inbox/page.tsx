"use client";

import { useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { EMAIL_PROVIDER_LABELS } from "@skylar/client-db";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ThreadRow, ThreadRowLoading } from "./thread-row";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const { threads, isLoadingThreads, nextPage, prevPage } = useInboxPage();
  const [threadParent, setAnimateThreadParent] = useAutoAnimate();

  useEffect(() => {
    // This is used to prevent the animation from triggering on the first load
    const ARTIFICIAL_DELAY = 50;
    if (isLoadingThreads) {
      setAnimateThreadParent(false);
    } else {
      setTimeout(() => {
        setAnimateThreadParent(true);
      }, ARTIFICIAL_DELAY);
    }
  }, [isLoadingThreads, setAnimateThreadParent]);

  let ThreadList = threads?.map((thread) => {
    return (
      <ThreadRow
        key={thread.email_provider_thread_id}
        thread={thread}
        isRead={
          !thread.email_provider_labels.includes(
            EMAIL_PROVIDER_LABELS.GMAIL.UNREAD,
          )
        }
      />
    );
  });
  if (isLoadingThreads) {
    ThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-1 ">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Inbox</h2>
        <p className="text-muted-foreground">All your emails in one place</p>
      </div>
      <Separator className="mt-1" />
      <div className="grid gap-5" ref={threadParent}>
        {ThreadList}
      </div>
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
