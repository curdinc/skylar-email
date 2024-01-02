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
      applyFn: (...args: T[]) => Promise<() => Promise<void>>;
      undoToastConfig: {
        title: string;
      };
      shortcut?: string;
    }
  | {
      type: "non-reversible-action";
      icon: LucideIcon;
      name: string;
      tooltipDescription: string;
      // Does not return a function that will undo the action
      applyFn: (...args: T[]) => Promise<void>;
      shortcut?: string;
    };

export type GetThreads = () => Promise<ThreadType[]>;
