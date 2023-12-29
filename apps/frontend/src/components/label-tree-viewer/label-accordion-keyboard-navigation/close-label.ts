import { SkylarClientStore } from "~/lib/store/index,";
import {
  activeItemRowAtom,
  labelListAtom,
  toggleLabelAtom,
} from "~/lib/store/labels-tree-viewer";

export const closeLabelOrGoToPreviousLabel = (activeEmailAddress: string) => {
  return () => {
    const activeRow = SkylarClientStore.get(activeItemRowAtom);
    if (!activeRow) {
      return;
    }
    if (activeRow.type === "label") {
      if (activeRow.state === "open") {
        SkylarClientStore.set(toggleLabelAtom, {
          labelIdToToggle: activeRow.id,
          userEmailAddress: activeEmailAddress,
        });
      } else {
        const labels = SkylarClientStore.get(labelListAtom);
        for (let i = 0; i < labels.length; ++i) {
          const label = labels[i];
          if (label === activeRow.id) {
            const previousLabel = labels[i - 1];
            if (previousLabel) {
              SkylarClientStore.set(activeItemRowAtom, {
                id: previousLabel,
              });
              return;
            }
          }
        }
      }
    } else if (activeRow.parentId) {
      SkylarClientStore.set(activeItemRowAtom, {
        id: activeRow.parentId,
      });
    }
  };
};
