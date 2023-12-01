import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

import { updateAndSaveLabels } from "../utils";

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
  const labelsToAdd = Array<string[]>(threads.length).fill(["INBOX"]);
  const labelsToRemove = Array<string[]>(threads.length).fill([]);

  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd: labelsToAdd,
    labelsToRemove: labelsToRemove,
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchModifyLabels({
    accessToken,
    addLabels: labelsToAdd,
    deleteLabels: labelsToRemove,
    emailId: email,
    threadIds: updatedThreads.map((t) => t.email_provider_thread_id),
  });
}
