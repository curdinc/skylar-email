import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { schema } from "@skylar/db";
import type { SupportedAuthProvidersType } from "@skylar/parsers-and-types";

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
  };
  SHORTCUT: {
    goBack: string;
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
  setShortcuts: (shortcuts: Partial<State["SHORTCUT"]>) => void;
};

// Core states
export const useGlobalStore = create(
  immer<State>(() => ({
    EMAIL_CLIENT: {
      activeEmailProviderIndexes: [],
      emailProviders: [],
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
      goBack: "Escape",
      openSpotlightSearch: "$mod+p",
      goNextThread: "ArrowRight",
      goPreviousThread: "ArrowLeft",
    },
  })),
);

// Computed states
export const useActiveEmailProviders = () =>
  useGlobalStore(
    (state) =>
      state.EMAIL_CLIENT.activeEmailProviderIndexes
        .map((index) => {
          return state.EMAIL_CLIENT.emailProviders[index];
        })
        .filter(
          (provider) => !!provider,
        ) as (typeof schema.emailProviderDetail.$inferSelect)[],
  );
export const useActiveEmails = () => {
  const activeEmailProviders = useActiveEmailProviders();
  return activeEmailProviders.map((provider) => provider.email);
};
export const useAllShortcutNames = () =>
  useGlobalStore((state) =>
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
      state.EMAIL_CLIENT.activeEmailProviderIndexes = emailProviders.map(
        (_, index) => index,
      );
    }
  });
};
