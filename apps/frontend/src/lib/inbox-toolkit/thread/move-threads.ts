import type { ThreadType } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { updateAndSaveLabels } from "../utils";

export async function moveThreads({
  threads,
  labelsToAdd,
  labelsToRemove,
  emailAddress,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  labelsToAdd: string[][];
  labelsToRemove: string[][];
  emailAddress: string;
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

  await gmailApiWorker.label.modify.mutate({
    addLabelsIds: labelsToAdd,
    deleteLabelsIds: labelsToRemove,
    emailAddress,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
}
