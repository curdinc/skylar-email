import { useTransition } from "react";

import { isThreadUnread } from "@skylar/client-db";

import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import {
  useActiveItemIndex,
  useRowSuspense,
} from "~/lib/store/label-tree-viewer/active-item";
import { cn } from "~/lib/ui";
import { ThreadContextMenu } from "../tooklit/components/context-menu";
import type { RowStateType } from "./types";

export const LabelItem = ({
  index,
  translateY,
  rowState,
}: {
  index: number;
  translateY: number;
  rowState: RowStateType;
}) => {
  const [, startTransition] = useTransition();
  const [, setActiveItemIndex] = useActiveItemIndex();
  const row = useRowSuspense(index);

  const onClickThread = () => {
    captureEvent({
      event: TrackingEvents.threadOpened,
      properties: {},
    });

    startTransition(() => setActiveItemIndex(index));
  };

  if (row?.type !== "labelItem") {
    return;
  }
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
        <div className={cn("truncate", isThreadUnread(thread) && "font-bold")}>
          {thread?.subject}
        </div>
      </button>
    </ThreadContextMenu>
  );
};
