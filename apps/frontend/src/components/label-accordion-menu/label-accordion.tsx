"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { filterForLabels } from "@skylar/client-db";

import { Icons } from "~/components/icons";
import { useLogger } from "~/lib/logger";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { useNavigateMessagesKeymap } from "~/lib/shortcuts/keymap-hooks";
import { useListLabels } from "../../app/(inbox)/(workspace)/use-list-labels";
import { MessageList } from "./message-list";
import { getLabelDataListItem } from "./utils";

/**
 * @returns The component that renders all the labels of a user and the corresponding messages
 */
export const LabelAccordion = () => {
  const logger = useLogger();
  const { data: labels, isLoading } = useListLabels();
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const labelRefs = useRef<Record<string, HTMLButtonElement>>({});
  const [activeLabels, setActiveLabels] = useState<
    { name: string; id: string }[]
  >([]);
  const [visibleLabels, setVisibleLabels] = useState<Record<string, boolean>>(
    {},
  );
  useNavigateMessagesKeymap(labelRefs.current);

  const onClickLabel = (labelId: string) => {
    return () => {
      setVisibleLabels((prev) => ({
        ...prev,
        [labelId]: !prev[labelId],
      }));
    };
  };
  const assignLabelRef = (label: string) => {
    return (labelEl: HTMLButtonElement) => {
      if (!labelEl) {
        return;
      }
      labelRefs.current[label] = labelEl;
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
          <Fragment key={label.id}>
            <button
              data-list-item={getLabelDataListItem(label.id)}
              className="sticky top-0 z-10 flex w-full items-center gap-1 bg-secondary px-2 py-1 text-sm"
              onClick={onClickLabel(label.id)}
              ref={assignLabelRef(label.id)}
            >
              {ButtonIcon} {label.name}
            </button>
            {visibleLabels[label.id] && (
              <MessageList
                filters={[filterForLabels([label.id])]}
                uniqueListId={label.id}
                dataListItemLabel={label.id}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
