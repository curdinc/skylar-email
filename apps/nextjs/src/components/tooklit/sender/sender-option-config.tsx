import type { ConfigOption, GetThreads } from "../config-option-type";
import { getThreadActions } from "../thread/thread-option-config";

export const getSenderActions = ({
  activeEmail,
  afterClientDbUpdate,
  getThreads,
}: {
  getThreads: GetThreads;
  activeEmail: string;
  afterClientDbUpdate: (() => Promise<void>)[];
}) => {
  const INBOX_TOOLKIT_THREAD_ACTIONS = getThreadActions(
    getThreads,
    activeEmail,
    afterClientDbUpdate,
  );

  return {
    trashFromSender: {
      ...INBOX_TOOLKIT_THREAD_ACTIONS.trashThread,
      name: "Trash all",
      tooltipDescription: "Trash threads from sender",
    },
    archiveFromSender: {
      ...INBOX_TOOLKIT_THREAD_ACTIONS.archiveThread,
      name: "Archive all",
      tooltipDescription: "Trash threads from sender",
    },
  } satisfies Record<string, ConfigOption>;
};
