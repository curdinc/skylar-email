import { SkylarClientStore } from "~/lib/store/index,";
import { activeItemRowAtom } from "~/lib/store/label-tree-navigator";
import { toggleLabelAtom } from "~/lib/store/labels-tree-viewer";

export const closeLabelOrGoToPreviousLabel = (activeEmailAddress: string) => {
  return () => {
    const activeRow = SkylarClientStore.get(activeItemRowAtom);
    if (activeRow?.type === "label") {
      SkylarClientStore.set(toggleLabelAtom, {
        labelIdToToggle: activeRow.id,
        userEmailAddress: activeEmailAddress,
      });
    } else if (activeRow?.parentId) {
      SkylarClientStore.set(activeItemRowAtom, {
        id: activeRow.parentId,
      });
    }
  };
};
