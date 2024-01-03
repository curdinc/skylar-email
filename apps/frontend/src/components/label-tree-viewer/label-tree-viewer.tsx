"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useLogger } from "~/lib/logger";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { useNavigateMessagesKeymap } from "~/lib/shortcuts/keymap-hooks";
import type { LabelTreeViewerParentType } from "~/lib/store/label-tree-viewer";
import {
  LOADING_LABEL_ITEM,
  useLabelsTreeViewerMapping,
  useLabelsTreeViewerRows,
} from "~/lib/store/label-tree-viewer";
import { useActiveItemIndex } from "~/lib/store/label-tree-viewer/active-item";
import { useListLabels } from "../../app/(inbox)/(workspace)/use-list-labels";
import { LabelTreeRow } from "./label-tree-row";
import type { RowStateType } from "./types";

/**
 * @returns The component that renders all the labels of a user and the corresponding messages
 */
export const LabelTreeViewer = () => {
  const logger = useLogger();
  useNavigateMessagesKeymap();
  const { data: labels } = useListLabels();
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const [activeItemIndex] = useActiveItemIndex();
  const [rows] = useLabelsTreeViewerRows();
  const [, setLabelTreeViewerMapping] = useLabelsTreeViewerMapping();
  const parentRef = useRef<HTMLDivElement>(null);

  const activeLabels = labels?.[activeEmailAddress ?? ""];

  useEffect(() => {
    if (!labels || !activeEmailAddress) {
      return;
    }

    const activeLabels = labels[activeEmailAddress];
    if (!activeLabels) {
      return;
    }
    const labelMapping = new Map<string, LabelTreeViewerParentType>();
    activeLabels.forEach((label) => {
      const loadingLabelItem = LOADING_LABEL_ITEM(label.id);
      labelMapping.set(label.id, {
        ...label,
        displayValue: label.name,
        type: "label",
        state: "closed",
        children: new Map([[loadingLabelItem.id, loadingLabelItem]]),
      } satisfies LabelTreeViewerParentType);
    });
    setLabelTreeViewerMapping(labelMapping);
  }, [activeEmailAddress, labels, setLabelTreeViewerMapping]);
  const estimateSize = useCallback(
    (idx: number) => {
      const rowData = rows[idx];
      if (!rowData) {
        return 0;
      }
      if (rowData.type === "label") {
        return 32;
      }
      return 36;
    },
    [rows],
  );
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: useCallback(() => parentRef.current, []),
    estimateSize,
    overscan: 3,
  });
  useEffect(() => {
    if (activeItemIndex) {
      rowVirtualizer.scrollToIndex(activeItemIndex, {
        align: "center",
        behavior: "smooth",
      });
    }
  }, [activeItemIndex, rowVirtualizer]);

  if (!activeLabels) {
    return <div>Loading ...</div>;
  }

  if (activeLabels.length === 0) {
    logger.warn("Done loading but no labels found");
    return <div>No labels found</div>;
  }

  return (
    <div ref={parentRef} className="h-full w-full overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
        className="relative w-full"
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowData = rows[virtualRow.index];
          let rowState: RowStateType = "inactive";
          if (virtualRow.index === activeItemIndex) {
            rowState = "active";
          }
          return (
            <LabelTreeRow
              key={virtualRow.index}
              index={virtualRow.index}
              row={rowData}
              translateY={virtualRow.start}
              rowState={rowState}
            />
          );
        })}
      </div>
    </div>
  );
};
