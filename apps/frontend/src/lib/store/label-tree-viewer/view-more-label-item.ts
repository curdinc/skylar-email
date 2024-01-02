import { atom, useSetAtom } from "jotai";

import { filterForLabels, getThreadSnippets } from "@skylar/client-db";

import {
  DEFAULT_LIST_ITEM_LIMIT,
  labelTreeViewerMappingAtom,
  LOADING_LABEL_ITEM,
  NO_LABELS_ITEM,
  VIEW_MORE_ITEM,
} from ".";

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
      const labelMapping = get(labelTreeViewerMappingAtom);
      const labelToggled = labelMapping.get(labelIdToViewMore);
      if (!labelToggled) {
        return;
      }
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
export const useViewMoreLabelItem = () => useSetAtom(viewMoreLabelItemAtom);
