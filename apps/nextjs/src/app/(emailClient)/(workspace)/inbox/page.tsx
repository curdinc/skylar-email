"use client";

import { Button } from "~/components/ui/button";
import { RawHtmlDisplay } from "~/components/ui/raw-html-display";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const { isLoadingThreads, threads, nextPage, prevPage } = useInboxPage();

  if (isLoadingThreads) {
    return <div>Loading...</div>;
  }
  const ThreadList = threads?.map((thread) => {
    return (
      <div
        key={thread.email_provider_thread_id}
        className="grid grid-cols-1 gap-1"
      >
        <div className="flex w-full flex-col md:flex-row md:items-baseline md:gap-2">
          <div className="min-w-0 truncate font-semibold">{thread.subject}</div>
          <div className="min-w-fit text-xs text-muted-foreground md:text-sm">
            {thread.from.slice(-1)[0]}
          </div>
        </div>
        <RawHtmlDisplay
          className="truncate text-sm text-muted-foreground"
          html={thread.latest_snippet_html}
        />
      </div>
    );
  });
  return (
    <div className="grid grid-cols-1 gap-6">
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
