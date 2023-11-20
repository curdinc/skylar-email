import { bulkPutThreads, clientDb } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchTrashThreads } from "@skylar/gmail-api";

export async function trashThreads({
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
  console.log("Trash Threads");

  const updatedThreads = threads.map((thread) => {
    const inboxIndex = thread.email_provider_labels.indexOf("INBOX");
    if (inboxIndex !== -1) {
      thread.email_provider_labels.splice(inboxIndex, 1);
    }

    const trashIndex = thread.email_provider_labels.indexOf("TRASH");
    if (trashIndex === -1) {
      thread.email_provider_labels.push("TRASH");
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
  const res = await batchTrashThreads({
    accessToken,
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
  console.log("res", res);
}
