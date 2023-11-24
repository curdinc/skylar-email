import { bulkPutThreads, clientDb } from "@skylar/client-db";
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
      const removeIndex = remove.indexOf(label);
      if (removeIndex !== -1) {
        return;
      }

      const addIndex = add.indexOf(label);
      if (addIndex === -1) {
        return;
      }

      return label;
    })
    .filter((label) => !!label);

  thread.email_provider_labels = [...updatedLabels, ...add] as string[];
  return thread;
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

  const activeClientDb = clientDb;
  await bulkPutThreads({
    db: activeClientDb,
    threads: updatedThreads,
  });
};
