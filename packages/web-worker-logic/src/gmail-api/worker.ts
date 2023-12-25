import { TRPCError } from "@trpc/server";

import { getRefreshTokenByEmailAddress } from "@skylar/client-db";
import { sharedWorkerAdapter } from "@skylar/trpc-web-workers";

import { ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS } from "./lib/constants";
import { skylarBackendClient } from "./lib/skylar-backend-connector";
import { gmailWorkerRouter } from "./router";

// GLOBAL WORKER CONTEXT
const tokenStore = new Map<string, { at: string; exp: number }>();

sharedWorkerAdapter({
  router: gmailWorkerRouter,
  createContext: () => {
    return {
      getAccessToken: async (emailAddress: string) => {
        const token = tokenStore.get(emailAddress);

        if (token && Date.now() < token.exp) {
          // return cached token
          return token.at;
        }
        console.log("tokenStore", tokenStore);
        const refreshToken = await getRefreshTokenByEmailAddress({
          emailAddress,
        });

        if (!refreshToken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Provider not connected.",
          });
        }

        const accessToken =
          await skylarBackendClient.gmail.getAccessToken.mutate({
            email: emailAddress,
            refreshToken,
          });
        tokenStore.set(emailAddress, {
          at: accessToken,
          exp: Date.now() + ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS,
        });

        return accessToken;
      },
      tokenStore,
    };
  },
});
