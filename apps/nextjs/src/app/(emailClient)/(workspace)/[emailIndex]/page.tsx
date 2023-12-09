"use client";

import dynamic from "next/dynamic";
import { Allotment } from "allotment";

import { useGlobalStore } from "@skylar/logic";

import { EmailThreadPage } from "./[threadId]/page";
import { EmailListViewer } from "./email-list-viewer";

const MIN_PANE_SIZE = 250;

const MessageComposer = dynamic(
  async () => {
    const { MessageComposer } = await import(
      "~/components/compose-message/message-composer"
    );
    return MessageComposer;
  },
  { ssr: false },
);

export default function Inbox() {
  const messageType = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.messageType,
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
          {messageType !== "none" && (
            <div className="h-full overflow-auto">
              <MessageComposer />
            </div>
          )}
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  );
}
