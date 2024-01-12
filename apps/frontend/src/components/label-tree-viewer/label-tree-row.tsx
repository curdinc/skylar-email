import { memo, Suspense } from "react";

import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import type { LabelTreeViewerRowType } from "~/lib/store/label-tree-viewer";
import { useToggleLabel } from "~/lib/store/label-tree-viewer/toggle-label";
import { useViewMoreLabelItem } from "~/lib/store/label-tree-viewer/view-more-label-item";
import { cn } from "~/lib/ui";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { LabelItem } from "./label-item";
import type { RowStateType } from "./types";

const LabelTreeRowBase = ({
  row,
  index,
  translateY,
  rowState,
}: {
  row?: LabelTreeViewerRowType;
  index: number;
  translateY: number;
  rowState: RowStateType;
}) => {
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const toggleLabel = useToggleLabel();
  const viewMoreLabelItem = useViewMoreLabelItem();

  const onClickLabel = () => {
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
          "hover:border-l-4",
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
    return (
      <Suspense
        fallback={
          <div
            className={cn("absolute inset-0 h-9 p-1")}
            style={{
              transform: `translateY(${translateY}px)`,
            }}
          >
            <Skeleton className={cn("h-8 w-full")} />
          </div>
        }
      >
        <LabelItem index={index} translateY={translateY} rowState={rowState} />
      </Suspense>
    );
  }
};

export const LabelTreeRow = memo(LabelTreeRowBase);
