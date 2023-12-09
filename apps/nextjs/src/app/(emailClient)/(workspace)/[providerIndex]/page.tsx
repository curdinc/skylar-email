"use client";

import { Allotment } from "allotment";

import { useGlobalStore } from "@skylar/logic";

import { MessageComposer } from "~/components/compose-message/message-composer";
import { EmailThreadPage } from "./[threadId]/page";
import { EmailListViewer } from "./email-list-viewer";

const MIN_PANE_SIZE = 250;

export default function Inbox() {
  const messageType = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.messageType,
  );

  return (
    <Allotment minSize={MIN_PANE_SIZE} defaultSizes={[100, 200]}>
      <Allotment.Pane snap>
        {/* Label list viewer */}
        <EmailListViewer />
      </Allotment.Pane>
      <Allotment.Pane>
        <Allotment vertical>
          <div className="h-full overflow-auto">
            {/* Single Thread viewer */}
            <EmailThreadPage />
          </div>
          {messageType !== "none" && (
            <div className="h-full overflow-auto">
              {/* Message composer */}
              <MessageComposer />
            </div>
          )}
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  );
}
