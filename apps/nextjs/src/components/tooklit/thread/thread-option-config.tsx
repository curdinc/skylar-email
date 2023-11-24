import type { LucideIcon } from "lucide-react";

import type { ThreadType } from "@skylar/client-db/schema/thread";

import { Icons } from "~/components/icons";
import { archiveThreads } from "~/lib/inbox-toolkit/thread/archive-threads";
import { markReadThreads } from "~/lib/inbox-toolkit/thread/mark-read-threads";
import { markUnreadThreads } from "~/lib/inbox-toolkit/thread/mark-unread-threads";
import { trashThreads } from "~/lib/inbox-toolkit/thread/trash-threads";
import { unarchiveThreads } from "~/lib/inbox-toolkit/thread/unarchive-threads";
import { untrashThreads } from "~/lib/inbox-toolkit/thread/untrash-threads";

export type ThreadOptionConfig = {
  icon: LucideIcon;
  name: string;
  tooltipDescription: string;
  applyFn: (accessToken: string) => Promise<ThreadType>;
  undoFn: (accessToken: string) => Promise<ThreadType>;
  undoToastConfig: {
    title: string;
  };
};

export const getThreadActions = (
  thread: ThreadType,
  activeEmail: string,
  afterClientDbUpdate: (() => Promise<void>)[],
) => {
  return {
    trashThread: {
      icon: Icons.trash,
      name: "Trash",
      tooltipDescription: "Trash thread",
      applyFn: async (accessToken: string) => {
        await trashThreads({
          accessToken,
          email: activeEmail,
          threads: [thread],
          afterClientDbUpdate,
        });
      },
      undoFn: async (accessToken: string) => {
        await untrashThreads({
          accessToken,
          email: activeEmail,
          threads: [thread],
          afterClientDbUpdate,
        });
      },
      undoToastConfig: {
        title: "Thread deleted.",
      },
    },
    archiveThread: {
      icon: Icons.archive,
      name: "Archive",
      tooltipDescription: "Archive thread",
      applyFn: async (accessToken: string) => {
        await archiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoFn: async (accessToken: string) => {
        await unarchiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoToastConfig: {
        title: "Thread archived.",
      },
    },
    unarchiveThread: {
      icon: Icons.archive,
      name: "Unarchive",
      tooltipDescription: "Unarchive thread",
      applyFn: async (accessToken: string) => {
        await unarchiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoFn: async (accessToken: string) => {
        await archiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoToastConfig: {
        title: "Thread unarchived.",
      },
    },
    markReadThread: {
      icon: Icons.markRead,
      name: "Mark as read",
      tooltipDescription: "Archive thread",
      applyFn: async (accessToken: string) => {
        await markReadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoFn: async (accessToken: string) => {
        await markUnreadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoToastConfig: {
        title: "Thread archived.",
      },
    },
    markUnreadThread: {
      icon: Icons.markUnread,
      name: "Mark as unread",
      tooltipDescription: "Unarchive thread",
      applyFn: async (accessToken: string) => {
        await markUnreadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoFn: async (accessToken: string) => {
        await markReadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: [thread],
        });
      },
      undoToastConfig: {
        title: "Thread unarchived.",
      },
    },
  } as const;
};
