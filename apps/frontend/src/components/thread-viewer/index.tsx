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
    <div className="w-full @container ">
      <div className="min-h-12 sticky top-0 z-10 flex items-center border-b bg-background p-2 font-heading font-semibold tracking-tighter text-foreground @sm:p-3 @sm:text-lg @md:p-5 @md:text-xl">
        {thread?.[0]?.subject}
      </div>
      <div className="grid gap-3 p-2 @sm:p-3 @md:p-5">{MessageList}</div>
    </div>
  );
}
