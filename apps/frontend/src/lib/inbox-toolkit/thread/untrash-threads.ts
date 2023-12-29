import type { ThreadType } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { updateAndSaveLabels } from "../utils";

export async function untrashThreads({
  threads,
  emailAddress,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  emailAddress: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
}) {
  const labelsToAdd = Array<string[]>(threads.length).fill(["INBOX"]);
  const labelsToRemove = Array<string[]>(threads.length).fill(["TRASH"]);

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
