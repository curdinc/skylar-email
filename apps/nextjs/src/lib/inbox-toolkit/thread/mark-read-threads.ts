import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

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
  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd: [],
    labelsToRemove: ["UNREAD"],
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchModifyLabels({
    accessToken,
    addLabels: [],
    deleteLabels: ["UNREAD"],
    emailId: email,
    threadIds: updatedThreads.map((t) => t.email_provider_thread_id),
  });
}