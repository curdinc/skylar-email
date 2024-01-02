import { atom, useSetAtom } from "jotai";

import type { ThreadType } from "@skylar/parsers-and-types";

import { labelTreeViewerMappingAtom } from ".";

export const updateInMemoryThreadLabels = atom<
  null,
  [{ thread: ThreadType; updateLabels: (oldLabels: string[]) => string[] }],
  void
>(null, (get, set, { thread, updateLabels }) => {
  const labelMapping = get(labelTreeViewerMappingAtom);
  const newLabelMapping = new Map(labelMapping);
  const existingLabels = new Set(thread.provider_message_labels);

  const newThreadLabels = new Set(updateLabels(thread.provider_message_labels));
  const removedLabels = new Set(
    [...thread.provider_message_labels].filter(
      (threadLabel) => !newThreadLabels.has(threadLabel),
    ),
  );
  const addedLabels = new Set(
    [...newThreadLabels].filter(
      (threadLabel) => !existingLabels.has(threadLabel),
    ),
  );

  [...existingLabels, ...addedLabels].forEach((label) => {
    const labelRow = newLabelMapping.get(label);
    if (!labelRow) {
      return;
    }

    labelRow.children.set(thread.provider_thread_id, {
      id: thread.provider_thread_id,
      parentId: label,
      displayValue: thread.subject,
      type: "labelItem",
      state: removedLabels.has(label) ? "hidden" : "viewable",
      thread: { ...thread, provider_message_labels: [...newThreadLabels] },
    });
    newLabelMapping.set(label, labelRow);
  });
  set(labelTreeViewerMappingAtom, newLabelMapping);
});
export const useUpdateInMemoryThreadLabels = () =>
  useSetAtom(updateInMemoryThreadLabels);
