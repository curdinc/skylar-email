"use client";

import { useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { useActiveEmailProvider } from "@skylar/logic";

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
  const [unreadParent, setAnimateUnreadParent] = useAutoAnimate();
  const [readParent, setAnimateReadParent] = useAutoAnimate();
  const activeEmailClient = useActiveEmailProvider();

  useEffect(() => {
    // This is used to prevent the animation from triggering on the first load
    const ARTIFICIAL_DELAY = 50;
    if (isLoadingReadThreads) {
      setAnimateReadParent(false);
    } else {
      setTimeout(() => {
        setAnimateReadParent(true);
      }, ARTIFICIAL_DELAY);
    }
    if (isLoadingUnreadThreads) {
      setAnimateUnreadParent(false);
    } else {
      setTimeout(() => {
        setAnimateUnreadParent(true);
      }, ARTIFICIAL_DELAY);
    }
  }, [
    isLoadingReadThreads,
    isLoadingUnreadThreads,
    setAnimateReadParent,
    setAnimateUnreadParent,
  ]);

  let UnreadThreadList = unreadThreads?.map((thread) => {
    return (
      <ThreadRow
        key={thread.email_provider_thread_id}
        thread={thread}
        isRead={false}
        activeEmail={activeEmailClient?.email ?? ""}
      />
    );
  });
  if (isLoadingUnreadThreads) {
    UnreadThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }
  let ReadThreadList = readThreads?.map((thread) => {
    return (
      <ThreadRow
        key={thread.email_provider_thread_id}
        thread={thread}
        isRead
        activeEmail={activeEmailClient?.email ?? ""}
      />
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
      <div className="grid gap-5" ref={unreadParent}>
        {UnreadThreadList}
      </div>
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
      <div className="grid gap-5" ref={readParent}>
        {" "}
        {ReadThreadList}
      </div>
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
