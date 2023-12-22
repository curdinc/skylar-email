import type { Editor } from "codemirror";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import {
  formatGmailForwardMessage,
  formatGmailReplyMessage,
} from "@skylar/message-manager";
import type {
  AllComposeMessageOptionsType,
  ThreadType,
  ValidComposeMessageOptionsType,
  ValidReplyMessageOptionsType,
} from "@skylar/parsers-and-types";

export type State = {
  ONBOARDING: { alphaCode: string };
  SETTINGS: {
    INVITE_CODE: {
      inviteCodeIdBeingDeleted: number | undefined;
    };
  };
  EMAIL_CLIENT: {
    CONTEXT_MENU: {
      mostRecentlyAffectedThreads: ThreadType[];
    };
    MESSAGE_LIST: {
      activeMessageIndexes: Record<string, number | undefined>;
    };
    activeThread: ThreadType | undefined;
    COMPOSING: {
      messageType: AllComposeMessageOptionsType;
      isSelecting: boolean;
      codeMirrorInstance?: Editor;
      respondingThread: ThreadType | undefined;
      respondingMessageString: string;
      attachments: { file: File; data: string; preview?: string }[];
    };
  };
};

type Actions = {
  setAlphaCode: (alphaCode: State["ONBOARDING"]["alphaCode"]) => void;
  setInviteCodeIdBeingDeleted: (
    inviteCodeId: State["SETTINGS"]["INVITE_CODE"]["inviteCodeIdBeingDeleted"],
  ) => void;
  setActiveThread: (thread: State["EMAIL_CLIENT"]["activeThread"]) => void;
  resetActiveThread: () => void;
  setReplyMessageType: (args: {
    thread: State["EMAIL_CLIENT"]["COMPOSING"]["respondingThread"];
    replyType: ValidReplyMessageOptionsType;
  }) => void;
  resetReplyMessage: () => void;
  setRespondingMessageString: (
    setRespondingMessageString: State["EMAIL_CLIENT"]["COMPOSING"]["respondingMessageString"],
  ) => void;
  setMostRecentlyAffectedThreads: (affectedThreads: ThreadType[]) => void;
  setAttachments: (
    updateFn: (
      prev: State["EMAIL_CLIENT"]["COMPOSING"]["attachments"],
    ) => State["EMAIL_CLIENT"]["COMPOSING"]["attachments"],
  ) => void;
  setCodeMirrorInstance: (
    codeMirrorInstance: State["EMAIL_CLIENT"]["COMPOSING"]["codeMirrorInstance"],
  ) => void;
  setIsSelecting: (
    isSelecting: State["EMAIL_CLIENT"]["COMPOSING"]["isSelecting"],
  ) => void;
  setComposeMessageType: (emailType: ValidComposeMessageOptionsType) => void;
  setActiveMessageIndexes: (
    label: string,
    activeMessageIndex: State["EMAIL_CLIENT"]["MESSAGE_LIST"]["activeMessageIndexes"][keyof State["EMAIL_CLIENT"]["MESSAGE_LIST"]["activeMessageIndexes"]],
  ) => void;
};

// Core states
export const useGlobalStore = create(
  immer<State>(() => ({
    EMAIL_CLIENT: {
      CONTEXT_MENU: {
        mostRecentlyAffectedThreads: [],
      },
      activeThread: undefined,
      MESSAGE_LIST: {
        activeMessageIndexes: {},
      },
      COMPOSING: {
        messageType: "none",
        respondingMessageString: "",
        respondingThread: undefined,
        attachments: [],
        codeMirrorInstance: undefined,
        isSelecting: false,
      },
    },
    SETTINGS: {
      INVITE_CODE: {
        inviteCodeIdBeingDeleted: undefined,
      },
    },
    ONBOARDING: {
      alphaCode: "",
    },
  })),
);

export const useOptimizedGlobalStore = <T>(arg: (state: State) => T) => {
  return useGlobalStore(useShallow(arg));
};

// Computed / convenient hooks states

