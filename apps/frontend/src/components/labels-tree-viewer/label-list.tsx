"use client";

import { startTransition } from "react";

import {
  filterForLabels,
  isThreadUnread,
  useThreadSnippetsInfinite,
} from "@skylar/client-db";
import { setActiveThread } from "@skylar/logic";
import type { ThreadType } from "@skylar/parsers-and-types";

import { ThreadContextMenu } from "~/components/tooklit/components/context-menu";
import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { cn } from "~/lib/ui";
import { Button } from "../ui/button";
import {
  DATA_THREAD_ITEM,
  getDataThreadItem,
} from "./label-accordion-keyboard-navigation/helpers";

/**
 *
 * @param {string} uniqueListId: The unique id of the list
 * @returns The component that renders all the messages of a user for a given set of filter
 */
export function LabelList({ labelId }: { labelId: string }) {
  const { data: activeEmailAddress } = useActiveEmailAddress();

  const { status, data, error, fetchNextPage, hasNextPage, refetch } =
    useThreadSnippetsInfinite({
      userEmails: activeEmailAddress ? [activeEmailAddress] : [],
      filters: [filterForLabels([labelId])],
      limit: 25,
      uid: labelId,
    });
  const allRows = data ? data.pages.flat() : [];

  const onClickThread = (thread: ThreadType) => {
    return () => {
      captureEvent({
        event: TrackingEvents.threadOpened,
        properties: {},
      });

      setActiveThread(thread);
    };
  };

  const onClickLoadMore = () => {
    const keepCurrentFocus = document.querySelector(
      `[${DATA_THREAD_ITEM}=${getDataThreadItem(labelId, allRows.length - 1)}]`,
    );
    (keepCurrentFocus as HTMLElement | undefined)?.focus();
    fetchNextPage().catch((e) => {
      console.error("Something went wrong fetching emails", e);
    });
  };

  if (status === "pending") {
    return (
      <div className="px-2 py-1" data-thread-wrapper={labelId}>
        Loading...
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="px-2 py-1" data-thread-wrapper={labelId}>
        Error: {error.message}
      </div>
    );
  }

  if (!allRows.length) {
    return (
      <div className="px-2 py-1" data-thread-wrapper={labelId}>
        No messages yet.
      </div>
    );
  }

  return (
    <div className="w-full" data-thread-wrapper={labelId}>
      {allRows.map((thread, index) => {
        return (
          <ThreadContextMenu
            key={JSON.stringify(thread)}
            thread={thread}
            refetch={async () => {
              await refetch();
            }}
          >
            <button
              data-thread-item={getDataThreadItem(labelId, index)}
              onFocus={() => {
                startTransition(() => {
                  setActiveThread(thread);
                });
              }}
              onClick={onClickThread(thread)}
              className={cn(
                "flex h-9 w-full items-center px-2",
                "truncate hover:bg-secondary",
                isThreadUnread(thread) && "font-bold",
              )}
            >
              {thread?.subject}
            </button>
          </ThreadContextMenu>
        );
      })}
      {hasNextPage && (
        <Button
          data-thread-item={getDataThreadItem(labelId, allRows.length)}
          onClick={onClickLoadMore}
          variant={"ghost"}
          className="flex h-10 w-full justify-center"
        >
          Load more
        </Button>
      )}
    </div>
  );
}
