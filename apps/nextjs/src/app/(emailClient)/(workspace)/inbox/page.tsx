"use client";

import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const { isLoadingThreads, threads } = useInboxPage();
  console.log("isLoadingThreads,threads", isLoadingThreads, threads);

  if (isLoadingThreads) {
    return <div>Loading...</div>;
  }
  const ThreadList = threads?.map((thread) => {
    return (
      <div key={thread.email_provider_thread_id}>{thread.latest_snippet}</div>
    );
  });
  return <div className="grid gap-3">{ThreadList}</div>;
}
