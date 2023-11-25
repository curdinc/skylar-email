import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchTrashThreads } from "@skylar/gmail-api";

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
  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd: ["TRASH"],
    labelsToRemove: ["INBOX"],
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchTrashThreads({
    accessToken,
    emailId: email,
    threadIds: updatedThreads.map((t) => t.email_provider_thread_id),
  });
}
