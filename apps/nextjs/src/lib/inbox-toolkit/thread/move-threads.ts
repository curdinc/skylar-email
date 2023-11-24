import type { ThreadType } from "@skylar/client-db/schema/thread";
import { batchModifyLabels } from "@skylar/gmail-api";

import { updateAndSaveLabels } from "../utils";

export async function moveThreads({
  threads,
  labelToRemove,
  labelToAdd,
  email,
  accessToken,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  labelToRemove: string;
  labelToAdd: string;
  email: string;
  accessToken: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
}) {
  await updateAndSaveLabels({
    threads,
    labelsToAdd: [labelToAdd],
    labelsToRemove: [labelToRemove],
  });

  for (const func of afterClientDbUpdate) {
    await func();
  }

  await batchModifyLabels({
    accessToken,
    addLabels: [labelToAdd],
    deleteLabels: [labelToRemove],
    emailId: email,
    threadIds: threads.map((t) => t.email_provider_thread_id),
  });
}
