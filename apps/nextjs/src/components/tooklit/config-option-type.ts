import type { LucideIcon } from "lucide-react";

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
