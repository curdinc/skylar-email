"use client";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";

import {
  bulkGetThreads,
  clientDb,
  EMAIL_PROVIDER_LABELS,
  getEmailThreadsFrom,
} from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchCreateLabels, listLabels } from "@skylar/gmail-api";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/lib/api";
import { archiveThreads } from "~/lib/inbox-toolkit/thread/archive-threads";
import { moveThreads } from "~/lib/inbox-toolkit/thread/move-threads";
import { trashThreads } from "~/lib/inbox-toolkit/thread/trash-threads";
import { unarchiveThreads } from "~/lib/inbox-toolkit/thread/unarchive-threads";
import { untrashThreads } from "~/lib/inbox-toolkit/thread/untrash-threads";
import { ThreadRow, ThreadRowLoading } from "../thread-row";
import { useInboxPage } from "../use-inbox-page";

function displayMetadata(thread: ThreadType) {
  return (
    <>
      <div>Thread Id: {thread.email_provider_thread_id}</div>
      <pre>Labels: {thread.email_provider_labels.join(", ")}</pre>
    </>
  );
}

export default function Dashboard() {
  const { threads, isLoadingThreads, nextPage, prevPage, refetch } =
    useInboxPage();
  const [threadParent, setAnimateThreadParent] = useAutoAnimate();
  const [threadIds, setThreadIds] = useState<string[]>([]);
  const [labelNames, setLabelNames] = useState<string[]>([]);
  const activeEmail = "hansbhatia0342@gmail.com";
  const { mutateAsync: fetchGmailAccessToken } =
    api.gmail.getAccessToken.useMutation();
  const {
    isLoading: isLoadingLabelList,
    data: labels,
    refetch: refetchAllLabels,
  } = useQuery({
    queryKey: ["LABEL_LIST", activeEmail],
    queryFn: async () => {
      const accessToken = await fetchGmailAccessToken({
        email: activeEmail,
      });
      const labels = await listLabels({
        accessToken,
        emailId: activeEmail,
      });
      return labels;
    },
  });
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
      <>
        {displayMetadata(thread)}
        <ThreadRow
          key={thread.email_provider_thread_id}
          thread={thread}
          isRead={
            !thread.email_provider_labels.includes(
              EMAIL_PROVIDER_LABELS.GMAIL.UNREAD,
            )
          }
        />
      </>
    );
  });
  if (isLoadingThreads) {
    ThreadList = Array.from(Array(10)).map((_, idx) => {
      return <ThreadRowLoading key={idx} />;
    });
  }

  const getThreads = async (threadIds: string[]) => {
    const res = await bulkGetThreads({
      db: clientDb,
      emailProviderThreadIds: threadIds,
    });
    const definedRes = res.filter((t) => {
      return t;
    }) as ThreadType[];
    console.log("definedRes", definedRes);
    return definedRes;
  };

  return (
    <div className="grid grid-cols-1 gap-5 p-1 ">
      {/* <div>
        activeEmailClient:{" "}
        <pre>{JSON.stringify(activeEmailClient, null, 2)}</pre>
      </div> */}
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Toolkit</h2>
      </div>
      {!isLoadingLabelList && (
        <div className="break-words">
          {labels?.map((l) => l.name).join(",")}
        </div>
      )}
      <div className="flex items-center gap-2">
        Labels:
        <Input
          placeholder="Enter comma separated list of labeldIds"
          value={labelNames}
          onChange={(e) => {
            e.preventDefault();
            setLabelNames(e.target.value.split(",").map((x) => x.trim()));
          }}
        />
      </div>
      <Button
        onClick={async () => {
          const emailId = activeEmail;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });

          const res = await batchCreateLabels({
            accessToken,
            emailId,
            labels: labelNames.map((l) => ({
              name: l,
            })),
          });
          console.log("res", res);
          await refetchAllLabels();
        }}
      >
        CreateLabelsBulk
      </Button>
      <div className="flex items-center gap-2">
        ThreadIds:
        <Input
          placeholder="Enter comma separated list of threadIds"
          value={threadIds}
          onChange={(e) => {
            e.preventDefault();
            setThreadIds(e.target.value.split(",").map((x) => x.trim()));
          }}
        />
      </div>
      {/* <Button
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
      </Button> */}
      <Button
        onClick={async () => {
          const emailId = activeEmail;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });
          const threads = await getThreads(threadIds);

          const res = await archiveThreads({
            threads,
            accessToken,
            email: emailId,
            afterClientDbUpdate: [refetch],
          });
          console.log("res", res);
        }}
      >
        ArchiveThreadsBulk
      </Button>
      <Button
        onClick={async () => {
          const emailId = activeEmail;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });
          const threads = await getThreads(threadIds);

          const res = await unarchiveThreads({
            threads,
            accessToken,
            email: emailId,
            afterClientDbUpdate: [refetch],
          });
          console.log("res", res);
        }}
      >
        UnarchiveThreadsBulk
      </Button>
      <Button
        onClick={async () => {
          const emailId = activeEmail;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });
          const threads = await getThreads(threadIds);

          const res = await trashThreads({
            threads,
            accessToken,
            email: emailId,
            afterClientDbUpdate: [refetch],
          });
          console.log("res", res);
        }}
      >
        TrashThreadsBulk
      </Button>
      <Button
        onClick={async () => {
          const emailId = activeEmail;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });
          const threads = await getThreads(threadIds);

          const res = await untrashThreads({
            threads,
            accessToken,
            email: emailId,
            afterClientDbUpdate: [refetch],
          });
          console.log("res", res);
        }}
      >
        UntrashThreadsBulk
      </Button>
      <Button
        onClick={async () => {
          const emailId = activeEmail;
          if (!emailId) {
            return;
          }
          const accessToken = await fetchGmailAccessToken({
            email: emailId,
          });
          const threads = await getThreads(threadIds);

          const res = await moveThreads({
            threads,
            labelToAdd: "CATEGORY_PROMOTIONS",
            labelToRemove: "INBOX",
            accessToken,
            email: emailId,
            afterClientDbUpdate: [refetch],
          });
          console.log("res", res);
        }}
      >
        MoveThreadsBulk
      </Button>
      bulkGetThreads
      <Button
        onClick={async () => {
          console.log("hello");
          const res = await getEmailThreadsFrom({
            db: clientDb,
            senderEmail: "updates@academia-mail.com",
          });
          console.log("res", res);
          setThreadIds(res.map((t) => t.email_provider_thread_id));
        }}
      >
        Test
      </Button>
      <Separator className="mt-1" />
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
