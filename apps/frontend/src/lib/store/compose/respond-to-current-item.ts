import { setReplyMessageType } from "@skylar/logic";
import type { ValidReplyMessageOptionsType } from "@skylar/parsers-and-types";

import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { SkylarClientStore } from "../index,";
import { activeItemRowAtom } from "../label-tree-viewer/active-item";

export const startResponseToCurrentItem = async (
  type: ValidReplyMessageOptionsType,
) => {
  const activeRow = await SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  captureEvent({
    event: TrackingEvents.composeReplyAllMessage,
    properties: {
      isShortcut: true,
      messageConversationLength: activeRow.thread.provider_message_ids.length,
    },
  });
  setReplyMessageType({
    replyType: type,
    thread: activeRow.thread,
  });
};
