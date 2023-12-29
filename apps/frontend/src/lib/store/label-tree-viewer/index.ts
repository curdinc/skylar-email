import { atom, useAtom } from "jotai";

import type { ThreadType } from "@skylar/parsers-and-types";

export const VIEW_MORE_ITEM = (labelId: string) => {
  return {
    id: `view-more-${labelId}`,
    parentId: labelId,
    displayValue: "View more",
    type: "labelItemViewMore",
  } satisfies LabelTreeViewerLeafType;
};
export const LOADING_LABEL_ITEM = (labelId: string) => {
  return {
    id: `loading-label-${labelId}`,
    parentId: labelId,
    displayValue: "Loading...",
    type: "labelItemInfo",
  } satisfies LabelTreeViewerLeafType;
};
export const NO_LABELS_ITEM = (labelId: string) => {
  return {
    id: `no-item-label-${labelId}`,
    parentId: labelId,
    displayValue: "No more messages",
    type: "labelItemInfo",
  } satisfies LabelTreeViewerLeafType;
};
export const DEFAULT_LIST_ITEM_LIMIT = 25;

type LabelTreeViewerLeafType =
  | {
      id: string;
      parentId: string;
      displayValue: string;
      type: "labelItemViewMore" | "labelItemInfo";
    }
  | {
      id: string;
      parentId: string;
      displayValue: string;
      type: "labelItem";
      state: "beingViewed" | "viewable" | "hidden";
      thread: ThreadType;
    };
export type LabelTreeViewerParentType = {
  id: string;
  displayValue: string;
  type: "label";
  state: "closed" | "open";
  children: Map<string, LabelTreeViewerLeafType>;
};

export type LabelTreeViewerRowType =
  | LabelTreeViewerParentType
  | LabelTreeViewerLeafType;

export const labelTreeViewerMappingAtom = atom<
  Map<string, LabelTreeViewerParentType>
>(new Map());
export const useLabelsTreeViewerMapping = () =>
  useAtom(labelTreeViewerMappingAtom);

export const labelTreeViewerRowsAtom = atom<LabelTreeViewerRowType[]>((get) => {
  const labels = get(labelTreeViewerMappingAtom);
  return Array.from(labels.values()).reduce((prev, currentLabel) => {
    return [
      ...prev,
      currentLabel,
      ...(currentLabel.state === "open"
        ? Array.from(currentLabel.children.values()).filter(
            (item) => item.type !== "labelItem" || item.state !== "hidden",
          )
        : []),
    ];
  }, [] as LabelTreeViewerRowType[]);
});
export const useLabelsTreeViewerRows = () => useAtom(labelTreeViewerRowsAtom);

export const labelListAtom = atom<string[]>((get) => {
  const labelsMap = get(labelTreeViewerMappingAtom);
  return Array.from(labelsMap.keys());
});
export const labelTreeViewerRowsLengthAtom = atom<number>((get) => {
  const rowData = get(labelTreeViewerRowsAtom);
  return rowData.length;
});
