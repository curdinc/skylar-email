import { SkylarClientStore } from "~/lib/store/index,";
import { labelListAtom } from "~/lib/store/label-tree-viewer";
import { activeItemRowAtom } from "~/lib/store/label-tree-viewer/active-item";
import { toggleLabelAtom } from "~/lib/store/label-tree-viewer/toggle-label";

export const openLabelOrGoToNextLabel = async (activeEmailAddress: string) => {
  const activeRow = await SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow) {
    return;
  }
  if (activeRow.type === "label" && activeRow.state === "closed") {
    SkylarClientStore.set(toggleLabelAtom, {
      labelIdToToggle: activeRow.id,
      userEmailAddress: activeEmailAddress,
    });
  } else {
    const labels = SkylarClientStore.get(labelListAtom);
    const labelIndex = labels.findIndex((label) => {
      return (
        label === activeRow.id ||
        ("parentId" in activeRow && label === activeRow?.parentId)
      );
    });
    if (labelIndex === -1) {
      return;
    }
    const nextLabel = labels[labelIndex + 1];
    if (nextLabel) {
      SkylarClientStore.set(activeItemRowAtom, {
        id: nextLabel,
      });
      return;
    }
  }
};
