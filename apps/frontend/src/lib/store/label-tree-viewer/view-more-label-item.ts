import { atom, useSetAtom } from "jotai";

import {
  bulkGetThreads,
  filterForLabels,
  getThreadSnippets,
} from "@skylar/client-db";

import {
  DEFAULT_LIST_ITEM_LIMIT,
  labelTreeViewerDataAtom,
  labelTreeViewerMappingAtom,
  LOADING_LABEL_ITEM,
  NO_LABELS_ITEM,
  VIEW_MORE_ITEM,
} from ".";

export const viewMoreLabelItemAtom = atom<
  null,
  [{ labelIdToViewMore: string; userEmailAddress: string }],
  void
>(null, async (get, set, { labelIdToViewMore, userEmailAddress }) => {
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
  let lastEntry = undefined;
  if (lastLabelItem?.type === "labelItem") {
    lastEntry = (
      await bulkGetThreads({
        providerThreadIds: [lastLabelItem.id],
      })
    )[0];
  }
  getThreadSnippets({
    userEmails: [userEmailAddress],
    filters: [filterForLabels([labelIdToViewMore])],
    limit: DEFAULT_LIST_ITEM_LIMIT,
    lastEntry: lastEntry,
  })
    .then((threadData) => {
      const labelMapping = get(labelTreeViewerMappingAtom);
      const labelToggled = labelMapping.get(labelIdToViewMore);
      if (!labelToggled) {
        return;
      }
      const newLabelMapping = new Map(labelMapping);
      labelToggled.children.delete(labelLoadingItemId);

      const threadMapping = get(labelTreeViewerDataAtom);
      const newThreadMapping = new Map(threadMapping);

      threadData.forEach((thread) => {
        labelToggled.children.set(thread.provider_thread_id, {
          id: thread.provider_thread_id,
          parentId: labelIdToViewMore,
          displayValue: thread.subject,
          type: "labelItem",
          state: "viewable",
        });
        newThreadMapping.set(thread.provider_thread_id, thread);
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
      set(labelTreeViewerDataAtom, newThreadMapping);
    })
    .catch((e) => {
      console.error("Error fetching more thread data", e);
    });
});
export const useViewMoreLabelItem = () => useSetAtom(viewMoreLabelItemAtom);
