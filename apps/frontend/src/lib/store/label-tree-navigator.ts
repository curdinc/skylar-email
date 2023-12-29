import { atom, useAtom } from "jotai";

import type { LabelTreeViewerRowType } from "./labels-tree-viewer";
import {
  labelTreeViewerMappingAtom,
  labelTreeViewerRowsAtom,
} from "./labels-tree-viewer";

export const activeItemIndexAtom = atom<number | undefined>(undefined);
export const useActiveItemIndex = () => useAtom(activeItemIndexAtom);
export const labelTreeViewerRowsLengthAtom = atom<number>((get) => {
  const rowData = get(labelTreeViewerRowsAtom);
  return rowData.length;
});
export const activeItemRowAtom = atom<
  LabelTreeViewerRowType | undefined,
  [{ id: string }],
  number | undefined
>(
  (get) => {
    const rows = get(labelTreeViewerRowsAtom);
    const activeItemIndex = get(activeItemIndexAtom);
    if (activeItemIndex === undefined) {
      return undefined;
    }
    return rows[activeItemIndex];
  },
  (get, set, update) => {
    const rows = get(labelTreeViewerRowsAtom);
    const activeItemIndex = rows.findIndex((row) => row.id === update?.id);
    if (activeItemIndex === -1) {
      return;
    }
    set(activeItemIndexAtom, activeItemIndex);
    return activeItemIndex;
  },
);
export const labelListAtom = atom<string[]>((get) => {
  const labelsMap = get(labelTreeViewerMappingAtom);
  return Array.from(labelsMap.keys());
});
