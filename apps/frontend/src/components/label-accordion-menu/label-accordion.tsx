"use client";

import { useEffect, useState } from "react";
import { useLogger } from "next-axiom";

import { filterForLabels } from "@skylar/client-db";

import { Icons } from "~/components/icons";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { useNavigateMessagesKeymap } from "~/lib/shortcuts/keymap-hooks";
import { useListLabels } from "../../app/(inbox)/(workspace)/use-list-labels";
import { LabelList } from "./label-list";

/**
 * @returns The component that renders all the labels of a user and the corresponding messages
 */
export const LabelAccordion = () => {
  const logger = useLogger();
  useNavigateMessagesKeymap();
  const { data: labels, isLoading } = useListLabels();
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const [activeLabels, setActiveLabels] = useState<
    { name: string; id: string }[]
  >([]);
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

  useEffect(() => {
    if (!labels || !activeEmailAddress) {
      return;
    }
    const activeLabels = labels[activeEmailAddress];
    if (!activeLabels) {
      return;
    }

    setActiveLabels(activeLabels);
  }, [activeEmailAddress, labels]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!labels) {
    logger.warn("Done loading but no labels found");
    return <div>No labels found</div>;
  }

  return (
    <div className="relative h-full w-full overflow-auto">
      {activeLabels.map((label) => {
        let ButtonIcon = <Icons.chevronRight className="w-4" />;
        if (visibleLabels[label.id]) {
          ButtonIcon = <Icons.chevronDown className="w-4" />;
        }
        return (
          <div key={label.id}>
            <button
              data-label-item={label.id}
              className="sticky top-0 z-10 flex w-full items-center gap-1 bg-secondary px-2 py-1 text-sm"
              onClick={onClickLabel(label.id)}
            >
              {ButtonIcon} {label.name}
            </button>
            {visibleLabels[label.id] && (
              <LabelList
                filters={[filterForLabels([label.id])]}
                uniqueListId={label.id}
                dataItemLabel={label.id}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
