import { atom, useAtom } from "jotai";

import { filterForLabels, getThreadSnippets } from "@skylar/client-db";
import type { ThreadType } from "@skylar/parsers-and-types";

export const VIEW_MORE_ITEM = (labelId: string) => {
  return {
    id: `view-more-${labelId}`,
    parentId: labelId,
    displayValue: "View more",
    type: "labelItemViewMore",
  } satisfies LabelTreeViewerLeafType;
};
export const LOADING_LABEL_ITEM = (labelId: string) => {
  return {
    id: `loading-label-${labelId}`,
    parentId: labelId,
    displayValue: "Loading...",
    type: "labelItemInfo",
  } satisfies LabelTreeViewerLeafType;
};
export const NO_LABELS_ITEM = (labelId: string) => {
  return {
    id: `no-item-label-${labelId}`,
    parentId: labelId,
    displayValue: "No more messages",
    type: "labelItemInfo",
  } satisfies LabelTreeViewerLeafType;
};
const DEFAULT_LIST_ITEM_LIMIT = 25;
type LabelTreeViewerLeafType =
  | {
      id: string;
      parentId: string;
      displayValue: string;
      type: "labelItemViewMore" | "labelItemInfo";
    }
  | {
      id: string;
      parentId: string;
      displayValue: string;
      type: "labelItem";
      state: "beingViewed" | "viewable";
      thread: ThreadType;
    };
export type LabelTreeViewerParentType = {
  id: string;
  displayValue: string;
  type: "label";
  state: "closed" | "open";
  children: Map<string, LabelTreeViewerLeafType>;
};

export type LabelTreeViewerRowType =
  | LabelTreeViewerParentType
  | LabelTreeViewerLeafType;

export const labelTreeViewerMappingAtom = atom<
  Map<string, LabelTreeViewerParentType>
>(new Map());
export const useLabelsTreeViewerMapping = () =>
  useAtom(labelTreeViewerMappingAtom);
export const labelTreeViewerRowsAtom = atom<LabelTreeViewerRowType[]>((get) => {
  const labels = get(labelTreeViewerMappingAtom);
  return Array.from(labels.values()).reduce((prev, currentLabel) => {
    return [
      ...prev,
      currentLabel,
      ...(currentLabel.state === "open"
        ? Array.from(currentLabel.children.values())
        : []),
    ];
  }, [] as LabelTreeViewerRowType[]);
});
export const useLabelsTreeViewerRows = () => useAtom(labelTreeViewerRowsAtom);

export const toggleLabelAtom = atom<
  null,
  [{ labelIdToToggle: string; userEmailAddress: string }],
  void
>(null, (get, set, { labelIdToToggle, userEmailAddress }) => {
  const labelMapping = get(labelTreeViewerMappingAtom);
  const labelToggled = labelMapping.get(labelIdToToggle);
  const labelLoadingItemId = LOADING_LABEL_ITEM(labelIdToToggle).id;

  if (!labelToggled) {
    return;
  }
  if (labelToggled.state === "open") {
    const newMapping = new Map(labelMapping);
    newMapping.set(labelIdToToggle, {
      ...labelToggled,
      state: "closed",
    });
    set(labelTreeViewerMappingAtom, newMapping);
  } else if (labelToggled.state === "closed") {
    const newMapping = new Map(labelMapping);
    newMapping.set(labelIdToToggle, {
      ...labelToggled,
      state: "open",
    });
    set(labelTreeViewerMappingAtom, newMapping);

    // if no initial items yet, fetch item
    if (
      labelToggled.children.size === 1 &&
      labelToggled.children.has(labelLoadingItemId)
    ) {
      getThreadSnippets({
        userEmails: [userEmailAddress],
        filters: [filterForLabels([labelIdToToggle])],
        limit: DEFAULT_LIST_ITEM_LIMIT,
      })
        .then((threadData) => {
          const newMapping = new Map(labelMapping);
          labelToggled.children.delete(labelLoadingItemId);

          threadData.forEach((thread) => {
            labelToggled.children.set(thread.provider_thread_id, {
              id: thread.provider_thread_id,
              parentId: labelIdToToggle,
              displayValue: thread.subject,
              type: "labelItem",
              state: "viewable",
              thread,
            });
          });
          if (threadData.length === DEFAULT_LIST_ITEM_LIMIT) {
            labelToggled.children.set(
              VIEW_MORE_ITEM(labelIdToToggle).id,
              VIEW_MORE_ITEM(labelIdToToggle),
            );
          } else {
            labelToggled.children.set(
              NO_LABELS_ITEM(labelIdToToggle).id,
              NO_LABELS_ITEM(labelIdToToggle),
            );
          }

          newMapping.set(labelIdToToggle, {
            ...labelToggled,
            state: "open",
            children: labelToggled.children,
          });
          set(labelTreeViewerMappingAtom, newMapping);
        })
        .catch((e) => {
          console.error("Error fetching initial thread data", e);
        });
    }
  }
});
export const useToggleLabel = () => useAtom(toggleLabelAtom)[1];

