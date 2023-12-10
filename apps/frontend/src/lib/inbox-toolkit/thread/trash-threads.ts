import { batchTrashThreads } from "@skylar/gmail-api";
import type { ThreadType } from "@skylar/parsers-and-types";

import { updateAndSaveLabels } from "../utils";

export async function trashThreads({
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

  await batchTrashThreads({
    accessToken,
    emailId: email,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
}
