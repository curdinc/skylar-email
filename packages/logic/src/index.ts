import { useMemo } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import type { ThreadType } from "@skylar/client-db/schema/thread";
import type { schema } from "@skylar/db";
import type { SupportedAuthProvidersType } from "@skylar/parsers-and-types";

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

type State = {
  ONBOARDING: { alphaCode: string };
  LOGIN: { loggingInto: SupportedAuthProvidersType | undefined };
  SETTINGS: {
    INVITE_CODE: {
      inviteCodeIdBeingDeleted: number | undefined;
    };
  };
  EMAIL_CLIENT: {
    activeEmailProviderIndexes: number[];
    emailProviders: (typeof schema.emailProviderDetail.$inferSelect)[];
    emailList: EmailListData[];
    activeThreadId: string | undefined;
    threadToReplyTo: string | undefined;
  };
  SHORTCUT: {
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
  setActiveThreadId: (
    threadId: State["EMAIL_CLIENT"]["activeThreadId"],
  ) => void;
  setThreadToReplyTo: (
    threadId: State["EMAIL_CLIENT"]["threadToReplyTo"],
  ) => void;
  setShortcuts: (shortcuts: Partial<State["SHORTCUT"]>) => void;
};

// Core states
export const useGlobalStore = create(
  immer<State>(() => ({
    EMAIL_CLIENT: {
      activeEmailProviderIndexes: [],
      emailProviders: [],
      emailList: [],
      activeThreadId: undefined,
      threadToReplyTo: undefined,
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
  activeEmailProviders: (state: State) =>
    state.EMAIL_CLIENT.activeEmailProviderIndexes
      .map((index) => {
        return state.EMAIL_CLIENT.emailProviders[index];
      })
      .filter(
        (provider) => !!provider,
      ) as (typeof schema.emailProviderDetail.$inferSelect)[],
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

export const setEmailProviders: Actions["setEmailProviders"] = (
  emailProviders,
) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.emailProviders = emailProviders;
    if (state.EMAIL_CLIENT.activeEmailProviderIndexes.length === 0) {
      state.EMAIL_CLIENT.activeEmailProviderIndexes = [0];
    }
  });
};

export const setEmailList: Actions["setEmailListData"] = (emailList) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.emailList = emailList;
  });
};

export const setActiveThreadId: Actions["setActiveThreadId"] = (threadId) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.activeThreadId = threadId;
  });
};

export const setThreadToReplyTo: Actions["setThreadToReplyTo"] = (threadId) => {
  useGlobalStore.setState((state) => {
    state.EMAIL_CLIENT.threadToReplyTo = threadId;
  });
};
