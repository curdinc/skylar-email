import { atom, useSetAtom } from "jotai";

import type { ThreadType } from "@skylar/parsers-and-types";
import { EMAIL_PROVIDER_LABELS } from "@skylar/parsers-and-types";

import { labelTreeViewerMappingAtom } from ".";

export const markInMemoryThreadAsUnreadAtom = atom<
  null,
  [{ thread: ThreadType }],
  void
>(null, (get, set, { thread }) => {
  const labelMapping = get(labelTreeViewerMappingAtom);
  const newLabelMapping = new Map(labelMapping);
  const labels = thread.provider_message_labels;
  labels.forEach((label) => {
    const labelRow = newLabelMapping.get(label);
    if (!labelRow) {
      return;
    }
    const threadItem = labelRow.children.get(thread.provider_thread_id);
    if (!threadItem) {
      return;
    }
    if (threadItem.type !== "labelItem") {
      return;
    }

    thread.provider_message_labels.push(EMAIL_PROVIDER_LABELS.GMAIL.UNREAD);
    labelRow.children.set(thread.provider_thread_id, {
      ...threadItem,
      thread: { ...thread },
    });
    newLabelMapping.set(label, labelRow);
  });
  set(labelTreeViewerMappingAtom, newLabelMapping);
});
export const useMarkInMemoryThreadAsUnread = () =>
  useSetAtom(markInMemoryThreadAsUnreadAtom);
