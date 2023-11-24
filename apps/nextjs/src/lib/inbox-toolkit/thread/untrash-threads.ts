import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchUntrashThreads } from "@skylar/gmail-api";

import { updateAndSaveLabels } from "../utils";

export async function untrashThreads({
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
    labelsToAdd: ["INBOX"],
    labelsToRemove: ["TRASH"],
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }
  await batchUntrashThreads({
    accessToken,
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
}
