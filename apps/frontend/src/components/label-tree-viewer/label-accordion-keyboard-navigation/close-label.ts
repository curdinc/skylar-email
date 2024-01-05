import { SkylarClientStore } from "~/lib/store/index,";
import { labelListAtom } from "~/lib/store/label-tree-viewer";
import { activeItemRowAtom } from "~/lib/store/label-tree-viewer/active-item";
import { toggleLabelAtom } from "~/lib/store/label-tree-viewer/toggle-label";

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
        const labelIndex = labels.findIndex((label) => {
          return label === activeRow.id;
        });
        if (labelIndex === -1) {
          return;
        }

        const previousLabel = labels[labelIndex - 1];
        if (previousLabel) {
          SkylarClientStore.set(activeItemRowAtom, {
            id: previousLabel,
          });
          return;
        }
      }
    } else if (activeRow.parentId) {
      SkylarClientStore.set(activeItemRowAtom, {
        id: activeRow.parentId,
      });
    }
  };
};
