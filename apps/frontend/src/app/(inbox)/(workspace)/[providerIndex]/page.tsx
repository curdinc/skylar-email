"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Allotment } from "allotment";

import { useGlobalStore } from "@skylar/logic";

import { LabelTreeViewer } from "~/components/label-tree-viewer/label-tree-viewer";
import { ThreadViewer } from "~/components/thread-viewer/index";

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
        <LabelTreeViewer />
      </Allotment.Pane>
      <Allotment.Pane>
        <Allotment vertical>
          <div className="h-full overflow-auto">
            {/* Single Thread viewer */}
            <Suspense fallback={<div>Loading thread</div>}>
              <ThreadViewer />
            </Suspense>
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