export const viewMoreLabelItemAtom = atom<
  null,
  [{ labelIdToViewMore: string; userEmailAddress: string }],
  void
>(null, (get, set, { labelIdToViewMore, userEmailAddress }) => {
  const labelMapping = get(labelTreeViewerMappingAtom);
  const labelToggled = labelMapping.get(labelIdToViewMore);
  if (!labelToggled) {
    return;
  }
  const labelLoadingItemId = LOADING_LABEL_ITEM(labelIdToViewMore).id;
  const labelViewMoreItemId = VIEW_MORE_ITEM(labelIdToViewMore).id;

  const newLabelMapping = new Map(labelMapping);
  labelToggled.children.delete(labelViewMoreItemId);
  labelToggled.children.set(
    labelLoadingItemId,
    LOADING_LABEL_ITEM(labelIdToViewMore),
  );
  newLabelMapping.set(labelIdToViewMore, {
    ...labelToggled,
    children: labelToggled.children,
  });
  set(labelTreeViewerMappingAtom, newLabelMapping);

  const lastLabelItem = Array.from(labelToggled.children.values()).at(-2);
  getThreadSnippets({
    userEmails: [userEmailAddress],
    filters: [filterForLabels([labelIdToViewMore])],
    limit: DEFAULT_LIST_ITEM_LIMIT,
    lastEntry:
      lastLabelItem?.type === "labelItem" ? lastLabelItem.thread : undefined,
  })
    .then((threadData) => {
      const newLabelMapping = new Map(labelMapping);
      labelToggled.children.delete(labelLoadingItemId);

      threadData.forEach((thread) => {
        labelToggled.children.set(thread.provider_thread_id, {
          id: thread.provider_thread_id,
          parentId: labelIdToViewMore,
          displayValue: thread.subject,
          type: "labelItem",
          state: "viewable",
          thread,
        });
      });
      if (threadData.length === DEFAULT_LIST_ITEM_LIMIT) {
        labelToggled.children.set(
          VIEW_MORE_ITEM(labelIdToViewMore).id,
          VIEW_MORE_ITEM(labelIdToViewMore),
        );
      } else {
        labelToggled.children.set(
          NO_LABELS_ITEM(labelIdToViewMore).id,
          NO_LABELS_ITEM(labelIdToViewMore),
        );
      }

      newLabelMapping.set(labelIdToViewMore, {
        ...labelToggled,
        children: labelToggled.children,
      });
      set(labelTreeViewerMappingAtom, newLabelMapping);
    })
    .catch((e) => {
      console.error("Error fetching more thread data", e);
    });
});
export const useViewMoreLabelItem = () => useAtom(viewMoreLabelItemAtom)[1];
