"use client";

import dynamic from "next/dynamic";
import { Allotment } from "allotment";

import { useGlobalStore } from "@skylar/logic";

import { EmptyLabelItemScreen } from "~/components/empty-label-item-screen";
import { LabelTreeViewer } from "~/components/label-tree-viewer/label-tree-viewer";
import { ThreadViewer } from "~/components/thread-viewer/index";
import { useActiveItemRow } from "~/lib/store/label-tree-viewer/active-item";

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
  const [activeItemRow] = useActiveItemRow();
  const Viewer =
    activeItemRow?.type === "labelItem" ? (
      <ThreadViewer />
    ) : (
      <EmptyLabelItemScreen />
    );

  return (
    <Allotment minSize={MIN_PANE_SIZE} defaultSizes={[100, 200]}>
      <Allotment.Pane snap>
        <LabelTreeViewer />
      </Allotment.Pane>
      <Allotment.Pane>
        <Allotment vertical>
          <div className="h-full overflow-auto">{Viewer}</div>
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
