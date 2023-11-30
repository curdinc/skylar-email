import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

import { getLabelModifications, updateAndSaveLabels } from "../utils";

export async function moveThreads({
  threads,
  newLabels,
  email,
  accessToken,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  newLabels: string[];
  email: string;
  accessToken: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
}) {
  const labelsToAdd: string[][] = [];
  const labelsToRemove: string[][] = [];
  threads.map((thread) => {
    const { labelsToAdd: addLabels, labelsToRemove: removeLabels } =
      getLabelModifications({
        currentLabels: thread.email_provider_labels,
        newLabels,
      });

    labelsToAdd.push(addLabels);
    labelsToRemove.push(removeLabels);
  });

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
    threadIds: updatedThreads.map((t) => t.email_provider_thread_id),
  });
}
