import { labelRouter } from "./lib/sub-routers/label";
import { messageRouter } from "./lib/sub-routers/message";
import {
  createGmailApiRouter,
  gmailApiRouterProcedure,
} from "./lib/trpc-factory";

export const gmailWorkerRouter = createGmailApiRouter({
  health: gmailApiRouterProcedure.query(() => "OK"),
  label: labelRouter,
  message: messageRouter,
});

export type GmailWorkerRouterType = typeof gmailWorkerRouter;

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
