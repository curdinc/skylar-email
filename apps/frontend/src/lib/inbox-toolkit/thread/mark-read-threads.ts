import type { ThreadType } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { updateAndSaveLabels } from "../utils";

export async function markReadThreads({
  threads,
  email,
  beforeClientDbUpdate,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  email: string;
  beforeClientDbUpdate?: (() => Promise<void>)[];
  afterClientDbUpdate?: (() => Promise<void>)[];
}) {
  const labelsToAdd = Array<string[]>(threads.length).fill([]);
  const labelsToRemove = Array<string[]>(threads.length).fill(["UNREAD"]);

  for (const func of beforeClientDbUpdate ?? []) {
    await func();
  }

  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd,
    labelsToRemove,
  });

  for (const func of afterClientDbUpdate ?? []) {
    await func();
  }

  await gmailApiWorker.label.modify.mutate({
    addLabelsIds: labelsToAdd,
    deleteLabelsIds: labelsToRemove,
    emailAddress: email,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
}
