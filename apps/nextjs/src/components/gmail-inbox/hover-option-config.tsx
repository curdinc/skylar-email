import type { FormEvent } from "react";

import { Icons } from "../icons";

export type hoverOption = {
  icon: React.ReactNode;
  desc: string;
  onClick: (e: FormEvent<HTMLFormElement>) => void;
};

export const hoverOptionsConfig = {
  trashThread: (threadId: string) => ({
    icon: <Icons.trash />,
    desc: "Delete thread",
    onClick: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(`Delete ${threadId}`);
    },
  }),
  snoozeThread: (threadId: string) => ({
    icon: <Icons.spinner />,
    desc: "Snooze thread",
    onClick: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(`Snooze ${threadId}`);
    },
  }),
  archiveThread: (threadId: string) => ({
    icon: <Icons.pizza />,
    desc: "Archive thread",
    onClick: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(`Archive ${threadId}`);
    },
  }),
} as const;
