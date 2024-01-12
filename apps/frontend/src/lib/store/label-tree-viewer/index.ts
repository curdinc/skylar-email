import { atom, useAtom } from "jotai";

import type { ThreadType } from "@skylar/parsers-and-types";

export const VIEW_MORE_ITEM = (labelId: string) => {
  return {
    id: `view-more-${labelId}`,
    parentId: labelId,
    displayValue: "View more",
    type: "labelItemViewMore",
  } satisfies LabelTreeViewerEndOfLabelListType;
};
export const LOADING_LABEL_ITEM = (labelId: string) => {
  return {
    id: `loading-label-${labelId}`,
    parentId: labelId,
    displayValue: "Loading...",
    type: "labelItemInfo",
  } satisfies LabelTreeViewerEndOfLabelListType;
};
export const NO_LABELS_ITEM = (labelId: string) => {
  return {
    id: `no-item-label-${labelId}`,
    parentId: labelId,
    displayValue: "No more messages",
    type: "labelItemInfo",
  } satisfies LabelTreeViewerEndOfLabelListType;
};
export const DEFAULT_LIST_ITEM_LIMIT = 25;

export type LabelTreeViewerEndOfLabelListType = {
  id: string;
  parentId: string;
  displayValue: string;
  type: "labelItemViewMore" | "labelItemInfo";
};
export type LabelTreeViewerItemType = {
  id: string;
  parentId: string;
  displayValue: string;
  timestampReceived: number;
  type: "labelItem";
  state: "viewable" | "hidden";
};
export type LabelTreeViewerParentType = {
  id: string;
  displayValue: string;
  type: "label";
  state: "closed" | "open";
  children: Map<
    string,
    LabelTreeViewerEndOfLabelListType | LabelTreeViewerItemType
  >;
};
export type LabelTreeViewerRowType =
  | LabelTreeViewerParentType
  | LabelTreeViewerEndOfLabelListType
  | LabelTreeViewerItemType;

export const labelTreeViewerMappingAtom = atom<
  Map<string, LabelTreeViewerParentType>
>(new Map());
export const useLabelsTreeViewerMapping = () =>
  useAtom(labelTreeViewerMappingAtom);

export const labelTreeViewerRowsAtom = atom<LabelTreeViewerRowType[]>((get) => {
  const labels = get(labelTreeViewerMappingAtom);
  return Array.from(labels.values()).reduce((prev, currentLabel) => {
    const children: (
      | LabelTreeViewerEndOfLabelListType
      | LabelTreeViewerItemType
    )[] = [];
    if (currentLabel.state === "open") {
      let endListItem: LabelTreeViewerEndOfLabelListType | undefined;
      for (const item of Array.from(currentLabel.children.values())) {
        if (item.type === "labelItem") {
          children.push(item);
        } else {
          endListItem = item;
        }
      }
      children.sort((a, b) => {
        if (a.type !== "labelItem" || b.type !== "labelItem") {
          return 0;
        }
        return b.timestampReceived - a.timestampReceived;
      });
      if (!endListItem) {
        throw new Error("endListItem is undefined");
      }
      children.push(endListItem);
    }

    return [...prev, currentLabel, ...children];
  }, [] as LabelTreeViewerRowType[]);
});
export const useLabelsTreeViewerRows = () => useAtom(labelTreeViewerRowsAtom);

export const labelTreeViewerDataAtom = atom<Map<string, ThreadType>>(new Map());

export const labelListAtom = atom<string[]>((get) => {
  const labelsMap = get(labelTreeViewerMappingAtom);
  return Array.from(labelsMap.keys());
});
export const labelTreeViewerRowsLengthAtom = atom<number>((get) => {
  const rowData = get(labelTreeViewerRowsAtom);
  return rowData.length;
});

export const hasLoadedInitialData = (label: LabelTreeViewerParentType) => {
  return (
    label.children.size !== 1 ||
    !label.children.has(LOADING_LABEL_ITEM(label.id).id)
  );
};
