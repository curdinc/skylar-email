import { bulkPutThreads } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";

const updateLabels = ({
  thread,
  add,
  remove,
}: {
  thread: ThreadType;
  add: string[];
  remove: string[];
}) => {
  const labels = thread.email_provider_labels;
  const updatedLabels = labels
    .map((label) => {
      const isRemoveLabel = remove.find((l) => l === label);
      if (isRemoveLabel) {
        return;
      }

      const isAddLabel = remove.find((l) => l === label);
      if (isAddLabel) {
        return;
      }

      return label;
    })
    .filter((label) => !!label);

  return {
    ...thread,
    email_provider_labels: [...updatedLabels, ...add] as string[],
  };
};

export const updateAndSaveLabels = async ({
  threads,
  labelsToAdd,
  labelsToRemove,
}: {
  threads: ThreadType[];
  labelsToAdd: string[];
  labelsToRemove: string[];
}) => {
  const updatedThreads = threads
    .map((thread) => {
      return updateLabels({
        thread: thread,
        add: labelsToAdd,
        remove: labelsToRemove,
      });
    })
    .filter((thread) => !!thread);

  await bulkPutThreads({
    threads: updatedThreads,
  });

  return updatedThreads;
};
