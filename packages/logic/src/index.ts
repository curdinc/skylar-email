import { observable, opaqueObject } from "@legendapp/state";

import type { ClientDb } from "@skylar/client-db";
import { initClientDb } from "@skylar/client-db";
import type { schema } from "@skylar/db";
import type { SupportedAuthProvidersType } from "@skylar/parsers-and-types";

export const state$ = observable({
  ONBOARDING: { alphaCode: "" },
  LOGIN: { loggingInto: undefined as SupportedAuthProvidersType | undefined },
  INVITE_CODE: {
    inviteCodeIdBeingDeleted: undefined as number | undefined,
  },
  EMAIL_CLIENT: {
    activeEmailProviderIndex: 0,
    emailProviders: [] as (typeof schema.emailProviderDetail.$inferSelect)[],
    clientDbs: {} as Record<string, ClientDb>,
    initializeClientDbs: () => {
      const emailProviders = state$.EMAIL_CLIENT.emailProviders.get();
      const clientDbs: Record<string, ClientDb> = {};
      for (const emailProvider of emailProviders) {
        const clientDb = initClientDb(emailProvider.email);
        clientDbs[emailProvider.email] = opaqueObject(clientDb);
      }
      state$.EMAIL_CLIENT.clientDbs.set(clientDbs);
    },
  },
  SHORTCUT: {
    goBack: "Escape",
    openSpotlightSearch: "$mod+p",
    goNextThread: "ArrowRight",
    goPreviousThread: "ArrowLeft",
  },
  // Not used right now. Needed to make the api stuff work
  env: {
    NEXT_PUBLIC_BACKEND_URL: "",
    NODE_ENV: "",
    getCookieValue: (_cookieName: string) => "",
    getHeaders: () => ({}) as Record<string, string>,
  },
});

export const useActiveEmailProvider = () => {
  const activeIndex = state$.EMAIL_CLIENT.activeEmailProviderIndex.use();
  const emailProviders = state$.EMAIL_CLIENT.emailProviders.use();
  const activeEmailProvider = emailProviders[activeIndex];
  return activeEmailProvider;
};
export const useActiveEmailClientDb = () => {
  const activeIndex = state$.EMAIL_CLIENT.activeEmailProviderIndex.use();
  const emailProviders = state$.EMAIL_CLIENT.emailProviders.use();
  const clientDbs = state$.EMAIL_CLIENT.clientDbs.use();
  const email = emailProviders[activeIndex]?.email;
  if (!email) {
    return undefined;
  }
  const db = clientDbs[email];
  return db;
};
