import type { ThreadType } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { SkylarClientStore } from "~/lib/store/index,";
import { updateInMemoryThreadLabels } from "~/lib/store/label-tree-viewer/update-in-memory-thread-label";
import { updateAndSaveLabels } from "../utils";

export const modifyThreadLabels = async ({
  emailAddress,
  threads,
  labelsToAdd,
  labelsToRemove,
}: {
  threads: ThreadType[];
  emailAddress: string;
  labelsToAdd?: string[][];
  labelsToRemove?: string[][];
}) => {
  const noChangeLabelArray = Array<string[]>(threads.length).fill([]);
  const updatedThreads = await updateAndSaveLabels({
    threads,
    labelsToAdd: labelsToAdd ?? noChangeLabelArray,
    labelsToRemove: labelsToRemove ?? noChangeLabelArray,
  });

  updatedThreads.forEach((thread) =>
    SkylarClientStore.set(updateInMemoryThreadLabels, {
      thread,
      updateLabels: () => thread.email_provider_labels,
    }),
  );

  await gmailApiWorker.label.modify.mutate({
    addLabelsIds: labelsToAdd ?? noChangeLabelArray,
    deleteLabelsIds: labelsToRemove ?? noChangeLabelArray,
    emailAddress,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
};
