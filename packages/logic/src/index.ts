import { observable } from "@legendapp/state";

import type { ClientDb } from "@skylar/client-db";
import { initClientDb } from "@skylar/client-db";
import type { SupportedAuthProvidersType } from "@skylar/parsers-and-types";

export const state$ = observable({
  ONBOARDING: { alphaCode: "" },
  LOGIN: { loggingInto: undefined as SupportedAuthProvidersType | undefined },
  EMAIL_CLIENT: {
    clientDb: {} as Record<string, ClientDb>,
    activeClientDbName: undefined as string | undefined,
    getActiveClientDb: () => {
      const activeClientDbName = state$.EMAIL_CLIENT.activeClientDbName.get();
      if (!activeClientDbName) {
        throw new Error("activeClientDb is undefined");
      }
      const clientDbs = state$.EMAIL_CLIENT.clientDb.get();
      const clientDb = clientDbs[state$.EMAIL_CLIENT.activeClientDbName.get()];
      if (clientDb) {
        return clientDb;
      }
      const newClientDb = initClientDb(activeClientDbName);
      state$.EMAIL_CLIENT.clientDb.set((prev) => {
        return {
          ...prev,
          [activeClientDbName]: newClientDb,
        };
      });
      return newClientDb;
    },
  },
  // Not used right now. Needed to make the api stuff work
  env: {
    NEXT_PUBLIC_BACKEND_URL: "",
    NODE_ENV: "",
    getCookieValue: (_cookieName: string) => "",
    getHeaders: () => ({}) as Record<string, string>,
  },
});
