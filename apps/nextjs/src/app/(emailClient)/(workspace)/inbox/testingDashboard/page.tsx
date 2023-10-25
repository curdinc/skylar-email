"use client";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Separator } from "@radix-ui/react-dropdown-menu";

import { getEmailThreadsFrom } from "@skylar/client-db";
import { batchModifyLabels, batchTrashThreads } from "@skylar/gmail-api";
import { useActiveEmailClientDb, useActiveEmailProvider } from "@skylar/logic";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/lib/api";
import { ThreadRow, ThreadRowLoading } from "../thread-row";
import { useInboxPage } from "../use-inbox-page";

function displayMetadata(threadId: string) {
  return (
    <>
      <div>Thread Id: {threadId}</div>
    </>
  );
}

function Dashboard() {
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
  const db = useActiveEmailClientDb();
  const [unreadParent, setAnimateUnreadParent] = useAutoAnimate();
  const [readParent, setAnimateReadParent] = useAutoAnimate();
  const activeEmailClient = useActiveEmailProvider();
  const [threadIds, setThreadIds] = useState<string[]>([]);
  const { mutateAsync: fetchGmailAccessToken } =
    api.gmail.getAccessToken.useMutation();

  const getThreads = () => {
    console.log(threadIds);
  };
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
      <div key={thread.email_provider_thread_id}>
        {displayMetadata(thread.email_provider_thread_id)}
        <ThreadRow
          thread={thread}
          isRead={false}
          activeEmail={activeEmailClient?.email ?? ""}
        />
      </div>
    );
  });
  if (isLoadingUnreadThreads) {
    UnreadThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }
  let ReadThreadList = readThreads?.map((thread) => {
    return (
      <div key={thread.email_provider_thread_id}>
        {displayMetadata(thread.email_provider_thread_id)}
        <ThreadRow
          thread={thread}
          isRead
          activeEmail={activeEmailClient?.email ?? ""}
        />
      </div>
    );
  });
  if (isLoadingReadThreads) {
    ReadThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-1 ">
      <div>
        activeEmailClient:{" "}
        <pre>{JSON.stringify(activeEmailClient, null, 2)}</pre>
      </div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Toolkit</h2>
      </div>
      <div className="flex items-center gap-2">
        ThreadIds:
        <Input
          placeholder="Enter comma separated list of threadIds"
          onChange={(e) => {
            e.preventDefault();
            setThreadIds(e.target.value.split(",").map((x) => x.trim()));
          }}
        />
      </div>
      <Button
        onClick={async () => {
          const emailId = activeEmailClient?.email;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });
          const res = await batchTrashThreads({
            threadIds,
            accessToken,
            emailId,
          });
          console.log("res", res);
        }}
      >
        DeleteThreadsBulk
      </Button>
      <Button
        onClick={async () => {
          const emailId = activeEmailClient?.email;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });
          const res = await batchModifyLabels({
            threadIds,
            accessToken,
            emailId,
            addLabels: [],
            deleteLabels: ["INBOX"],
          });
          console.log("res", res);
        }}
      >
        ArchiveThreadsBulk
      </Button>
      <Button
        onClick={async () => {
          console.log("hello");
          if (db) {
            const res = await getEmailThreadsFrom({
              db,
              senderEmail: "US.donotreply@cibc.com",
            });
            console.log("res", res);
          }
        }}
      >
        Test
      </Button>
      <Separator className="mt-1" />
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

export default Dashboard;
