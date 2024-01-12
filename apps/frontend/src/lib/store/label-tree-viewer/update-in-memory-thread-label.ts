import { atom, useSetAtom } from "jotai";

import type { ThreadType } from "@skylar/parsers-and-types";

import { labelTreeViewerDataAtom, labelTreeViewerMappingAtom } from ".";

export const updateInMemoryThreadLabels = atom<
  null,
  [{ thread: ThreadType; updateLabels: (oldLabels: string[]) => string[] }],
  void
>(null, (get, set, { thread, updateLabels }) => {
  const threadMapping = get(labelTreeViewerDataAtom);
  const labelMapping = get(labelTreeViewerMappingAtom);

  const newThreadMapping = new Map(threadMapping);
  const newLabelMapping = new Map(labelMapping);

  const updatedLabel = updateLabels(thread.provider_message_labels);

  if (newThreadMapping.has(thread.provider_thread_id)) {
    newThreadMapping.set(thread.provider_thread_id, {
      ...thread,
      provider_message_labels: updatedLabel,
    });
  }
  for (const label of newLabelMapping.values()) {
    if (
      label.children.has(thread.provider_thread_id) &&
      !updatedLabel.includes(label.id)
    ) {
      label.children.delete(thread.provider_thread_id);
    }
  }

  set(labelTreeViewerDataAtom, newThreadMapping);
  set(labelTreeViewerMappingAtom, newLabelMapping);
});

export const useUpdateInMemoryThreadLabels = () =>
  useSetAtom(updateInMemoryThreadLabels);
