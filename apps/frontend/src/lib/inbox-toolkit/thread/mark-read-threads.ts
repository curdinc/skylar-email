import { batchModifyLabels } from "@skylar/gmail-api";
import type { ThreadType } from "@skylar/parsers-and-types";

import { updateAndSaveLabels } from "../utils";

export async function markReadThreads({
  threads,
  email,
  accessToken,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  email: string;
  accessToken: string;
  afterClientDbUpdate: (() => Promise<void>)[];
}) {
  const labelsToAdd = Array<string[]>(threads.length).fill([]);
  const labelsToRemove = Array<string[]>(threads.length).fill(["UNREAD"]);

  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd,
    labelsToRemove,
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchModifyLabels({
    accessToken,
    addLabels: labelsToAdd,
    deleteLabels: labelsToRemove,
    emailId: email,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
}
