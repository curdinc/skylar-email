import { bulkUpdateMessages } from "@skylar/client-db";

import { SkylarClientStore } from "~/lib/store/index,";
import { updateMessageAtom } from "~/lib/store/label-tree-viewer/update-messages";

export const updateMessages = async ({
  messages,
}: {
  messages: Parameters<typeof bulkUpdateMessages>[0]["messages"];
}) => {
  await bulkUpdateMessages({ messages });
  await SkylarClientStore.set(updateMessageAtom, messages);
};
