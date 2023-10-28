import { bulkPutThreads, clientDb } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

export async function archiveThreads({
  threads,
  email,
  accessToken,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  email: string;
  accessToken: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
}) {
  const activeClientDb = clientDb;
  console.log("Archive Threads");

  const updatedThreads = threads.map((thread) => {
    console.log("thread", thread);
    const inboxIndex = thread.email_provider_labels.indexOf("INBOX");

    if (inboxIndex === -1) {
      console.log("something weird going on");
    } else {
      thread.email_provider_labels.splice(inboxIndex, 1);
    }
    return thread;
  });
  await bulkPutThreads({
    db: activeClientDb,
    threads: updatedThreads,
  }).then(async () => {
    for (const func of afterClientDbUpdate) {
      await func();
    }
  });

  console.log("gmail change");
  const res = await batchModifyLabels({
    accessToken,
    addLabels: [],
    deleteLabels: ["INBOX"],
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
  console.log("res", res);
}
