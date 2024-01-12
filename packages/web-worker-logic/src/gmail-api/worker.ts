import { TRPCError } from "@trpc/server";

import { getRefreshTokenByEmailAddress } from "@skylar/client-db";
import { sharedWorkerAdapter } from "@skylar/trpc-web-workers";

import { gmailApiWorkerRouter } from "./root";
import { ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS } from "./src/lib/constants";
import { skylarBackendClient } from "./src/lib/skylar-backend-connector";

// GLOBAL WORKER CONTEXT
const tokenStore = new Map<string, { at: string; exp: number }>();
const syncLock = new Map<string, boolean>(); // email -> isLocked

sharedWorkerAdapter({
  router: gmailApiWorkerRouter,
  createContext: () => {
    return {
      getAccessToken: async (emailAddress: string) => {
        const token = tokenStore.get(emailAddress);

        if (token && Date.now() < token.exp) {
          // return cached token
          return token.at;
        }
        const refreshToken = await getRefreshTokenByEmailAddress({
          emailAddress,
        });

        if (!refreshToken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Provider not connected.",
          });
        }

        const accessTokenInfo =
          await skylarBackendClient.gmail.getAccessToken.mutate({
            email: emailAddress,
            refreshToken,
          });

        tokenStore.set(emailAddress, {
          at: accessTokenInfo.accessToken,
          exp: Date.now() + ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS,
        });

        return accessTokenInfo.accessToken;
      },
      tokenStore,
      syncLock,
    };
  },
});
