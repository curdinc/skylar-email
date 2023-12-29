import type { TransitionStartFunction } from "react";

import { SkylarClientStore } from "~/lib/store/index,";
import { activeItemIndexAtom } from "~/lib/store/label-tree-viewer/active-item";

export const goUpLabelTree =
  (startTransition: TransitionStartFunction) => (e: KeyboardEvent) => {
    e.preventDefault();
    const activeItemIndex = SkylarClientStore.get(activeItemIndexAtom);
    if (activeItemIndex === undefined) {
      startTransition(() => SkylarClientStore.set(activeItemIndexAtom, 0));
    } else if (activeItemIndex > 0) {
      startTransition(() =>
        SkylarClientStore.set(activeItemIndexAtom, activeItemIndex - 1),
      );
    }
  };
