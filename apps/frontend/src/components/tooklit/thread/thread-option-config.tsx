import { setMostRecentlyAffectedThreads, setReplyMessage } from "@skylar/logic";

import { Icons } from "~/components/icons";
import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { getMostRecentMessageFromThread } from "~/lib/email";
import { archiveThreads } from "~/lib/inbox-toolkit/thread/archive-threads";
import { markReadThreads } from "~/lib/inbox-toolkit/thread/mark-read-threads";
import { markUnreadThreads } from "~/lib/inbox-toolkit/thread/mark-unread-threads";
import { moveThreads } from "~/lib/inbox-toolkit/thread/move-threads";
import { trashThreads } from "~/lib/inbox-toolkit/thread/trash-threads";
import { unarchiveThreads } from "~/lib/inbox-toolkit/thread/unarchive-threads";
import { untrashThreads } from "~/lib/inbox-toolkit/thread/untrash-threads";
import { getLabelModifications } from "~/lib/inbox-toolkit/utils";
import type {
  ConfigOption,
  GetThreads,
  MoveThreadArgs,
} from "../config-option-type";

export const getThreadActions = (
  getThreads: GetThreads,
  activeEmail: string,
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
        getMostRecentMessageFromThread(thread)
          .then((message) => {
            if (!message) return;
            captureEvent({
              event: TrackingEvents.composeForwardMessage,
              properties: {
                isShortcut: false,
                messageConversationLength: thread.provider_message_ids.length,
              },
            });
            setReplyMessage({
              replyType: "forward",
              thread,
              messageToForward: message,
            });
          })
          .catch((e) => {
            console.error(e);
          });
      },
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
          setReplyMessage({
            thread,
            replyType: "reply-sender",
          });
        }
      },
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
          setReplyMessage({ thread, replyType: "reply-all" });
        }
      },
    },
    trashThread: {
      type: "reversible-action",
      icon: Icons.trash,
      name: "Trash",
      tooltipDescription: "Trash thread",
      applyFn: async (accessToken: string) => {
        const threads = await getThreads();
        await trashThreads({
          accessToken,
          email: activeEmail,
          threads: threads,
          afterClientDbUpdate,
        });
        return async () => {
          await untrashThreads({
            accessToken,
            email: activeEmail,
            threads: threads,
            afterClientDbUpdate,
          });
        };
      },
      undoToastConfig: {
        title: "Thread deleted.",
      },
    },
    archiveThread: {
      type: "reversible-action",
      icon: Icons.archive,
      name: "Archive",
      tooltipDescription: "Archive thread",
      applyFn: async (accessToken: string) => {
        const threads = await getThreads();
        await archiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
        return async () => {
          await unarchiveThreads({
            accessToken,
            afterClientDbUpdate,
            email: activeEmail,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread archived.",
      },
    },
    unarchiveThread: {
      type: "reversible-action",
      icon: Icons.archive,
      name: "Unarchive",
      tooltipDescription: "Unarchive thread",
      applyFn: async (accessToken: string) => {
        const threads = await getThreads();
        await unarchiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
        return async () => {
          await archiveThreads({
            accessToken,
            afterClientDbUpdate,
            email: activeEmail,
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
      tooltipDescription: "Archive thread",
      applyFn: async (accessToken: string) => {
        const threads = await getThreads();
        await markReadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
        return async () => {
          await markUnreadThreads({
            accessToken,
            afterClientDbUpdate,
            email: activeEmail,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread marked as read.",
      },
    },
    markUnreadThread: {
      type: "reversible-action",
      icon: Icons.markUnread,
      name: "Mark as unread",
      tooltipDescription: "Unarchive thread",
      applyFn: async (accessToken: string) => {
        const threads = await getThreads();
        setMostRecentlyAffectedThreads(threads);
        await markUnreadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
        return async () => {
          await markReadThreads({
            accessToken,
            afterClientDbUpdate,
            email: activeEmail,
            threads: threads,
          });
        };
      },
      undoToastConfig: {
        title: "Thread marked as unread.",
      },
    },
    modifyThreadLabels: {
      type: "reversible-action",
      icon: Icons.addLabel,
      name: "Add Labels",
      tooltipDescription: "Add Labels to thread",
      applyFn: async (accessToken: string, newLabels: string[]) => {
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
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
          labelsToAdd,
          labelsToRemove,
        });
        return async () => {
          await moveThreads({
            accessToken,
            afterClientDbUpdate,
            email: activeEmail,
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