// Actions
export const setAlphaCode: Actions["setAlphaCode"] = (code) =>
  useGlobalStore.setState((state) => {
    state.ONBOARDING.alphaCode = code;
  });

export const setInviteCodeIdBeingDeleted: Actions["setInviteCodeIdBeingDeleted"] =
  (inviteCodeId) =>
    useGlobalStore.setState((state) => {
      state.SETTINGS.INVITE_CODE.inviteCodeIdBeingDeleted = inviteCodeId;
    });

export const setActiveThread: Actions["setActiveThread"] = (thread) => {
  window.location.hash = `#${thread?.provider_thread_id ?? ""}`;
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.activeThread = thread;
  });
};
export const resetActiveThread: Actions["resetActiveThread"] = () => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.activeThread = undefined;
  });
};

export const setMostRecentlyAffectedThreads: Actions["setMostRecentlyAffectedThreads"] =
  (affectedThreads) => {
    useGlobalStore.setState((state) => {
      state.EMAIL_CLIENT.CONTEXT_MENU.mostRecentlyAffectedThreads = JSON.parse(
        JSON.stringify(affectedThreads),
      ) as ThreadType[];
    });
  };

export const setReplyMessageType: Actions["setReplyMessageType"] = (args) => {
  const { replyType, thread } = args;
  if (replyType === "forward") {
    if (!thread) {
      return;
    }
    const forwardContent = thread.content.at(-1) ?? "";
    const from = thread.from.at(-1)?.[0];
    const to = thread.from.at(-1);
    if (!from || !to) {
      return;
    }
    const formattedForwardContent = formatGmailForwardMessage({
      dateSent: thread?.updated_at,
      subject: thread.subject,
      forwardContent,
      from: from,
      to: to,
    });
    setRespondingMessageString(formattedForwardContent);
  } else {
    if (!thread) {
      return;
    }
    const replyContent = thread.content.at(-1) ?? "";
    const from = thread.from.at(-1)?.[0];
    if (!from) {
      return;
    }
    const formattedReplyMessage = formatGmailReplyMessage({
      dateSent: thread?.updated_at,
      replyContent,
      from,
    });
    setRespondingMessageString(formattedReplyMessage);
  }
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.respondingThread = thread;
    state.EMAIL_CLIENT.COMPOSING.messageType = replyType;
  });
};

export const resetComposeMessage: Actions["resetReplyMessage"] = () => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.respondingThread = undefined;
    state.EMAIL_CLIENT.COMPOSING.messageType = "none";
    state.EMAIL_CLIENT.COMPOSING.respondingMessageString = "";
    state.EMAIL_CLIENT.COMPOSING.attachments.forEach((attachment) => {
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
    });
    state.EMAIL_CLIENT.COMPOSING.attachments = [];
    state.EMAIL_CLIENT.COMPOSING.codeMirrorInstance?.setValue("");
    state.EMAIL_CLIENT.COMPOSING.codeMirrorInstance = undefined;
  });
};

export const setRespondingMessageString: Actions["setRespondingMessageString"] =
  (respondingMessageString) => {
    useGlobalStore.setState((state) => {
      state.EMAIL_CLIENT.COMPOSING.respondingMessageString =
        respondingMessageString;
    });
  };

export const setAttachments: Actions["setAttachments"] = (updateFn) =>
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.attachments = updateFn(
      state.EMAIL_CLIENT.COMPOSING.attachments,
    );
  });

export const setCodeMirrorInstance: Actions["setCodeMirrorInstance"] = (
  codeMirrorInstance,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.codeMirrorInstance = codeMirrorInstance;
  });
};
export const setIsSelecting: Actions["setIsSelecting"] = (isSelecting) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.isSelecting = isSelecting;
  });
};

export const setComposeMessageType: Actions["setComposeMessageType"] = (
  messageType,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.messageType = messageType;
  });
};

export const setActiveMessageIndexes: Actions["setActiveMessageIndexes"] = (
  label,
  activeMessageIndex,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.MESSAGE_LIST.activeMessageIndexes[label] =
      activeMessageIndex;
  });
};
