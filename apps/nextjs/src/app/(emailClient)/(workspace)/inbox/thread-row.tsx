import Link from "next/link";

import type { ThreadType } from "@skylar/client-db/schema/thread";

import { buttonVariants } from "~/components/ui/button";
import { RawHtmlDisplay } from "~/components/ui/raw-html-display";
import { cn } from "~/lib/ui";

export function ThreadRow({ thread }: { thread: ThreadType }) {
  const dateUpdated = new Date(thread.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return (
    <Link
      href={`/inbox/${thread.email_provider_thread_id}`}
      key={thread.email_provider_thread_id}
      className={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "grid h-fit grid-cols-1 gap-1 px-1 py-1 sm:px-2",
      )}
    >
      <div className="flex w-full items-baseline justify-between">
        <div className="flex w-full min-w-0 flex-col pr-3 md:flex-row md:items-baseline md:gap-2">
          <div className="min-w-0 truncate text-base font-semibold md:text-lg">
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
  return (
    <div
      className={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "grid h-16 grid-cols-1 gap-1 px-1 py-1 md:px-2",
      )}
    >
      <div className="flex w-full flex-col md:flex-row md:items-baseline md:gap-2">
        <div className="min-w-0 truncate text-base font-semibold md:text-lg">
          <div className="h-5 w-1/2 animate-pulse rounded-md bg-gray-200"></div>
        </div>
        <div className="min-w-fit text-xs text-muted-foreground md:text-sm">
          <div className="h-5 w-1/4 animate-pulse rounded-md bg-gray-200"></div>
        </div>
      </div>
      <div className="truncate text-sm text-muted-foreground">
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
      </div>
    </div>
  );
}
