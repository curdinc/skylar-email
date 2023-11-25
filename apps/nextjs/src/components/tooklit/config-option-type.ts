import type { LucideIcon } from "lucide-react";

import type { ThreadType } from "@skylar/client-db/schema/thread";

export type ConfigOption = {
  icon: LucideIcon;
  name: string;
  tooltipDescription: string;
  applyFn: (accessToken: string) => Promise<void>;
  undoFn: (accessToken: string) => Promise<void>;
  undoToastConfig: {
    title: string;
  };
};

export type GetThreads = () => Promise<ThreadType[]>;
