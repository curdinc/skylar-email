import { bulkDeleteMessages } from "@skylar/client-db";

import { SkylarClientStore } from "~/lib/store/index,";
import { deleteMessageAtom } from "~/lib/store/label-tree-viewer/delete-messages";

export const deleteMessages = async ({
  messageIds,
}: {
  messageIds: string[];
}) => {
  await SkylarClientStore.set(deleteMessageAtom, messageIds);
  await bulkDeleteMessages({
    providerMessageIds: messageIds,
  });
};
