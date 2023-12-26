"use client";

import { useState } from "react";

import { Icons } from "~/components/icons";
import { useLogger } from "~/lib/logger";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { useNavigateMessagesKeymap } from "~/lib/shortcuts/keymap-hooks";
import { cn } from "~/lib/ui";
import { useListLabels } from "../../app/(inbox)/(workspace)/use-list-labels";
import { LabelList } from "./label-list";

/**
 * @returns The component that renders all the labels of a user and the corresponding messages
 */
export const LabelsTreeViewer = () => {
  const logger = useLogger();
  useNavigateMessagesKeymap();
  const { data: labels } = useListLabels();
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const activeLabels = labels?.[activeEmailAddress ?? ""];
  const [visibleLabels, setVisibleLabels] = useState<Record<string, boolean>>(
    {},
  );

  const onClickLabel = (labelId: string) => {
    return () => {
      setVisibleLabels((prev) => ({
        ...prev,
        [labelId]: !prev[labelId],
      }));
    };
  };

  if (!activeLabels) {
    return <div>Loading ...</div>;
  }

  if (activeLabels.length === 0) {
    logger.warn("Done loading but no labels found");
    return <div>No labels found</div>;
  }

  return (
    <div className="relative h-full w-full overflow-auto">
      {activeLabels.map((label) => {
        return (
          <div key={label.id}>
            <button
              data-label-item={label.id}
              className={cn(
                "sticky top-0 z-10 flex h-8 w-full items-center gap-1 bg-background px-2 text-sm shadow-md",
                visibleLabels[label.id] && "bg-secondary",
              )}
              onClick={onClickLabel(label.id)}
            >
              <Icons.chevronRight
                className={cn(
                  "w-4 transition-transform",
                  visibleLabels[label.id] && "rotate-90 transform ",
                )}
              />{" "}
              {label.name}
            </button>
            {visibleLabels[label.id] && <LabelList labelId={label.id} />}
          </div>
        );
      })}
    </div>
  );
};
