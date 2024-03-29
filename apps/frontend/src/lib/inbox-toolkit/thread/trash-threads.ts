import type { ThreadType } from "@skylar/parsers-and-types";
import { EMAIL_PROVIDER_LABELS } from "@skylar/parsers-and-types";

import { modifyThreadLabels } from "./utils";

export const trashThreads = async ({
  emailAddress,
  threads,
}: {
  threads: ThreadType[];
  emailAddress: string;
}) =>
  modifyThreadLabels({
    threads,
    emailAddress,
    labelsToAdd: Array(threads.length).fill([
      EMAIL_PROVIDER_LABELS.GMAIL.TRASH,
    ]),
    labelsToRemove: Array(threads.length).fill([
      EMAIL_PROVIDER_LABELS.GMAIL.INBOX,
    ]),
  });
