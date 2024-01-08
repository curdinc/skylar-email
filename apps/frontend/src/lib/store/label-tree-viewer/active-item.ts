import { useMemo } from "react";
import { atom, useAtom, useAtomValue } from "jotai";

import { bulkGetThreads } from "@skylar/client-db";
import type { ThreadType } from "@skylar/parsers-and-types";

import type {
  LabelTreeViewerEndOfLabelListType,
  LabelTreeViewerItemType,
  LabelTreeViewerParentType,
} from ".";
import { labelTreeViewerDataAtom, labelTreeViewerRowsAtom } from ".";
import { SkylarClientStore } from "../index,";
import { toggleLabelAtom } from "./toggle-label";
import { viewMoreLabelItemAtom } from "./view-more-label-item";

export const activeItemIndexAtom = atom<number | undefined>(undefined);
export const useActiveItemIndex = () => useAtom(activeItemIndexAtom);

const getRowAtom = (index?: number) => {
  return atom<
    Promise<
      | LabelTreeViewerParentType
      | LabelTreeViewerEndOfLabelListType
      | (LabelTreeViewerItemType & { thread: ThreadType })
      | undefined
    >
    // [{ id: string }],
    // number | undefined
  >(
    async (get) => {
      if (!index) {
        return;
      }
      const rows = get(labelTreeViewerRowsAtom);
      const currentRow = rows[index];
      if (!currentRow) {
        return currentRow;
      }
      if (currentRow.type !== "labelItem") {
        return currentRow;
      }
      const threadMapping = get(labelTreeViewerDataAtom);
      let thread = threadMapping.get(currentRow.id);
      if (!thread) {
        thread = (
          await bulkGetThreads({
            providerThreadIds: [currentRow.id],
          })
        )[0];
        if (!thread) {
          throw new Error(`Missing thread ID ${currentRow.id}`);
        }
      }
      return { ...currentRow, thread };
    },
    // (get, set, update) => {
    //   const rows = get(labelTreeViewerRowsAtom);
    //   const rowIndexToChange = rows.findIndex((row) => row.id === update.id);
    //   if (rowIndexToChange === -1) {
    //     return;
    //   }
    //   set(activeItemIndexAtom, activeItemIndex);
    //   return activeItemIndex;
    // },
  );
};
export const useRow = (index?: number) =>
  useAtomValue(useMemo(() => getRowAtom(index), [index]));

export const activeItemRowAtom = atom<
  Promise<
    | LabelTreeViewerParentType
    | LabelTreeViewerEndOfLabelListType
    | (LabelTreeViewerItemType & { thread: ThreadType })
    | undefined
  >,
  [{ id: string }],
  number | undefined
>(
  async (get) => {
    const activeItemIndex = get(activeItemIndexAtom);
    const activeRow = await get(getRowAtom(activeItemIndex));
    return activeRow;
  },
  (get, set, update) => {
    const rows = get(labelTreeViewerRowsAtom);
    const activeItemIndex = rows.findIndex((row) => row.id === update?.id);
    if (activeItemIndex === -1) {
      return;
    }
    set(activeItemIndexAtom, activeItemIndex);
    return activeItemIndex;
  },
);

export const useActiveItemRow = () => useAtom(activeItemRowAtom);

export const clickActiveItem = async (userEmailAddress: string) => {
  const activeRow = await SkylarClientStore.get(activeItemRowAtom);
  if (!activeRow) {
    return;
  }
  switch (activeRow.type) {
    case "label": {
      SkylarClientStore.set(toggleLabelAtom, {
        labelIdToToggle: activeRow.id,
        userEmailAddress,
      });
      break;
    }
    case "labelItemViewMore": {
      SkylarClientStore.set(viewMoreLabelItemAtom, {
        labelIdToViewMore: activeRow.parentId,
        userEmailAddress,
      });
      break;
    }
  }
};
