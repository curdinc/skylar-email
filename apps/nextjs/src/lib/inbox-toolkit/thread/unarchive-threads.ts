import { bulkPutThreads, clientDb } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

export async function unarchiveThreads({
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

    if (inboxIndex === 1) {
      console.log("something weird going on");
    } else {
      thread.email_provider_labels.push("INBOX");
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
    addLabels: ["INBOX"],
    deleteLabels: [],
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
  console.log("res", res);

  return updatedThreads;
}
