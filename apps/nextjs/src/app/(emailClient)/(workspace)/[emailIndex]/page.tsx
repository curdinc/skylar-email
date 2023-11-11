"use client";

import { Allotment } from "allotment";

import "allotment/dist/style.css";

const MIN_PANE_SIZE = 250;
export default function Inbox() {
  const labels = ["Inbox", "Important", "Sent", "Drafts", "Trash"];
  return (
    <Allotment className="h-100vh">
      <Allotment.Pane minSize={MIN_PANE_SIZE} snap>
        <Allotment vertical>
          {labels.map((label) => {
            return (
              <Allotment.Pane key={label}>
                <div>{label}</div>
              </Allotment.Pane>
            );
          })}
        </Allotment>
      </Allotment.Pane>
      <Allotment.Pane minSize={MIN_PANE_SIZE}>
        <div>hellow world</div>
      </Allotment.Pane>
    </Allotment>
  );
}
