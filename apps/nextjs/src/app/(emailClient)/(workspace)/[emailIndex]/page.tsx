"use client";

import { Allotment } from "allotment";

import "allotment/dist/style.css";

import { EmailListViewer } from "./email-list-viewer";

const MIN_PANE_SIZE = 250;

export default function Inbox() {
  return (
    <>
      <Allotment minSize={MIN_PANE_SIZE}>
        <Allotment.Pane snap>
          <EmailListViewer />
        </Allotment.Pane>
        <Allotment.Pane>
          <div>hellow world</div>
        </Allotment.Pane>
      </Allotment>
    </>
  );
}
