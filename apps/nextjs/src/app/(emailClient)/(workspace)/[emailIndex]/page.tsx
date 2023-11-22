"use client";

import { Allotment } from "allotment";

import { useGlobalStore } from "@skylar/logic";

import { EmailThreadPage } from "./[threadId]/page";
import { EmailListViewer } from "./email-list-viewer";
import { ReplyEmail } from "./reply-email";

const MIN_PANE_SIZE = 250;

export default function Inbox() {
  const respondingThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingThread,
  );

  return (
    <Allotment minSize={MIN_PANE_SIZE} defaultSizes={[100, 200]}>
      <Allotment.Pane snap>
        <EmailListViewer />
      </Allotment.Pane>
      <Allotment.Pane>
        <Allotment vertical>
          <div className="h-full overflow-auto">
            <EmailThreadPage />
          </div>
          {respondingThread && <ReplyEmail />}
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  );
}
