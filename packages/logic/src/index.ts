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
    activeEmailProviders: (typeof schema.emailProviderDetail.$inferSelect)[];
  };
  SHORTCUT: {
    goBack: string;
    openSpotlightSearch: string;
    goNextThread: string;
    goPreviousThread: string;
    allShortcuts: string[];
  };
};

type Actions = {
  ONBOARDING: {
    setAlphaCode: (alphaCode: State["ONBOARDING"]["alphaCode"]) => void;
  };
  LOGIN: {
    setLoggingInto: (loggingInto: State["LOGIN"]["loggingInto"]) => void;
  };
  SETTINGS: {
    INVITE_CODE: {
      setInviteCodeIdBeingDeleted: (
        inviteCodeId: State["SETTINGS"]["INVITE_CODE"]["inviteCodeIdBeingDeleted"],
      ) => void;
    };
  };
  EMAIL_CLIENT: {
    setActiveEmailProviderIndexes: (
      updateFn: (
        prev: State["EMAIL_CLIENT"]["activeEmailProviderIndexes"],
      ) => State["EMAIL_CLIENT"]["activeEmailProviderIndexes"],
    ) => void;
    setEmailProviders: (
      emailProviders: State["EMAIL_CLIENT"]["emailProviders"],
    ) => void;
  };
  SHORTCUT: {
    setShortcuts: (shortcuts: Partial<State["SHORTCUT"]>) => void;
  };
};

export const useGlobalStore = create(
  immer<State & Actions>((set, get) => ({
    EMAIL_CLIENT: {
      activeEmailProviderIndexes: [],
      emailProviders: [],
      activeEmailProviders: get()
        .EMAIL_CLIENT.activeEmailProviderIndexes.map((index) => {
          return get().EMAIL_CLIENT.emailProviders[index];
        })
        .filter(
          (provider) => !!provider,
        ) as (typeof schema.emailProviderDetail.$inferSelect)[],
      setActiveEmailProviderIndexes: (updateFn) => {
        set(
          (state) =>
            (state.EMAIL_CLIENT.activeEmailProviderIndexes = updateFn(
              state.EMAIL_CLIENT.activeEmailProviderIndexes,
            )),
        );
      },
      setEmailProviders: (emailProviders) => {
        set((state) => {
          state.EMAIL_CLIENT.emailProviders = emailProviders;
          if (state.EMAIL_CLIENT.activeEmailProviderIndexes.length === 0) {
            state.EMAIL_CLIENT.activeEmailProviderIndexes = emailProviders.map(
              (_, index) => index,
            );
          }
        });
      },
    },
    SETTINGS: {
      INVITE_CODE: {
        inviteCodeIdBeingDeleted: undefined,
        setInviteCodeIdBeingDeleted: (inviteCodeId) => {
          set((state) => {
            state.SETTINGS.INVITE_CODE.inviteCodeIdBeingDeleted = inviteCodeId;
          });
        },
      },
    },
    LOGIN: {
      loggingInto: undefined,
      setLoggingInto: (loggingInto) => {
        set((state) => {
          state.LOGIN.loggingInto = loggingInto;
        });
      },
    },
    ONBOARDING: {
      alphaCode: "",
      setAlphaCode: (alphaCode) => {
        set((state) => {
          state.ONBOARDING.alphaCode = alphaCode;
        });
      },
    },
    SHORTCUT: {
      goBack: "Escape",
      openSpotlightSearch: "$mod+p",
      goNextThread: "ArrowRight",
      goPreviousThread: "ArrowLeft",
      allShortcuts: Object.keys(get().SHORTCUT).filter(
        (key) => key !== "allShortcuts" && key !== "setShortcuts",
      ),
      setShortcuts: (shortcuts) => {
        set((state) => {
          state.SHORTCUT = {
            ...state.SHORTCUT,
            ...shortcuts,
          };
        });
      },
    },
  })),
);
