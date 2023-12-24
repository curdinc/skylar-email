import type { ThreadType } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { updateAndSaveLabels } from "../utils";

export async function markUnreadThreads({
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
  const labelsToRemove = Array<string[]>(threads.length).fill([]);
  const labelsToAdd = Array<string[]>(threads.length).fill(["UNREAD"]);

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
    emailAddress: email,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
}
