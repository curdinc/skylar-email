import type { ClientDb } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";

import { archiveThread } from "~/lib/inbox-toolkit/thread/archive-thread";
import { trashThread } from "~/lib/inbox-toolkit/thread/trash-thread";
import { unarchiveThread } from "~/lib/inbox-toolkit/thread/unarchive-thread";
import { untrashThread } from "~/lib/inbox-toolkit/thread/untrash-thread";
import { Icons } from "../icons";

export type hoverOption = {
  icon: React.ReactNode;
  tooltipDescription: string;
  applyFn: (accessToken: string, activeClientDb: ClientDb) => Promise<void>;
  undoFn: (accessToken: string, activeClientDb: ClientDb) => Promise<void>;
  undoToastConfig: {
    title: string;
  };
};

export const hoverOptionsConfig = {
  trashThread: (thread: ThreadType, activeEmail: string): hoverOption => ({
    icon: <Icons.trash />,
    tooltipDescription: "Delete thread",
    applyFn: async (accessToken: string, activeClientDb: ClientDb) => {
      await trashThread({
        accessToken,
        activeClientDb,
        email: activeEmail,
        thread,
      });
    },
    undoFn: async (accessToken: string, activeClientDb: ClientDb) => {
      await untrashThread({
        accessToken,
        activeClientDb,
        email: activeEmail,
        thread,
      });
    },
    undoToastConfig: {
      title: "Thread deleted.",
    },
  }),
  // snoozeThread: (thread: ThreadType, activeEmail: string) => ({
  //   icon: <Icons.spinner />,
  //   tooltipDescription: "Snooze thread",
  //   applyFn: async (email: string, accessToken: string) => {
  //     console.log(`Snooze ${threadId} for ${email} with AT ${accessToken}`);
  //     await Promise.resolve("unsupported");
  //   },
  // }),
  archiveThread: (thread: ThreadType, activeEmail: string): hoverOption => ({
    icon: <Icons.archive />,
    tooltipDescription: "Archive thread",
    applyFn: async (accessToken: string, activeClientDb: ClientDb) => {
      await archiveThread({
        accessToken,
        activeClientDb,
        email: activeEmail,
        thread,
      });
    },
    undoFn: async (accessToken: string, activeClientDb: ClientDb) => {
      await unarchiveThread({
        accessToken,
        activeClientDb,
        email: activeEmail,
        thread,
      });
    },
    undoToastConfig: {
      title: "Thread archived.",
    },
  }),
} as const;
