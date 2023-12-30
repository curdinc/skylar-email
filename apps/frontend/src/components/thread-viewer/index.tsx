"use client";

import { MessageViewer } from "../message-viewer";
import { useThreadViewer } from "./use-thread-viewer";

export function ThreadViewer() {
  const { thread, isLoadingThread } = useThreadViewer();

  if (isLoadingThread) {
    return <div>Loading...</div>;
  }
  if (thread?.length === 0) {
    return;
  }
  const MessageList = thread?.map((message, index) => {
    return (
      <MessageViewer
        key={`${message.rfc822_message_id}-${index}`}
        message={message}
      />
    );
  });

  return (
    <div className="@container w-full ">
      <div className="@sm:text-lg @md:text-xl @sm:p-3 @md:p-5 sticky top-0 flex h-12 items-center border-b bg-background p-2 font-heading font-bold tracking-tighter text-foreground">
        {thread?.[0]?.subject}
      </div>
      <div className="@sm:p-3 @md:p-5 grid gap-3 p-2">{MessageList}</div>
    </div>
  );
}
