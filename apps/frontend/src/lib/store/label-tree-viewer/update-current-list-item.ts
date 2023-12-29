import { archiveThreads } from "~/lib/inbox-toolkit/thread/archive-threads";
import { markAsRead } from "~/lib/inbox-toolkit/thread/mark-as-read";
import { markAsUnread } from "~/lib/inbox-toolkit/thread/mark-as-unread";
import { trashThreads } from "~/lib/inbox-toolkit/thread/trash-threads";
import { SkylarClientStore } from "../index,";
import { activeItemRowAtom } from "./active-item";

export const markCurrentListItemAsRead = (emailAddress: string) => {
  const activeRow = SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  markAsRead({
    emailAddress,
    threads: [activeRow.thread],
  }).catch((e) => {
    console.error("Fail to mark current thread as read", e);
  });
};
export const markCurrentListItemAsUnread = (emailAddress: string) => {
  const activeRow = SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  markAsUnread({
    emailAddress,
    threads: [activeRow.thread],
  }).catch((e) => {
    console.error("Fail to mark current thread as unread", e);
  });
};

export const markCurrentListItemAsDone = (emailAddress: string) => {
  const activeRow = SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  archiveThreads({
    emailAddress,
    threads: [activeRow.thread],
  }).catch((e) => {
    console.error("Fail to mark current thread as done", e);
  });
};
export const deleteCurrentListItem = (emailAddress: string) => {
  const activeRow = SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow || activeRow.type !== "labelItem") {
    return;
  }
  trashThreads({
    emailAddress,
    threads: [activeRow.thread],
  }).catch((e) => {
    console.error("Fail to delete current thread", e);
  });
};
