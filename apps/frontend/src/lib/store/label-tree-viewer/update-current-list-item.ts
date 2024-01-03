import { archiveThreads } from "~/lib/inbox-toolkit/thread/archive-threads";
import { markAsRead } from "~/lib/inbox-toolkit/thread/mark-as-read";
import { markAsUnread } from "~/lib/inbox-toolkit/thread/mark-as-unread";
import { trashThreads } from "~/lib/inbox-toolkit/thread/trash-threads";
import { SkylarClientStore } from "../index,";
import { activeItemRowAtom } from "./active-item";

export const markCurrentListItemAsRead = async (emailAddress: string) => {
  const activeRow = await SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  return markAsRead({
    emailAddress,
    threads: [activeRow.thread],
  });
};
export const markCurrentListItemAsUnread = async (emailAddress: string) => {
  const activeRow = await SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  return markAsUnread({
    emailAddress,
    threads: [activeRow.thread],
  });
};

export const markCurrentListItemAsDone = async (emailAddress: string) => {
  const activeRow = await SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  return archiveThreads({
    emailAddress,
    threads: [activeRow.thread],
  });
};
export const deleteCurrentListItem = async (emailAddress: string) => {
  const activeRow = await SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  return trashThreads({
    emailAddress,
    threads: [activeRow.thread],
  });
};
