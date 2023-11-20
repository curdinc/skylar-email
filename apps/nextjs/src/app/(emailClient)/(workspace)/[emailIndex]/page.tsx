"use client";

import { Allotment } from "allotment";

import { EmailThreadPage } from "./[threadId]/page";
import { EmailListViewer } from "./email-list-viewer";

const MIN_PANE_SIZE = 250;

export default function Inbox() {
  return (
    <Allotment minSize={MIN_PANE_SIZE} defaultSizes={[100, 200]}>
      <Allotment.Pane snap>
        <EmailListViewer />
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="h-full overflow-auto">
          <EmailThreadPage />
        </div>
      </Allotment.Pane>
    </Allotment>
  );
}
