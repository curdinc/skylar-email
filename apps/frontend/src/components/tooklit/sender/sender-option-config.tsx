import type {
  ConfigOption,
  GetThreads,
  MoveThreadArgs,
} from "../config-option-type";
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
    labelFromSender: {
      ...INBOX_TOOLKIT_THREAD_ACTIONS.modifyThreadLabels,
      name: "Move all",
      tooltipDescription: "Move all threads from sender",
    },
  } as const satisfies Record<string, ConfigOption<MoveThreadArgs | []>>;
};
