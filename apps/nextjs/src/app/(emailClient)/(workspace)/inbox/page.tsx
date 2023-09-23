"use client";

import { Button } from "~/components/ui/button";
import { useFullSync } from "~/lib/email-provider/gmail/sync";

export default function ImportantInbox() {
  const { fetch: fetchAccessToken, isFetching } = useFullSync();

  return (
    <div>
      <Button
        onClick={() => {
          fetchAccessToken().catch((err) => console.log("err", err));
        }}
        isLoading={isFetching}
      >
        lime
      </Button>
    </div>
  );
}
