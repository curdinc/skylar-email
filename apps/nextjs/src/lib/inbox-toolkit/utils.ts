import { bulkPutThreads } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";

export const getLabelModifications = ({
  currentLabels,
  newLabels,
}: {
  currentLabels: string[];
  newLabels: string[];
}) => {
  const labelsToAdd = newLabels.filter(
    (label) => !currentLabels.includes(label),
  );
  const labelsToRemove = currentLabels.filter(
    (label) => !newLabels.includes(label),
  );

  return {
    labelsToAdd,
    labelsToRemove,
  };
};

const getNewLabels = (
  currentLabels: string[],
  addLabels: string[],
  deleteLabels: string[],
) => {
  return currentLabels
    .map((label) => {
      const isRemoveLabel = deleteLabels.find((l) => l === label);
      if (isRemoveLabel) {
        return;
      }

      const isAddLabel = addLabels.find((l) => l === label);
      if (isAddLabel) {
        return;
      }

      return label;
    })
    .filter((label) => !!label);
};

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
  const updatedLabels = getNewLabels(labels, add, remove);

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
