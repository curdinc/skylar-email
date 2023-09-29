"use client";

import { RawHtmlDisplay } from "~/components/ui/raw-html-display";
import { cn } from "~/lib/ui";
import { useThreadPage } from "./use-thread-page";

export default function ImportantInbox() {
  const { emailThread, isLoadingThread } = useThreadPage();

  if (isLoadingThread) {
    return <div>Loading...</div>;
  }
  const EmailList = emailThread?.map((email) => {
    return (
      <div
        key={email.rfc822_message_id}
        className={cn("grid grid-cols-1 gap-1 px-1 py-1 md:px-2")}
      >
        <div className="flex w-full flex-col md:flex-row md:items-baseline md:gap-2">
          <div className="min-w-0 truncate text-base font-semibold md:text-lg">
            {email.subject}
          </div>
          <div className="min-w-fit text-xs text-muted-foreground md:text-sm">
            {email.from.name ?? email.from.email}
          </div>
        </div>
        <RawHtmlDisplay
          className={cn(!email.content_html && "whitespace-pre-wrap")}
          html={email.content_html ? email.content_html : email.content_text}
        />
      </div>
    );
  });
  return <div className="grid gap-5 p-1 md:gap-6">{EmailList}</div>;
}
