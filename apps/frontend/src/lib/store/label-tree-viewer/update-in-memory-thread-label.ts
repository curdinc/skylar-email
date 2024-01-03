import { atom, useSetAtom } from "jotai";

import type { ThreadType } from "@skylar/parsers-and-types";

import { labelTreeViewerDataAtom } from ".";

export const updateInMemoryThreadLabels = atom<
  null,
  [{ thread: ThreadType; updateLabels: (oldLabels: string[]) => string[] }],
  void
>(null, (get, set, { thread, updateLabels }) => {
  const threadMapping = get(labelTreeViewerDataAtom);
  const newThreadMapping = new Map(threadMapping);
  if (newThreadMapping.has(thread.provider_thread_id)) {
    newThreadMapping.set(thread.provider_thread_id, {
      ...thread,
      provider_message_labels: updateLabels(thread.provider_message_labels),
    });
  }
  set(labelTreeViewerDataAtom, newThreadMapping);
});

export const useUpdateInMemoryThreadLabels = () =>
  useSetAtom(updateInMemoryThreadLabels);
