import { batchModifyLabels } from "@skylar/gmail-api";
import type { ThreadType } from "@skylar/parsers-and-types";

import { updateAndSaveLabels } from "../utils";

export async function moveThreads({
  threads,
  labelsToAdd,
  labelsToRemove,
  email,
  accessToken,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  labelsToAdd: string[][];
  labelsToRemove: string[][];
  email: string;
  accessToken: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
}) {
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