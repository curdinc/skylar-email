import { setMostRecentlyAffectedThreads, useGlobalStore } from "@skylar/logic";

import { Icons } from "~/components/icons";
import { archiveThreads } from "~/lib/inbox-toolkit/thread/archive-threads";
import { markReadThreads } from "~/lib/inbox-toolkit/thread/mark-read-threads";
import { markUnreadThreads } from "~/lib/inbox-toolkit/thread/mark-unread-threads";
import { trashThreads } from "~/lib/inbox-toolkit/thread/trash-threads";
import { unarchiveThreads } from "~/lib/inbox-toolkit/thread/unarchive-threads";
import { untrashThreads } from "~/lib/inbox-toolkit/thread/untrash-threads";
import type { ConfigOption, GetThreads } from "../config-option-type";

export const getThreadActions = (
  getThreads: GetThreads,
  activeEmail: string,
  afterClientDbUpdate: (() => Promise<void>)[],
) => {
  return {
    trashThread: {
      icon: Icons.trash,
      name: "Trash",
      tooltipDescription: "Trash thread",
      applyFn: async (accessToken: string) => {
        const threads = await getThreads();
        setMostRecentlyAffectedThreads(threads); // TODO: fix this ugly flow
        await trashThreads({
          accessToken,
          email: activeEmail,
          threads: threads,
          afterClientDbUpdate,
        });
      },
      undoFn: async (accessToken: string) => {
        const threads =
          useGlobalStore.getState().EMAIL_CLIENT.CONTEXT_MENU
            .mostRecentlyAffectedThreads;
        await untrashThreads({
          accessToken,
          email: activeEmail,
          threads: threads,
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
        const threads = await getThreads();
        setMostRecentlyAffectedThreads(threads);
        await archiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
      },
      undoFn: async (accessToken: string) => {
        const threads =
          useGlobalStore.getState().EMAIL_CLIENT.CONTEXT_MENU
            .mostRecentlyAffectedThreads;
        await unarchiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
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
        const threads = await getThreads();
        setMostRecentlyAffectedThreads(threads);
        await unarchiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
      },
      undoFn: async (accessToken: string) => {
        const threads =
          useGlobalStore.getState().EMAIL_CLIENT.CONTEXT_MENU
            .mostRecentlyAffectedThreads;
        await archiveThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
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
        const threads = await getThreads();
        setMostRecentlyAffectedThreads(threads);
        await markReadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
      },
      undoFn: async (accessToken: string) => {
        const threads =
          useGlobalStore.getState().EMAIL_CLIENT.CONTEXT_MENU
            .mostRecentlyAffectedThreads;
        await markUnreadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
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
        const threads = await getThreads();
        setMostRecentlyAffectedThreads(threads);
        await markUnreadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
      },
      undoFn: async (accessToken: string) => {
        const threads =
          useGlobalStore.getState().EMAIL_CLIENT.CONTEXT_MENU
            .mostRecentlyAffectedThreads;
        await markReadThreads({
          accessToken,
          afterClientDbUpdate,
          email: activeEmail,
          threads: threads,
        });
      },
      undoToastConfig: {
        title: "Thread unarchived.",
      },
    },
  } satisfies Record<string, ConfigOption>;
};
