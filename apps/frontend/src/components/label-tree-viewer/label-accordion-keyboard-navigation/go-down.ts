import { SkylarClientStore } from "~/lib/store/index,";
import {
  activeItemIndexAtom,
  labelTreeViewerRowsLengthAtom,
} from "~/lib/store/label-tree-navigator";

export const goDownLabelTree = (e: KeyboardEvent) => {
  e.preventDefault();
  const activeItemIndex = SkylarClientStore.get(activeItemIndexAtom);
  const totalRowLength = SkylarClientStore.get(labelTreeViewerRowsLengthAtom);
  if (activeItemIndex === undefined) {
    SkylarClientStore.set(activeItemIndexAtom, 0);
  } else if (activeItemIndex < totalRowLength - 1) {
    SkylarClientStore.set(activeItemIndexAtom, activeItemIndex + 1);
  }
};
