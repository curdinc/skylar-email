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

export type EmailListData =
  | {
      meta: {
        canMove: boolean;
        canRename: boolean;
        isFolder: boolean;
        isVisible: boolean;
      };
      isLabel: true;
      label: { name: string; id: string };
    }
  | {
      meta: {
        isVisible: boolean;
        canMove: boolean;
        canRename: boolean;
        isFolder: boolean;
      };
      isLabel: false;
      thread: ThreadType;
    };

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
  SHORTCUT: {
    close: string;
    compose: string;
    replyAll: string;
    replySender: string;
    forward: string;
    openSpotlightSearch: string;
    goNextThread: string;
    goPreviousThread: string;
    inboxOne: string;
    inboxTwo: string;
    inboxThree: string;
    inboxFour: string;
    inboxFive: string;
    inboxSix: string;
    inboxSeven: string;
    inboxEight: string;
    inboxNine: string;
    inboxTen: string;
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
  setShortcuts: (shortcuts: Partial<State["SHORTCUT"]>) => void;
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
};

// Core states
export const useGlobalStore = create(
  immer<State>(() => ({
    EMAIL_CLIENT: {
      CONTEXT_MENU: {
        mostRecentlyAffectedThreads: [],
      },
      activeThread: undefined,
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
    SHORTCUT: {
      close: "Escape",
      compose: "c",
      forward: "f",
      replyAll: "r",
      replySender: "Shift+R",
      openSpotlightSearch: "$mod+p",
      goNextThread: "ArrowRight",
      goPreviousThread: "ArrowLeft",
      inboxOne: "Alt+1",
      inboxTwo: "Alt+2",
      inboxThree: "Alt+3",
      inboxFour: "Alt+4",
      inboxFive: "Alt+5",
      inboxSix: "Alt+6",
      inboxSeven: "Alt+7",
      inboxEight: "Alt+8",
      inboxNine: "Alt+9",
      inboxTen: "Alt+0",
    },
  })),
);

export const useOptimizedGlobalStore = <T>(arg: (state: State) => T) => {
  return useGlobalStore(useShallow(arg));
};

// Computed / convenient hooks states
export const useAllShortcutNames = () =>
  useOptimizedGlobalStore((state) => Object.keys(state.SHORTCUT));
export const useShortcuts = () => {
  return useOptimizedGlobalStore((state) => state.SHORTCUT);
};

// Actions
export const setAlphaCode: Actions["setAlphaCode"] = (code) =>
  useGlobalStore.setState((state) => {
    state.ONBOARDING.alphaCode = code;
  });

export const setShortcuts: Actions["setShortcuts"] = (shortcuts) =>
  useGlobalStore.setState((state) => {
    state.SHORTCUT = {
      ...state.SHORTCUT,
      ...shortcuts,
    };
  });

export const setInviteCodeIdBeingDeleted: Actions["setInviteCodeIdBeingDeleted"] =
  (inviteCodeId) =>
    useGlobalStore.setState((state) => {
      state.SETTINGS.INVITE_CODE.inviteCodeIdBeingDeleted = inviteCodeId;
    });

export const setActiveThread: Actions["setActiveThread"] = (thread) => {
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
