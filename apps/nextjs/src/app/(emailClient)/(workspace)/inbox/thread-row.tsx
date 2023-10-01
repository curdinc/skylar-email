import Link from "next/link";

import type { ThreadType } from "@skylar/client-db/schema/thread";

import { buttonVariants } from "~/components/ui/button";
import { RawHtmlDisplay } from "~/components/ui/raw-html-display";
import { Skeleton } from "~/components/ui/skeleton";
import { formatTimeToMMMDD } from "~/lib/email";
import { cn } from "~/lib/ui";

export function ThreadRow({
  thread,
  isRead,
}: {
  thread: ThreadType;
  isRead: boolean;
}) {
  const dateUpdated = formatTimeToMMMDD(thread.updated_at);

  return (
    <Link
      href={`/inbox/${thread.email_provider_thread_id}`}
      key={thread.email_provider_thread_id}
      className={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "grid h-fit grid-cols-1 gap-1 border-b px-1 pb-3 pt-1  sm:px-2",
      )}
    >
      <div className="flex w-full items-baseline justify-between">
        <div className="flex w-full min-w-0 flex-col pr-3 md:flex-row md:items-baseline md:gap-2">
          <div
            className={cn(
              "min-w-0 truncate text-base sm:text-lg",
              isRead ? "font-normal" : "font-semibold",
            )}
          >
            {thread.subject}
          </div>
          <div className="min-w-fit text-xs text-muted-foreground md:text-sm">
            {thread.from.slice(-1)[0]}
          </div>
        </div>
        <div className="min-w-fit text-xs text-muted-foreground">
          {dateUpdated}
        </div>
      </div>
      <RawHtmlDisplay
        className="truncate text-sm text-muted-foreground"
        html={thread.latest_snippet_html}
      />
    </Link>
  );
}

export function ThreadRowLoading() {
  return <Skeleton className="h-[80.67px] sm:h-[68.67px]" />;
}
