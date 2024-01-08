import { atom } from "jotai";

import type { MessageType } from "@skylar/parsers-and-types";

import {
  hasLoadedInitialData,
  labelTreeViewerDataAtom,
  labelTreeViewerMappingAtom,
} from ".";

export const addNewMessageAtom = atom<null, [MessageType[]], void>(
  null,
  (get, set, messages) => {
    const threadMapping = get(labelTreeViewerDataAtom);
    const labelMapping = get(labelTreeViewerMappingAtom);

    const newThreadMapping = new Map(threadMapping);
    const newLabelMapping = new Map(labelMapping);
    messages.forEach((message) => {
      if (newThreadMapping.has(message.provider_thread_id)) {
        newThreadMapping.delete(message.provider_thread_id);
      }
      for (const msgLabel of message.provider_message_labels) {
        const label = newLabelMapping.get(msgLabel);
        if (!label || !hasLoadedInitialData(label)) {
          continue;
        }

        label.children.set(message.provider_thread_id, {
          type: "labelItem",
          displayValue: message.subject,
          id: message.provider_thread_id,
          parentId: label.id,
          state: "viewable",
          timestampReceived: message.created_at,
        });
      }
    });

    set(labelTreeViewerDataAtom, newThreadMapping);
    set(labelTreeViewerMappingAtom, newLabelMapping);
  },
);
