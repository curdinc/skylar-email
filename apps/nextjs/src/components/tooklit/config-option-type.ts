import type { LucideIcon } from "lucide-react";

import type { ThreadType } from "@skylar/client-db/schema/thread";

export type MoveThreadArgs = string[];

export type ConfigOption<T> =
  | {
      icon: LucideIcon;
      name: string;
      tooltipDescription: string;
      // return a function that will undo the action
      applyFn: (
        accessToken: string,
        ...args: T[]
      ) => Promise<() => Promise<void>>;
      undoToastConfig: {
        title: string;
      };
    }
  | {
      icon: LucideIcon;
      name: string;
      tooltipDescription: string;
      // return a function that will undo the action
      applyFn: (accessToken: string, ...args: T[]) => Promise<void>;
    };

export type GetThreads = () => Promise<ThreadType[]>;
