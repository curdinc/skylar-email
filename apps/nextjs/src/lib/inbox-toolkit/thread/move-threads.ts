import { bulkPutThreads, clientDb } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

export async function moveThreads({
  threads,
  labelToRemove,
  labelToAdd,
  email,
  accessToken,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  labelToRemove: string;
  labelToAdd: string;
  email: string;
  accessToken: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
}) {
  const activeClientDb = clientDb;
  console.log("Move Threads");

  const updatedThreads = threads.map((thread) => {
    console.log("thread", thread);
    const labelToRemoveIndex =
      thread.email_provider_labels.indexOf(labelToRemove);
    if (labelToRemoveIndex === -1) {
      console.log("something weird going on");
    } else {
      thread.email_provider_labels.splice(labelToRemoveIndex, 1);
    }

    const labelToAddIndex = thread.email_provider_labels.indexOf(labelToAdd);
    if (labelToAddIndex !== -1) {
      console.log("something weird going on");
    } else {
      thread.email_provider_labels.push(labelToAdd);
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
    addLabels: [labelToAdd],
    deleteLabels: [labelToRemove],
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
  console.log("res", res);
}
