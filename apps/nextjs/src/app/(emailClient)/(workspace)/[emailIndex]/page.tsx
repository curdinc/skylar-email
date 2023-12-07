"use client";

import { useParams } from "next/navigation";
import { Allotment } from "allotment";

import {
  setActiveEmailAddress,
  useActiveEmailProviders,
  useGlobalStore,
} from "@skylar/logic";

import { MessageComposer } from "~/components/compose-message/message-composer";
import { EmailThreadPage } from "./[threadId]/page";
import { EmailListViewer } from "./email-list-viewer";

const MIN_PANE_SIZE = 250;

export default function Inbox() {
  const { emailIndex } = useParams();
  const providers = useActiveEmailProviders();
  setActiveEmailAddress(
    providers.find((p) => p.provider_id?.toString() === (emailIndex as string))
      ?.email,
  );

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
