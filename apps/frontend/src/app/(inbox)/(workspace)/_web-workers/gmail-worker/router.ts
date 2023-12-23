import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { createTRPCContext } from "@skylar/api";
import { formatValidatorError } from "@skylar/parsers-and-types";

const t = initTRPC.context<typeof createTRPCContext>().create({
  isServer: false,
  allowOutsideOfServer: true,
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        parserError: formatValidatorError(error.cause),
      },
    };
  },
});
export const gmailWorkerRouter = t.router({
  health: t.procedure.query(() => "OK"),
});

export type GmailWorkerRouterRouter = typeof gmailWorkerRouter;

// async function getAccessToken(emailAddress: string) {
//   const token = accessTokens.get(emailAddress);
//   if (!token || token.exp < Date.now()) {
//     const refTokenInfo = await getRefreshTokenDetailsByEmailAddress({
//       emailAddress,
//     });
//     if (!refTokenInfo) throw new Error(`Provider ${emailAddress} not found`); // TODO: better error
//     accessTokens.set(emailAddress, {
//       token: refTokenInfo.access_token,
//       exp: refTokenInfo.access_token_expires_at,
//     });
//   }

//   if (!token) throw new Error(`Provider ${emailAddress} not found`); // TODO: better error
//   return token.token;
// }

// insert an access token into the store
// function setAccessToken(emailAddress: string, token: string, exp: number) {
//   accessTokens.set(emailAddress, {token, exp});
// }
