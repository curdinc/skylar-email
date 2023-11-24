import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

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
  await updateAndSaveLabels({
    threads,
    labelsToAdd: ["UNREAD"],
    labelsToRemove: [],
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchModifyLabels({
    accessToken,
    addLabels: ["UNREAD"],
    deleteLabels: [],
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
}
