import { useMemo } from "react";
import type { Editor } from "codemirror";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import type { ThreadType } from "@skylar/client-db/schema/thread";
import type {
  COMPOSE_EMAIL_OPTIONS,
  ProviderInfoType,
  SupportedAuthProvidersType,
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
  LOGIN: { loggingInto: SupportedAuthProvidersType | undefined };
  SETTINGS: {
    INVITE_CODE: {
      inviteCodeIdBeingDeleted: number | undefined;
    };
  };
  EMAIL_CLIENT: {
    activeEmailAddress: string | undefined;
    activeEmailProviderIndexes: number[];
    emailProviders: ProviderInfoType[];
    emailList: EmailListData[];
    CONTEXT_MENU: {
      mostRecentlyAffectedThreads: ThreadType[];
    };
    activeThread: ThreadType | undefined;
    COMPOSING: {
      emailType?: (typeof COMPOSE_EMAIL_OPTIONS)[number];
      codeMirrorInstance?: Editor;
      respondingThread: ThreadType | undefined;
      composedEmail: string;
      attachments: { file: File; data: string; preview?: string }[];
    };
  };
  SHORTCUT: {
    close: string;
    reply: string;
    openSpotlightSearch: string;
    goNextThread: string;
    goPreviousThread: string;
  };
};

type Actions = {
  setAlphaCode: (alphaCode: State["ONBOARDING"]["alphaCode"]) => void;
  setLoggingInto: (loggingInto: State["LOGIN"]["loggingInto"]) => void;
  setInviteCodeIdBeingDeleted: (
    inviteCodeId: State["SETTINGS"]["INVITE_CODE"]["inviteCodeIdBeingDeleted"],
  ) => void;
  setActiveEmailProviderIndexes: (
    updateFn: (
      prev: State["EMAIL_CLIENT"]["activeEmailProviderIndexes"],
    ) => State["EMAIL_CLIENT"]["activeEmailProviderIndexes"],
  ) => void;
  setEmailProviders: (
    emailProviders: State["EMAIL_CLIENT"]["emailProviders"],
  ) => void;
  setEmailListData: (treeViewData: State["EMAIL_CLIENT"]["emailList"]) => void;
  setActiveThread: (thread: State["EMAIL_CLIENT"]["activeThread"]) => void;
  setThreadToReplyTo: (
    thread: State["EMAIL_CLIENT"]["COMPOSING"]["respondingThread"],
  ) => void;
  setComposedEmail: (
    composeString: State["EMAIL_CLIENT"]["COMPOSING"]["composedEmail"],
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
  setComposingEmailType: (
    emailType: State["EMAIL_CLIENT"]["COMPOSING"]["emailType"],
  ) => void;
  setActiveEmailAddress: (
    emailAddress: State["EMAIL_CLIENT"]["activeEmailAddress"],
  ) => void;
};

// Core states
export const useGlobalStore = create(
  immer<State>(() => ({
    EMAIL_CLIENT: {
      activeEmailAddress: undefined,
      activeEmailProviderIndexes: [],
      emailProviders: [],
      emailList: [],
      CONTEXT_MENU: {
        mostRecentlyAffectedThreads: [],
      },
      activeThread: undefined,
      COMPOSING: {
        emailType: undefined,
        composedEmail: "",
        respondingThread: undefined,
        attachments: [],
        codeMirrorInstance: undefined,
      },
    },
    SETTINGS: {
      INVITE_CODE: {
        inviteCodeIdBeingDeleted: undefined,
      },
    },
    LOGIN: {
      loggingInto: undefined,
    },
    ONBOARDING: {
      alphaCode: "",
    },
    SHORTCUT: {
      close: "Escape",
      reply: "r",
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
export const COMPUTED_STATE_SELECTOR = {
  activeEmailProviders: (state: State) => state.EMAIL_CLIENT.emailProviders,
};

export const useActiveEmailProviders = () =>
  useOptimizedGlobalStore(COMPUTED_STATE_SELECTOR.activeEmailProviders);

export const useActiveEmails = () => {
  const activeEmailProviders = useActiveEmailProviders();
  return useMemo(
    () => activeEmailProviders.map((provider) => provider.email),
    [activeEmailProviders],
  );
};

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

export const setLoggingInto: Actions["setLoggingInto"] = (loggingInto) =>
  useGlobalStore.setState((state) => {
    state.LOGIN.loggingInto = loggingInto;
  });

export const setInviteCodeIdBeingDeleted: Actions["setInviteCodeIdBeingDeleted"] =
  (inviteCodeId) =>
    useGlobalStore.setState((state) => {
      state.SETTINGS.INVITE_CODE.inviteCodeIdBeingDeleted = inviteCodeId;
    });

export const setActiveEmailProviderIndexes: Actions["setActiveEmailProviderIndexes"] =
  (updateFn) =>
    useGlobalStore.setState((state) => {
      state.EMAIL_CLIENT.activeEmailProviderIndexes = updateFn(
        state.EMAIL_CLIENT.activeEmailProviderIndexes,
      );
    });

export const setActiveEmailAddress: Actions["setActiveEmailAddress"] = (
  emailAddress?: string,
) =>
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.activeEmailAddress = emailAddress;
  });

export const setEmailProviders: Actions["setEmailProviders"] = (
  emailProviders,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.emailProviders = emailProviders;
  });
};

export const setEmailList: Actions["setEmailListData"] = (emailList) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.emailList = emailList;
  });
};

export const setActiveThread: Actions["setActiveThread"] = (thread) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.activeThread = thread;
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
export const setThreadToReplyTo: Actions["setThreadToReplyTo"] = (thread) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.respondingThread = thread;
  });
};

export const setComposedEmail: Actions["setComposedEmail"] = (
  composeString,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.composedEmail = composeString;
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

export const setComposingEmailType: Actions["setComposingEmailType"] = (
  emailType,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.COMPOSING.emailType = emailType;
  });
};
