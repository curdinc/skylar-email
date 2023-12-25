"use client";

import { startTransition, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { isThreadUnread } from "@skylar/client-db";
import { setActiveThread, useGlobalStore } from "@skylar/logic";

import { useLogger } from "~/lib/logger";
import { useNavigateMessagesKeymap } from "~/lib/shortcuts/keymap-hooks";
import { cn } from "~/lib/ui";
import { Icons } from "../icons";
import { ThreadContextMenu } from "../tooklit/components/context-menu";
import { getDataThreadItem } from "./label-accordion-keyboard-navigation/helpers";
import { useLabelAccordion } from "./use-label-accordion";

/**
 * @returns The component that renders all the labels of a user and the corresponding messages
 */
export const LabelAccordion = () => {
  const logger = useLogger();
  useNavigateMessagesKeymap();
  const {
    listItemCount,
    labelListRenderData,
    onClickThread,
    onClickLabel,
    onClickViewMore,
  } = useLabelAccordion();
  const activeThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.activeThread,
  );
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: listItemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 8,
  });

  if (!labelListRenderData) {
    return <div>Loading ...</div>;
  }

  if (!labelListRenderData.length) {
    logger.warn("Done loading but no labels found");
    return <div>No labels found</div>;
  }

  return (
    <div
      ref={parentRef}
      style={{
        contain: "strict",
      }}
      className=" h-full w-full overflow-y-auto"
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
        }}
        className="relative w-full"
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const data = labelListRenderData?.[virtualRow.index];

          if (data?.type === "label") {
            return (
              <button
                key={virtualRow.key}
                data-index={virtualRow.index}
                data-label-item={data.id}
                className={cn(
                  "absolute inset-0 flex items-center gap-1 px-2  transition-colors",
                  data.state === "open" && "bg-secondary",
                )}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={onClickLabel(data.id)}
              >
                <Icons.chevronRight
                  className={cn(
                    "w-4 shrink-0 transition-transform",
                    data.state === "open" && "rotate-90",
                  )}
                />
                <div className="flex-grow truncate text-start text-sm">
                  {data.displayValue}
                </div>
              </button>
            );
          } else if (data?.type === "labelItemInfo") {
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={"absolute inset-0"}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {data?.displayValue}
              </div>
            );
          } else if (data?.type === "labelItemViewMore") {
            return (
              <button
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={"absolute inset-0"}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={onClickViewMore(data.id)}
              >
                Load More
              </button>
            );
          } else if (data?.type === "labelItem") {
            const { thread } = data;
            return (
              <ThreadContextMenu
                key={virtualRow.key}
                thread={thread}
                refetch={async () => {
                  // await refetch();
                }}
              >
                <button
                  data-index={virtualRow.index}
                  data-thread-item={getDataThreadItem("", virtualRow.index)}
                  onFocus={() => {
                    startTransition(() => {
                      setActiveThread(thread);
                    });
                  }}
                  onClick={onClickThread(thread)}
                  className={cn(
                    "absolute inset-0 flex items-center justify-start pl-6 pr-2",
                    "hover:bg-secondary",
                    isThreadUnread(thread) && "font-bold",
                    activeThread?.provider_thread_id ===
                      thread.provider_thread_id && "bg-secondary",
                  )}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <span className="truncate">{thread?.subject}</span>
                </button>
              </ThreadContextMenu>
            );
          }
          throw new Error("Unknown data type");
        })}
      </div>
    </div>
  );
};
