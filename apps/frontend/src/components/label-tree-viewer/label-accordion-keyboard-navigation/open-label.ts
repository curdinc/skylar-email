import { SkylarClientStore } from "~/lib/store/index,";
import {
  activeItemRowAtom,
  labelListAtom,
} from "~/lib/store/label-tree-navigator";
import { toggleLabelAtom } from "~/lib/store/labels-tree-viewer";

export const openLabelOrGoToNextLabel = (activeEmailAddress: string) => {
  return () => {
    const activeRow = SkylarClientStore.get(activeItemRowAtom);
    if (activeRow?.type === "label") {
      SkylarClientStore.set(toggleLabelAtom, {
        labelIdToToggle: activeRow.id,
        userEmailAddress: activeEmailAddress,
      });
    } else {
      const labels = SkylarClientStore.get(labelListAtom);
      for (let i = 0; i < labels.length; ++i) {
        const label = labels[i];
        if (label === activeRow?.parentId) {
          const nextLabel = labels[i + 1];
          if (nextLabel) {
            SkylarClientStore.set(activeItemRowAtom, {
              id: nextLabel,
            });
            return;
          }
        }
      }
    }
  };
};
