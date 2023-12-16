import type { Editor } from "codemirror";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import { bulkGetMessages } from "@skylar/client-db";
import { formatForwardMessage } from "@skylar/message-manager";
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
      composedMessage: string;
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
  };
};

type Actions = {
  setAlphaCode: (alphaCode: State["ONBOARDING"]["alphaCode"]) => void;
  setInviteCodeIdBeingDeleted: (
    inviteCodeId: State["SETTINGS"]["INVITE_CODE"]["inviteCodeIdBeingDeleted"],
  ) => void;
  setActiveThread: (thread: State["EMAIL_CLIENT"]["activeThread"]) => void;
  resetActiveThread: () => void;
  setReplyMessage: (
    thread: State["EMAIL_CLIENT"]["COMPOSING"]["respondingThread"],
    replyType: ValidReplyMessageOptionsType,
  ) => void;
  resetReplyMessage: () => void;
  setComposedEmail: (
    composeString: State["EMAIL_CLIENT"]["COMPOSING"]["composedMessage"],
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
  setComposeMessage: (emailType: ValidComposeMessageOptionsType) => void;
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
        composedMessage: "",
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
    },
  })),
);

export const useOptimizedGlobalStore = <T>(arg: (state: State) => T) => {
  return useGlobalStore(useShallow(arg));
};

// Computed states
export const useAllShortcutNames = () =>
  useOptimizedGlobalStore((state) =>
    Object.keys(state.SHORTCUT).filter((key) => key !== "setShortcuts"),
  );

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
    console.log("state", state);
    console.log("thread", thread);
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

export const setReplyMessage: Actions["setReplyMessage"] = (
  thread,
  replyType,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.respondingThread = thread;
    state.EMAIL_CLIENT.COMPOSING.messageType = replyType;
    if (replyType === "forward") {
      const latestProviderMessageId = thread?.email_provider_message_id.at(-1);
      if (!latestProviderMessageId) {
        return;
      }
      bulkGetMessages({
        providerMessageIds: [latestProviderMessageId],
      })
        .then(([message]) => {
          if (!message) {
            return;
          }
          setComposedEmail(
            formatForwardMessage({
              dateSent: message.created_at,
              forwardContent:
                message.content_html ?? message.content_text ?? "",
              from: message.from,
              subject: message.subject,
              to: message.to,
            }),
          );
        })
        .catch((e) => {
          console.error(
            "Error fetching message when setting forward content",
            e,
          );
        });
    }
  });
};

export const resetComposeMessage: Actions["resetReplyMessage"] = () => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.respondingThread = undefined;
    state.EMAIL_CLIENT.COMPOSING.messageType = "none";
    state.EMAIL_CLIENT.COMPOSING.composedMessage = "";
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

export const setComposedEmail: Actions["setComposedEmail"] = (
  composeString,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.composedMessage = composeString;
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

export const setComposeMessage: Actions["setComposeMessage"] = (
  messageType,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.messageType = messageType;
  });
};
