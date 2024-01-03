import { atom, useSetAtom } from "jotai";

import { filterForLabels, getThreadSnippets } from "@skylar/client-db";

import {
  DEFAULT_LIST_ITEM_LIMIT,
  hasLoadedInitialData,
  labelTreeViewerDataAtom,
  labelTreeViewerMappingAtom,
  LOADING_LABEL_ITEM,
  NO_LABELS_ITEM,
  VIEW_MORE_ITEM,
} from ".";

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
    if (!hasLoadedInitialData(labelToggled)) {
      getThreadSnippets({
        userEmails: [userEmailAddress],
        filters: [filterForLabels([labelIdToToggle])],
        limit: DEFAULT_LIST_ITEM_LIMIT,
      })
        .then((threadData) => {
          const labelMapping = get(labelTreeViewerMappingAtom);
          const labelToggled = labelMapping.get(labelIdToToggle);
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
              parentId: labelIdToToggle,
              displayValue: thread.subject,
              type: "labelItem",
              state: "viewable",
            });
            newThreadMapping.set(thread.provider_thread_id, thread);
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
          newLabelMapping.set(labelIdToToggle, {
            ...labelToggled,
            children: labelToggled.children,
          });

          set(labelTreeViewerDataAtom, newThreadMapping);
          set(labelTreeViewerMappingAtom, newLabelMapping);
        })
        .catch((e) => {
          console.error("Error fetching initial thread data", e);
        });
    }
  }
});
export const useToggleLabel = () => useSetAtom(toggleLabelAtom);
