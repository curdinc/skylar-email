"use client";

import { Allotment } from "allotment";

import "allotment/dist/style.css";

import { useState } from "react";

import { Button } from "~/components/ui/button";

const MIN_PANE_SIZE = 250;

export default function Inbox() {
  const labels = ["Inbox", "Important", "Sent", "Drafts", "Trash"];
  const [openLabels, setOpenLabels] = useState(labels);

  // TODO: make this work
  const onClickClose = (index: number) => () => {
    const newOpenLabels = [...openLabels];
    newOpenLabels.splice(index, 1);
    setOpenLabels(newOpenLabels);
  };

  
  return (
    <Allotment minSize={MIN_PANE_SIZE}>
      <Allotment.Pane snap>
        <Allotment vertical>
          {labels.map((label, index) => {
            if (!openLabels.includes(label)) {
              return <div key={label}>{label}</div>;
            }
            return (
              <Allotment.Pane key={label}>
                <div className="flex justify-between">
                  {label} <Button onClick={onClickClose(index)}>Close</Button>
                </div>
                <div>Content here</div>
              </Allotment.Pane>
            );
          })}
        </Allotment>
      </Allotment.Pane>
      <Allotment.Pane>
        <div>hellow world</div>
      </Allotment.Pane>
    </Allotment>
  );
}
