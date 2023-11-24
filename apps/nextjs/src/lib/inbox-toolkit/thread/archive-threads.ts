import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

import { updateAndSaveLabels } from "../utils";

export async function archiveThreads({
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
  await updateAndSaveLabels({
    threads,
    labelsToAdd: [],
    labelsToRemove: ["INBOX"],
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchModifyLabels({
    accessToken,
    addLabels: [],
    deleteLabels: ["INBOX"],
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
}
