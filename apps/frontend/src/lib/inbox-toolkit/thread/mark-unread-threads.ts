import type { ThreadType } from "@skylar/parsers-and-types";
import { EMAIL_PROVIDER_LABELS } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { updateAndSaveLabels } from "../utils";

export async function markUnreadThreads({
  threads,
  email,
  beforeClientDbUpdate,
  afterClientDbUpdate,
}: {
  threads: ThreadType[];
  email: string;
  beforeClientDbUpdate?: (() => Promise<void> | void)[];
  afterClientDbUpdate?: (() => Promise<void> | void)[];
}) {
  const labelsToRemove = Array<string[]>(threads.length).fill([]);
  const labelsToAdd = Array<string[]>(threads.length).fill([
    EMAIL_PROVIDER_LABELS.GMAIL.UNREAD,
  ]);

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
