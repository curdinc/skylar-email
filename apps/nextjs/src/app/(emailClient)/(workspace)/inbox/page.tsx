"use client";

import Link from "next/link";

import { Button, buttonVariants } from "~/components/ui/button";
import { RawHtmlDisplay } from "~/components/ui/raw-html-display";
import { cn } from "~/lib/ui";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const { isLoadingThreads, threads, nextPage, prevPage } = useInboxPage();

  if (isLoadingThreads) {
    return <div>Loading...</div>;
  }
  const ThreadList = threads?.map((thread) => {
    return (
      <Link
        href={`/inbox/${thread.email_provider_thread_id}`}
        key={thread.email_provider_thread_id}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "grid h-16 grid-cols-1 gap-1 px-1 py-1 md:px-2",
        )}
      >
        <div className="flex w-full flex-col md:flex-row md:items-baseline md:gap-2">
          <div className="min-w-0 truncate text-base font-semibold md:text-lg">
            {thread.subject}
          </div>
          <div className="min-w-fit text-xs text-muted-foreground md:text-sm">
            {thread.from.slice(-1)[0]}
          </div>
        </div>
        <RawHtmlDisplay
          className="truncate text-sm text-muted-foreground"
          html={thread.latest_snippet_html}
        />
      </Link>
    );
  });
  return (
    <div className="grid grid-cols-1 gap-5 p-1 md:gap-6">
      {ThreadList}
      <div className="flex justify-between">
        <Button variant={"secondary"} onClick={prevPage}>
          Prev
        </Button>
        <Button variant={"secondary"} onClick={nextPage}>
          Next
        </Button>
      </div>
    </div>
  );
}
