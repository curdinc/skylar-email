import { startTransition } from "react";

import { bulkUpdateMessages } from "@skylar/client-db";
import type { ThreadType } from "@skylar/parsers-and-types";

import { SkylarClientStore } from "~/lib/store/index,";
import { updateInMemoryThreadLabels } from "~/lib/store/label-tree-viewer/update-in-memory-thread-label";
import { GMAIL_IMMUTABLE_LABELS } from "../constants";

export const getLabelModifications = ({
  currentLabels,
  newLabels,
}: {
  currentLabels: string[];
  newLabels: string[];
}) => {
  const labelsToAdd = newLabels.filter(
    (label) =>
      !currentLabels.includes(label) &&
      GMAIL_IMMUTABLE_LABELS.indexOf(label) === -1,
  );
  const labelsToRemove = currentLabels.filter(
    (label) =>
      !newLabels.includes(label) &&
      GMAIL_IMMUTABLE_LABELS.indexOf(label) === -1,
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
  const labels = thread.provider_message_labels;
  const updatedLabels = getNewLabels(labels, add, remove);

  return {
    ...thread,
    provider_message_labels: [...updatedLabels, ...add] as string[],
  };
};

export const updateAndSaveLabels = async ({
  threads,
  labelsToAdd,
  labelsToRemove,
}: {
  threads: ThreadType[];
  labelsToAdd: string[][];
  labelsToRemove: string[][];
}) => {
  const updatedThreads = threads
    .map((thread, index) => {
      return updateLabels({
        thread: thread,
        add: labelsToAdd[index]!,
        remove: labelsToRemove[index]!,
      });
    })
    .filter((thread) => !!thread);

  await bulkUpdateMessages({
    messages: updatedThreads
      .map((thread) => {
        return thread.provider_message_ids.map((messageId) => {
          return {
            provider_message_id: messageId,
            provider_message_labels: thread.provider_message_labels,
          };
        });
      })
      .flat(),
  });

  return updatedThreads;
};

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

  startTransition(() =>
    updatedThreads.forEach((thread) =>
      SkylarClientStore.set(updateInMemoryThreadLabels, {
        thread,
        updateLabels: () => thread.provider_message_labels,
      }),
    ),
  );

  const { gmailApiWorker } = await import("@skylar/web-worker-logic");
  await gmailApiWorker.label.modify.mutate({
    addLabelsIds: labelsToAdd ?? noChangeLabelArray,
    deleteLabelsIds: labelsToRemove ?? noChangeLabelArray,
    emailAddress,
    threadIds: updatedThreads.map((t) => t.provider_thread_id),
  });
};
