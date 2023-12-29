import type { ThreadType } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { updateAndSaveLabels } from "../utils";

export async function trashThreads({
  threads,
  email,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  email: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
}) {
  const labelsToAdd = Array<string[]>(threads.length).fill(["TRASH"]);
  const labelsToRemove = Array<string[]>(threads.length).fill(["INBOX"]);

  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd,
    labelsToRemove,
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await gmailApiWorker.thread.delete.mutate({
    emailAddress: email,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
}
