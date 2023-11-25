import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

import { updateAndSaveLabels } from "../utils";

export async function untrashThreads({
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
  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd: ["INBOX"],
    labelsToRemove: ["TRASH"],
  });

  console.log("UNTRASH updatedThreads", updatedThreads);
  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchModifyLabels({
    accessToken,
    addLabels: ["INBOX"],
    deleteLabels: ["TRASH"],
    emailId: email,
    threadIds: updatedThreads.map((t) => t.email_provider_thread_id),
  });
}
