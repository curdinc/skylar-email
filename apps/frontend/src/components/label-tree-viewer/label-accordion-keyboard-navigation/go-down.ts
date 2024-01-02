import type { TransitionStartFunction } from "react";

import { SkylarClientStore } from "~/lib/store/index,";
import { labelTreeViewerRowsLengthAtom } from "~/lib/store/label-tree-viewer";
import { activeItemIndexAtom } from "~/lib/store/label-tree-viewer/active-item";

export const goDownLabelTree =
  (startTransition: TransitionStartFunction) => (e: KeyboardEvent) => {
    e.preventDefault();
    const activeItemIndex = SkylarClientStore.get(activeItemIndexAtom);
    const totalRowLength = SkylarClientStore.get(labelTreeViewerRowsLengthAtom);
    if (activeItemIndex === undefined) {
      startTransition(() => SkylarClientStore.set(activeItemIndexAtom, 0));
    } else if (activeItemIndex < totalRowLength - 1) {
      startTransition(() =>
        SkylarClientStore.set(activeItemIndexAtom, activeItemIndex + 1),
      );
    }
  };
