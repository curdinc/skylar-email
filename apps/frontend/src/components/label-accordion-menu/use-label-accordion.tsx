"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  filterForLabels,
  getThreadSnippets,
  liveClientDbQuery,
} from "@skylar/client-db";
import type { LabelListViewerType } from "@skylar/logic";
import {
  setActiveThread,
  setLabelListDataMutable,
  useOptimizedGlobalStore,
} from "@skylar/logic";
import type { ThreadType } from "@skylar/parsers-and-types";

import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { useListLabels } from "../../app/(inbox)/(workspace)/use-list-labels";

const LOADING_LIST_ITEM = {
  id: "loading-list-item",
  displayValue: "Loading...",
  type: "labelItemInfo",
} as const;
const NO_MESSAGES_LIST_ITEM = {
  id: "no-messages-list-item",
  displayValue: "No messages yet.",
  type: "labelItemInfo",
} as const;
const LOAD_MORE_LIST_ITEM = (labelId: string) => {
  return {
    id: labelId,
    displayValue: "Load More",
    type: "labelItemViewMore",
  } as const;
};

const fetchLiveThreadData = (
  emailAddress: string,
  labelId: string,
  limit: number,
) => {
  return liveClientDbQuery({
    querier: () => {
      return getThreadSnippets({
        userEmails: [emailAddress],
        filters: [filterForLabels([labelId])],
        limit,
      });
    },
    error: (e) => {
      console.error("Error fetching threads", e);
    },
    next: (threadData) => {
      startTransition(() => {
        setLabelListDataMutable((prev) => {
          return prev?.map((label) => {
            if (label.id !== labelId) {
              return label;
            }
            if (threadData.length === 0) {
              return {
                ...label,
                children: [NO_MESSAGES_LIST_ITEM],
              };
            }
            const isSameList =
              (label.children.length === threadData.length ||
                // -1 to account for the view more button
                label.children.length - 1 === threadData.length) &&
              label.children.reduce((prev, curr, index) => {
                if (curr.type !== "labelItem") {
                  return prev;
                }
                if (curr.type === "labelItem") {
                  const { thread: currThread } = curr;
                  return (
                    prev &&
                    currThread.provider_thread_id ===
                      threadData[index]?.provider_thread_id &&
                    currThread.provider_message_ids.join("") ===
                      threadData[index]?.provider_message_ids.join("") &&
                    currThread.provider_message_labels.join("") ===
                      threadData[index]?.provider_message_labels.join("")
                  );
                }
                throw new Error("Unknown type");
              }, true);
            if (isSameList) {
              return label;
            }

            const newChildren: LabelListViewerType["children"] = [
              ...threadData.map((thread) => {
                return {
                  id: thread.provider_thread_id,
                  displayValue: thread.subject,
                  thread: thread,
                  type: "labelItem" as const,
                  state: "viewable" as const,
                };
              }),
              ...(threadData.length < limit
                ? []
                : [LOAD_MORE_LIST_ITEM(label.id)]),
            ];
            return {
              ...label,
              children: newChildren,
            };
          });
        });
      });
    },
  });
};

const DEFAULT_LABEL_LIST_LENGTH = 25;
export const useLabelAccordion = () => {
  const { data: labels } = useListLabels();

  const { data: activeEmailAddress } = useActiveEmailAddress();
  const labelListData = useOptimizedGlobalStore(
    (state) => state.EMAIL_CLIENT.LABEL_LIST.labelListData,
  );
  const [labelListLimit, setLabelListLimit] = useState<Record<string, number>>(
    {},
  );
  useEffect(() => {
    if (!labels || !activeEmailAddress) {
      return;
    }
    const initialLabelData =
      labels[activeEmailAddress]?.map((label) => {
        return {
          ...label,
          displayValue: label.name,
          children: [LOADING_LIST_ITEM],
          type: "label",
          state: "closed",
        } satisfies LabelListViewerType;
      }) ?? [];
    setLabelListDataMutable(initialLabelData);
  }, [activeEmailAddress, labels]);

  useEffect(() => {
    const subscriptions = labelListData
      ?.filter((label) => {
        return label.state === "open";
      })
      .map((openLabel) => {
        return fetchLiveThreadData(
          activeEmailAddress ?? "",
          openLabel.id,
          labelListLimit[openLabel.id] ?? DEFAULT_LABEL_LIST_LENGTH,
        );
      });
    return () => {
      subscriptions?.forEach((subscription) => {
        subscription.unsubscribe();
      });
    };
  }, [activeEmailAddress, labelListData, labelListLimit]);

  const labelListRenderData = useMemo(() => {
    if (!labelListData) {
      return undefined;
    }
    return labelListData.reduce(
      (prev, curr) => {
        const children = curr.children;
        // todo: delete children from curr
        return [
          ...prev,
          {
            ...curr,
          },
          ...(curr.state === "closed" ? [] : children),
        ];
      },
      [] as (
        | Omit<LabelListViewerType, "children">
        | LabelListViewerType["children"][number]
      )[],
    );
  }, [labelListData]);

  const listItemCount = labelListRenderData?.length ?? 0;

  const onClickViewMore = useCallback((labelId: string) => {
    return () => {
      setLabelListDataMutable((prev) => {
        return prev?.map((label) => {
          if (label.id !== labelId) {
            return label;
          }
          return {
            ...label,
            children: [...label.children.slice(0, -1), LOADING_LIST_ITEM],
          };
        });
      });
      setLabelListLimit((prev) => {
        return {
          ...prev,
          [labelId]:
            (prev[labelId] ?? DEFAULT_LABEL_LIST_LENGTH) +
            DEFAULT_LABEL_LIST_LENGTH,
        };
      });
    };
  }, []);

  const onClickThread = useCallback((thread: ThreadType) => {
    return () => {
      captureEvent({
        event: TrackingEvents.threadOpened,
        properties: {},
      });

      setActiveThread(thread);
    };
  }, []);

  const onClickLabel = useCallback((labelId: string) => {
    return () => {
      setLabelListDataMutable((prev) => {
        return prev?.map((label) => {
          if (label.id !== labelId) {
            return { ...label };
          }
          if (label.state === "open") {
            return {
              ...label,
              state: "closed" as const,
            };
          }
          return {
            ...label,
            state: "open" as const,
          };
        });
      });
    };
  }, []);

  return {
    labelListRenderData,
    listItemCount,
    onClickThread,
    onClickLabel,
    onClickViewMore,
  };
};
