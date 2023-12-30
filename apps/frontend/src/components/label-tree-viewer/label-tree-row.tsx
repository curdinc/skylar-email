import { memo, useTransition } from "react";

import { isThreadUnread } from "@skylar/client-db";

import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import type { LabelTreeViewerRowType } from "~/lib/store/label-tree-viewer";
import { useActiveItemIndex } from "~/lib/store/label-tree-viewer/active-item";
import { useToggleLabel } from "~/lib/store/label-tree-viewer/toggle-label";
import { useViewMoreLabelItem } from "~/lib/store/label-tree-viewer/view-more-label-item";
import { cn } from "~/lib/ui";
import { Icons } from "../icons";
import { ThreadContextMenu } from "../tooklit/components/context-menu";
import { Button } from "../ui/button";

const LabelTreeRowBase = ({
  row,
  index,
  translateY,
  rowState,
}: {
  row?: LabelTreeViewerRowType;
  index: number;
  translateY: number;
  rowState: "active" | "selective" | "inactive";
}) => {
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const toggleLabel = useToggleLabel();
  const viewMoreLabelItem = useViewMoreLabelItem();
  const [, startTransition] = useTransition();
  const [, setActiveItemIndex] = useActiveItemIndex();

  const onClickThread = () => {
    captureEvent({
      event: TrackingEvents.threadOpened,
      properties: {},
    });

    startTransition(() => setActiveItemIndex(index));
  };
  const onClickLabel = () => {
    startTransition(() => setActiveItemIndex(index));
    toggleLabel({
      labelIdToToggle: row?.id ?? "",
      userEmailAddress: activeEmailAddress ?? "",
    });
  };

  if (!row || !activeEmailAddress) {
    return;
  }
  if (row.type === "label") {
    return (
      <button
        data-label-item={row.id}
        className={cn(
          "flex h-8 items-center gap-1 border-t bg-background px-2",
          "absolute inset-0",
          row.state === "open" && "shadow-md",
          rowState === "active" && "bg-secondary",
        )}
        onClick={onClickLabel}
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
        className={cn(
          "h-9 py-1 text-center text-sm",
          "absolute inset-0",
          rowState === "active" && "bg-secondary",
        )}
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
        className={cn(
          "h-9 py-1 text-center text-sm",
          "absolute inset-0",
          rowState === "active" && "bg-secondary",
        )}
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
          data-thread-item={`${row.parentId}-${index}`}
          onClick={onClickThread}
          className={cn(
            "flex h-9 items-center pl-6",
            "hover:bg-secondary",
            "absolute inset-0",
            rowState === "active" && "bg-secondary",
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

export const LabelTreeRow = memo(LabelTreeRowBase);
