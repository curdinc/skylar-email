import {
  setMostRecentlyAffectedThreads,
  setReplyMessageType,
} from "@skylar/logic";

import { Icons } from "~/components/icons";
import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { archiveThreads } from "~/lib/inbox-toolkit/thread/archive-threads";
import { markAsRead } from "~/lib/inbox-toolkit/thread/mark-as-read";
import { markAsUnread } from "~/lib/inbox-toolkit/thread/mark-as-unread";
import { moveThreads } from "~/lib/inbox-toolkit/thread/move-threads";
import { trashThreads } from "~/lib/inbox-toolkit/thread/trash-threads";
import { unarchiveThreads } from "~/lib/inbox-toolkit/thread/unarchive-threads";
import { untrashThreads } from "~/lib/inbox-toolkit/thread/untrash-threads";
import { getLabelModifications } from "~/lib/inbox-toolkit/thread/utils";
import type {
  ConfigOption,
  GetThreads,
  MoveThreadArgs,
} from "../config-option-type";

export const getThreadActions = (
  getThreads: GetThreads,
  activeEmailAddress: string,
  afterClientDbUpdate: (() => Promise<void>)[],
) => {
  return {
    forward: {
      type: "non-reversible-action",
      icon: Icons.forward,
      name: "Forward",
      tooltipDescription: "Forward email",
      applyFn: async () => {
        const [thread] = await getThreads();
        if (!thread) return;
        captureEvent({
          event: TrackingEvents.composeForwardMessage,
          properties: {
            isShortcut: false,
            messageConversationLength: thread.provider_message_ids.length,
          },
        });

        setReplyMessageType({
          replyType: "forward",
          thread: thread,
        });
      },
      shortcut: "f",
    },
    replySender: {
      type: "non-reversible-action",
      icon: Icons.replySender,
      name: "Reply to Sender",
      tooltipDescription: "Reply to sender",
      applyFn: async () => {
        const [thread] = await getThreads();
        if (thread) {
          captureEvent({
            event: TrackingEvents.composeReplySenderMessage,
            properties: {
              isShortcut: false,
              messageConversationLength: thread.provider_message_ids.length,
            },
          });
          setReplyMessageType({
            thread,
            replyType: "reply-sender",
          });
        }
      },
      shortcut: "r",
    },
    replyAll: {
      type: "non-reversible-action",
      icon: Icons.replyAll,
      name: "Reply All",
      tooltipDescription: "Reply All in thread",
      applyFn: async () => {
        const [thread] = await getThreads();
        if (thread) {
          captureEvent({
            event: TrackingEvents.composeReplyAllMessage,
            properties: {
              isShortcut: false,
              messageConversationLength: thread.provider_message_ids.length,
            },
          });
          setReplyMessageType({ thread, replyType: "reply-all" });
        }
      },
      shortcut: "⇧R",
    },
    trashThread: {
      type: "reversible-action",
      icon: Icons.trash,
      name: "Trash",
      tooltipDescription: "Trash thread",
      applyFn: async () => {
        const threads = await getThreads();
        await trashThreads({
          emailAddress: activeEmailAddress,
          threads: threads,
        });
        return async () => {
          await untrashThreads({
            emailAddress: activeEmailAddress,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread deleted.",
      },
      shortcut: "Del",
    },
    archiveThread: {
      type: "reversible-action",
      icon: Icons.archive,
      name: "Archive",
      tooltipDescription: "Archive thread",
      applyFn: async () => {
        const threads = await getThreads();
        await archiveThreads({
          emailAddress: activeEmailAddress,
          threads: threads,
        });
        return async () => {
          await unarchiveThreads({
            emailAddress: activeEmailAddress,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread archived.",
      },
      shortcut: "e",
    },
    unarchiveThread: {
      type: "reversible-action",
      icon: Icons.archive,
      name: "Unarchive",
      tooltipDescription: "Unarchive thread",
      applyFn: async () => {
        const threads = await getThreads();
        await unarchiveThreads({
          emailAddress: activeEmailAddress,
          threads: threads,
        });
        return async () => {
          await archiveThreads({
            emailAddress: activeEmailAddress,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread unarchived.",
      },
    },
    markReadThread: {
      type: "reversible-action",
      icon: Icons.markRead,
      name: "Mark as read",
      tooltipDescription: "Mark as read",
      applyFn: async () => {
        const threads = await getThreads();
        await markAsRead({
          emailAddress: activeEmailAddress,
          threads: threads,
        });
        return async () => {
          await markAsUnread({
            emailAddress: activeEmailAddress,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread marked as read.",
      },
      shortcut: "⇧U",
    },
    markUnreadThread: {
      type: "reversible-action",
      icon: Icons.markUnread,
      name: "Mark as unread",
      tooltipDescription: "Unarchive thread",
      applyFn: async () => {
        const threads = await getThreads();
        setMostRecentlyAffectedThreads(threads);
        await markAsUnread({
          emailAddress: activeEmailAddress,
          threads: threads,
        });
        return async () => {
          await markAsRead({
            emailAddress: activeEmailAddress,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread marked as unread.",
      },
      shortcut: "u",
    },
    modifyThreadLabels: {
      type: "reversible-action",
      icon: Icons.addLabel,
      name: "Add Labels",
      tooltipDescription: "Add Labels to thread",
      applyFn: async (newLabels: string[]) => {
        const threads = await getThreads();
        const labelsToAdd: string[][] = [];
        const labelsToRemove: string[][] = [];
        threads.map((thread) => {
          const { labelsToAdd: _labelsToAdd, labelsToRemove: _labelsToRemove } =
            getLabelModifications({
              currentLabels: thread.provider_message_labels,
              newLabels,
            });

          labelsToAdd.push(_labelsToAdd);
          labelsToRemove.push(_labelsToRemove);
        });

        await moveThreads({
          afterClientDbUpdate,
          emailAddress: activeEmailAddress,
          threads: threads,
          labelsToAdd,
          labelsToRemove,
        });
        return async () => {
          await moveThreads({
            afterClientDbUpdate,
            emailAddress: activeEmailAddress,
            threads: threads,
            labelsToAdd: labelsToRemove,
            labelsToRemove: labelsToAdd,
          });
        };
      },
      undoToastConfig: {
        title: "Labels added to thread.",
      },
    },
  } as const satisfies Record<string, ConfigOption<MoveThreadArgs | []>>;
};
