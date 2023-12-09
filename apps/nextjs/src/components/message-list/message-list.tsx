import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";

import { isThreadUnread, useThreadSnippetsInfinite } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { setActiveThread, useGlobalStore } from "@skylar/logic";

import { ThreadContextMenu } from "~/components/tooklit/components/context-menu";
import { cn } from "~/lib/ui";

/**
 *
 * @param {string} uniqueListId: The unique id of the list
 * @returns The component that renders all the messages of a user for a given set of filter
 */
export function MessageList({
  filters,
  uniqueListId,
}: Pick<Parameters<typeof useThreadSnippetsInfinite>[0], "filters"> & {
  uniqueListId: string;
}) {
  const activeEmailAddress = useGlobalStore(
    (state) => state.EMAIL_CLIENT.activeEmailAddress,
  );
  const { status, data, error, fetchNextPage, hasNextPage, refetch } =
    useThreadSnippetsInfinite({
      userEmails: activeEmailAddress ? [activeEmailAddress] : [],
      filters,
      limit: 15,
      uid: uniqueListId,
    });
  const allRows = data ? data.pages.flat() : [];

  const onClickThread = (thread: ThreadType) => {
    return () => {
      setActiveThread(thread);
    };
  };

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 3,
    paddingEnd: hasNextPage ? 50 : undefined,
  });

  const { ref: hasNextPageInViewRef, inView: hasNextPageInView } = useInView();
  const onClickLoadMore = () => {
    fetchNextPage().catch((e) => {
      console.error("Something went wrong fetching emails", e);
    });
  };
  useEffect(() => {
    if (hasNextPageInView) {
      fetchNextPage().catch((e) => {
        console.error("Something went wrong fetching emails", e);
      });
    }
  }, [fetchNextPage, hasNextPageInView]);
  return (
    <div>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <div ref={parentRef} className="h-full w-full">
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
            }}
            className="relative w-full"
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
                    key={virtualRow.index}
                    onClick={onClickThread(thread)}
                    className={cn(
                      "absolute left-0 top-0 flex w-full items-center justify-start px-2",
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
              <button
                ref={hasNextPageInViewRef}
                onClick={onClickLoadMore}
                className="absolute bottom-0 left-0 flex h-[50px] justify-start"
              >
                Load more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
