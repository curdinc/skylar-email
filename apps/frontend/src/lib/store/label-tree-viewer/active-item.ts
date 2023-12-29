import { atom, useAtom } from "jotai";

import type { LabelTreeViewerRowType } from ".";
import { labelTreeViewerRowsAtom } from ".";

export const activeItemIndexAtom = atom<number | undefined>(undefined);
export const useActiveItemIndex = () => useAtom(activeItemIndexAtom);

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
export const useActiveItemRow = () => useAtom(activeItemRowAtom);
