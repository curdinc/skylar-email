import { atom } from "jotai";

import { bulkGetMessages } from "@skylar/client-db";
import type { MessageType } from "@skylar/parsers-and-types";

import {
  hasLoadedInitialData,
  labelTreeViewerDataAtom,
  labelTreeViewerMappingAtom,
} from ".";

export const deleteMessageAtom = atom<null, [string[]], Promise<void>>(
  null,
  async (get, set, messageIds) => {
    const threadMapping = get(labelTreeViewerDataAtom);
    const labelMapping = get(labelTreeViewerMappingAtom);

    const newThreadMapping = new Map(threadMapping);
    const newLabelMapping = new Map(labelMapping);

    const messages = (
      await bulkGetMessages({
        providerMessageIds: messageIds,
      })
    ).filter((message) => !!message) as MessageType[];
    messages.forEach((message) => {
      if (newThreadMapping.has(message.provider_thread_id)) {
        newThreadMapping.delete(message.provider_thread_id);
      }
      for (const msgLabel of message.provider_message_labels) {
        const label = newLabelMapping.get(msgLabel);
        if (!label || !hasLoadedInitialData(label)) {
          continue;
        }

        label.children.delete(message.provider_thread_id);
      }
    });

    set(labelTreeViewerDataAtom, newThreadMapping);
    set(labelTreeViewerMappingAtom, newLabelMapping);
  },
);
