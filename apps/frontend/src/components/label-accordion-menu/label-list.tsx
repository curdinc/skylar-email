"use client";

import { startTransition, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { isThreadUnread, useThreadSnippetsInfinite } from "@skylar/client-db";
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
export function LabelList({
  filters,
  uniqueListId,
  dataItemLabel,
}: Pick<Parameters<typeof useThreadSnippetsInfinite>[0], "filters"> & {
  uniqueListId: string;
  dataItemLabel: string;
}) {
  const { data: activeEmailAddress } = useActiveEmailAddress();

  const { status, data, error, fetchNextPage, hasNextPage, refetch } =
    useThreadSnippetsInfinite({
      userEmails: activeEmailAddress ? [activeEmailAddress] : [],
      filters,
      limit: 25,
      uid: uniqueListId,
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

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 3,
    paddingEnd: hasNextPage ? 40 : undefined,
  });

  const onClickLoadMore = () => {
    const keepCurrentFocus = document.querySelector(
      `[${DATA_THREAD_ITEM}=${getDataThreadItem(
        dataItemLabel,
        allRows.length - 1,
      )}]`,
    );
    (keepCurrentFocus as HTMLElement | undefined)?.focus();
    fetchNextPage().catch((e) => {
      console.error("Something went wrong fetching emails", e);
    });
  };

  if (status === "pending") {
    return (
      <div className="px-2 py-1" data-thread-wrapper={dataItemLabel}>
        Loading...
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="px-2 py-1" data-thread-wrapper={dataItemLabel}>
        Error: {error.message}
      </div>
    );
  }

  if (!allRows.length) {
    return (
      <div className="px-2 py-1" data-thread-wrapper={dataItemLabel}>
        No messages yet.
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      style={{
        height: rowVirtualizer.getTotalSize(),
      }}
      className="relative h-full w-full"
      data-thread-wrapper={dataItemLabel}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const thread = allRows[virtualRow.index];
        if (!thread) {
          return null;
        }
        return (
          <ThreadContextMenu
            key={JSON.stringify(thread)}
            thread={thread}
            refetch={async () => {
              await refetch();
            }}
          >
            <button
              data-thread-item={getDataThreadItem(
                dataItemLabel,
                virtualRow.index,
              )}
              key={virtualRow.index}
              onFocus={() => {
                startTransition(() => {
                  setActiveThread(thread);
                });
              }}
              onClick={onClickThread(thread)}
              className={cn(
                "absolute left-1 top-0 flex w-full items-center justify-start px-2",
                "min-w-0 truncate hover:bg-secondary",
                isThreadUnread(thread) && "font-bold",
              )}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {thread?.subject}
            </button>
          </ThreadContextMenu>
        );
      })}
      {hasNextPage && (
        <Button
          data-thread-item={getDataThreadItem(dataItemLabel, allRows.length)}
          onClick={onClickLoadMore}
          variant={"ghost"}
          className="absolute bottom-0 left-0 flex h-10 w-full justify-center"
        >
          Load more
        </Button>
      )}
    </div>
  );
}
