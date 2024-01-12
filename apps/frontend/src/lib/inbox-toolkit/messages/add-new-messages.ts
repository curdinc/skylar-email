import { bulkPutMessages } from "@skylar/client-db";
import type { MessageType } from "@skylar/parsers-and-types";

import { SkylarClientStore } from "~/lib/store/index,";
import { addNewMessageAtom } from "~/lib/store/label-tree-viewer/add-new-messages";

export const addNewMessages = async ({
  messages,
}: {
  messages: MessageType[];
}) => {
  await bulkPutMessages({
    messages,
  });
  SkylarClientStore.set(addNewMessageAtom, messages);
};
