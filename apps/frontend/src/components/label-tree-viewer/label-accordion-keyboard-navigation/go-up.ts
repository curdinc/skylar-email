import { SkylarClientStore } from "~/lib/store/index,";
import { activeItemIndexAtom } from "~/lib/store/labels-tree-viewer";

export const goUpLabelTree = (e: KeyboardEvent) => {
  e.preventDefault();
  const activeItemIndex = SkylarClientStore.get(activeItemIndexAtom);
  if (activeItemIndex === undefined) {
    SkylarClientStore.set(activeItemIndexAtom, 0);
  } else if (activeItemIndex > 0) {
    SkylarClientStore.set(activeItemIndexAtom, activeItemIndex - 1);
  }
};
