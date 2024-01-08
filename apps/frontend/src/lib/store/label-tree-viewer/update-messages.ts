import { atom } from "jotai";

import type { bulkUpdateMessages } from "@skylar/client-db";
import { bulkGetMessages } from "@skylar/client-db";
import type { MessageType } from "@skylar/parsers-and-types";

import {
  hasLoadedInitialData,
  labelTreeViewerDataAtom,
  labelTreeViewerMappingAtom,
} from ".";

export const updateMessageAtom = atom<
  null,
  [Parameters<typeof bulkUpdateMessages>[0]["messages"]],
  Promise<void>
>(null, async (get, set, messages) => {
  const threadMapping = get(labelTreeViewerDataAtom);
  const labelMapping = get(labelTreeViewerMappingAtom);

  const newThreadMapping = new Map(threadMapping);
  const newLabelMapping = new Map(labelMapping);

  const fullMessages = (
    await bulkGetMessages({
      providerMessageIds: messages.map(
        (message) => message.provider_message_id,
      ),
    })
  ).filter((message) => !!message) as MessageType[];

  fullMessages.sort((a, b) => {
    return a.created_at - b.created_at;
  });

  fullMessages.forEach((message) => {
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
});
