"use client";

import { Button } from "~/components/ui/button";
import { usePartialSync } from "~/lib/email-provider/gmail/use-partial-sync";
import { useSendEmail } from "~/lib/email-provider/gmail/use-send-mail";

export default function ImportantInbox() {
  const startHistoryId = "1626097";
  const { fetch: partialSync, isFetching: isFetchingPartialSync } =
    usePartialSync(startHistoryId);
  const { sendEmail, isSendingEmail } = useSendEmail();

  return (
    <div className="grid gap-3">
      <Button
        className="ml-10"
        onClick={() => {
          partialSync("hansbhatia0342@gmail.com").catch((err) =>
            console.log("err", err),
          );
        }}
        isLoading={isFetchingPartialSync}
      >
        Partial-sync
      </Button>
      <Button
        className="ml-10"
        onClick={async () => {
          await sendEmail({
            emailAddress: "hansbhatia0342@gmail.com",
            emailConfig: {
              from: { email: "hansbhatia0342@gmail.com", name: "Your boy HB" },
              to: ["bboygraffity2002@gmail.com"],
              subject: "hi",
              text: "lemon",
              html: "<div>Hi Matey </div>",
              attachments: [],
            },
          });
        }}
        disabled={isSendingEmail}
      >
        Compose email
      </Button>
      {/* {ThreadList} */}
    </div>
  );
}
