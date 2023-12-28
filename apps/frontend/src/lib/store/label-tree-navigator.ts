import { atom, useAtom } from "jotai";

import { labelTreeViewerRowsAtom } from "./labels-tree-viewer";

export const activeItemIndexAtom = atom<number | undefined>(undefined);
export const useActiveItemIndex = () => useAtom(activeItemIndexAtom);
export const labelTreeViewerRowsLengthAtom = atom<number>((get) => {
  const rowData = get(labelTreeViewerRowsAtom);
  return rowData.length;
});
