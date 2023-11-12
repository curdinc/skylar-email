import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInView } from "react-intersection-observer";

import { useThreadSnippetsInfinite } from "@skylar/client-db";
import { setActiveThreadId } from "@skylar/logic";

export function EmailList({
  filters,
  uniqueListId,
}: Pick<Parameters<typeof useThreadSnippetsInfinite>[0], "filters"> & {
  uniqueListId: string;
}) {
  const { status, data, error, fetchNextPage, hasNextPage } =
    useThreadSnippetsInfinite({
      userEmails: ["curdcorp@gmail.com"],
      filters,
      limit: 15,
      uid: uniqueListId,
    });
  const allRows = data ? data.pages.flat() : [];

  const onClickThread = (threadId: string) => {
    return () => {
      setActiveThreadId(threadId);
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
                <button
                  key={virtualRow.index}
                  onClick={onClickThread(thread.email_provider_thread_id)}
                  className="absolute left-0 top-0 flex w-full justify-start"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {thread?.subject}
                </button>
              );
            })}
            {hasNextPage && (
              <button
                ref={hasNextPageInViewRef}
                onClick={onClickLoadMore}
                className="absolute bottom-0 left-0 h-[50px]"
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
