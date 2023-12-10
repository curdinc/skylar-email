import type { LucideIcon } from "lucide-react";

import type { ThreadType } from "@skylar/parsers-and-types";

export type MoveThreadArgs = string[];

export type ConfigOption<T> =
  | {
      type: "reversible-action";
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
      type: "non-reversible-action";
      icon: LucideIcon;
      name: string;
      tooltipDescription: string;
      // Does not return a function that will undo the action
      applyFn: (accessToken: string, ...args: T[]) => Promise<void>;
    };

export type GetThreads = () => Promise<ThreadType[]>;
