import { markAsRead } from "~/lib/inbox-toolkit/thread/mark-as-read";
import { markAsUnread } from "~/lib/inbox-toolkit/thread/mark-as-unread";
import { SkylarClientStore } from "../index,";
import { activeItemRowAtom } from "./active-item";

export const markCurrentListItemAsRead = (emailAddress: string) => {
  console.log("unread fired");
  const activeRow = SkylarClientStore.get(activeItemRowAtom);
  console.log("activeRow", activeRow);
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
