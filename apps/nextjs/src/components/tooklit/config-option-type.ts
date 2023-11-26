import type { LucideIcon } from "lucide-react";

import type { ThreadType } from "@skylar/client-db/schema/thread";

export type MoveThreadArgs = string[];

export type ConfigOption<T> = {
  icon: LucideIcon;
  name: string;
  tooltipDescription: string;
  applyFn: (accessToken: string, ...args: T[]) => Promise<void>;
  undoFn: (accessToken: string) => Promise<void>;
  undoToastConfig: {
    title: string;
  };
};

export type GetThreads = () => Promise<ThreadType[]>;
