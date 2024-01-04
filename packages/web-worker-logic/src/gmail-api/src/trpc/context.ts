import { TRPCError } from "@trpc/server";

import { getRefreshTokenByEmailAddress } from "@skylar/client-db";

import { ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS } from "../lib/constants";
import { skylarBackendClient } from "../lib/skylar-backend-connector";

/**
 * GLOBAL WORKER CONTEXT - stored on the worker thread (not shared)
 */
const tokenStore = new Map<string, { at: string; exp: number }>();
const syncLock = new Map<string, boolean>(); // email -> isLocked

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
type GmailApiRouterContext = {
  getAccessToken: (emailAddress: string) => Promise<string>;
  tokenStore: typeof tokenStore;
  syncLock: typeof syncLock;
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createGmailApiRouterContext = (): GmailApiRouterContext => {
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
};
