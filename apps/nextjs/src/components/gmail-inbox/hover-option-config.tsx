import { Icons } from "../icons";

export type hoverOption = {
  icon: React.ReactNode;
  desc: string;
  fn: () => Promise<void>;
};

export const hoverOptionsConfig = {
  trashThread: (threadId: string) => ({
    icon: <Icons.trash />,
    desc: "Delete thread",
    fn: () => {
      console.log(`Delete ${threadId}`);
    },
  }),
  snoozeThread: (threadId: string) => ({
    icon: <Icons.spinner />,
    desc: "Snooze thread",
    fn: () => {
      console.log(`Snooze ${threadId}`);
    },
  }),
  archiveThread: (threadId: string) => ({
    icon: <Icons.pizza />,
    desc: "Archive thread",
    fn: () => {
      console.log(`Archive ${threadId}`);
    },
  }),
} as const;
