"use client";

import { Button } from "~/components/ui/button";
import { useFullSync } from "~/lib/email-provider/gmail/sync";
import { useInboxPage } from "./use-inbox-page";

export default function ImportantInbox() {
  const { fetch: fetchAccessToken, isFetching } = useFullSync();
  useInboxPage();

  return (
    <div>
      <div>ImportantInbox</div>
      <Button
        onClick={() => {
          fetchAccessToken().catch((err) => console.log("err", err));
        }}
        isLoading={isFetching}
      >
        Full-sync
      </Button>
    </div>
  );
}
