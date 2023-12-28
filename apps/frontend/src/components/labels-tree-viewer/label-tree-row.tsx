import { startTransition } from "react";

import { isThreadUnread } from "@skylar/client-db";
import { setActiveThread } from "@skylar/logic";
import type { ThreadType } from "@skylar/parsers-and-types";

import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import type { LabelTreeViewerRowType } from "~/lib/store/labels-tree-viewer";
import {
  useToggleLabel,
  useViewMoreLabelItem,
} from "~/lib/store/labels-tree-viewer";
import { cn } from "~/lib/ui";
import { Icons } from "../icons";
import { ThreadContextMenu } from "../tooklit/components/context-menu";
import { Button } from "../ui/button";
import { getDataThreadItem } from "./label-accordion-keyboard-navigation/helpers";

export const LabelTreeRow = ({
  row,
  index,
  translateY,
}: {
  row?: LabelTreeViewerRowType;
  index: number;
  translateY: number;
}) => {
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const toggleLabel = useToggleLabel();
  const viewMoreLabelItem = useViewMoreLabelItem();

  const onClickThread = (thread: ThreadType) => {
    return () => {
      captureEvent({
        event: TrackingEvents.threadOpened,
        properties: {},
      });

      setActiveThread(thread);
    };
  };

  if (!row || !activeEmailAddress) {
    return;
  }
  if (row.type === "label") {
    return (
      <button
        data-label-item={row.id}
        className={cn(
          "flex h-8 items-center gap-1 border-b bg-background px-2 shadow-md",
          "absolute inset-0",
          row.state === "open" && "bg-secondary",
        )}
        onClick={() => {
          toggleLabel({
            labelIdToToggle: row.id,
            userEmailAddress: activeEmailAddress,
          });
        }}
        style={{
          transform: `translateY(${translateY}px)`,
        }}
      >
        <Icons.chevronRight
          className={cn(
            "w-4 shrink-0 transition-transform",
            row.state === "open" && "rotate-90 transform ",
          )}
        />{" "}
        <div className="truncate text-sm">{row.displayValue}</div>
      </button>
    );
  }
  if (row.type === "labelItemInfo") {
    return (
      <div
        className={cn("h-9 py-1 text-center text-sm", "absolute inset-0")}
        style={{
          transform: `translateY(${translateY}px)`,
        }}
        data-thread-wrapper={row.parentId}
      >
        {row.displayValue}
      </div>
    );
  }
  if (row.type === "labelItemViewMore") {
    return (
      <Button
        variant={"ghost"}
        className={cn("h-9 py-1 text-center text-sm", "absolute inset-0")}
        style={{
          transform: `translateY(${translateY}px)`,
        }}
        data-thread-wrapper={row.parentId}
        onClick={() =>
          viewMoreLabelItem({
            labelIdToViewMore: row.parentId,
            userEmailAddress: activeEmailAddress,
          })
        }
      >
        {row.displayValue}
      </Button>
    );
  }
  if (row.type === "labelItem") {
    const { thread } = row;
    return (
      <ThreadContextMenu
        thread={thread}
        refetch={async () => {
          // await threadListData.refetch();
        }}
      >
        <button
          data-thread-item={getDataThreadItem(row.parentId, index)}
          onFocus={() => {
            startTransition(() => {
              setActiveThread(thread);
            });
          }}
          onClick={onClickThread(thread)}
          className={cn(
            "flex h-9 items-center pl-6",
            "hover:bg-secondary",
            "absolute inset-0",
          )}
          style={{
            transform: `translateY(${translateY}px)`,
          }}
        >
          <div
            className={cn("truncate", isThreadUnread(thread) && "font-bold")}
          >
            {thread?.subject}
          </div>
        </button>
      </ThreadContextMenu>
    );
  }
};
