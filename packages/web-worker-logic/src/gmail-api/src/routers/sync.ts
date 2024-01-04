import { incrementalSync, partialSync } from "@skylar/gmail-api";

import { backgroundFullSync } from "../lib/background-full-sync";
import { SYNC_PROCEDURES } from "../lib/procedure-types";
import { createGmailApiRouter, gmailApiRouterProcedure } from "../trpc/factory";

export const syncRouter = createGmailApiRouter({
  // make sure router is connected
  health: gmailApiRouterProcedure.query(() => "OK"),
  // fetches batches of messages (used upto full synchronization)
  backgroundFullSync: SYNC_PROCEDURES.backgroundFullSync.mutation(
    async ({ input, ctx }) => {
      await backgroundFullSync({
        emailAddress: input.emailAddress,
        getAccessToken: ctx.getAccessToken,
      });
    },
  ),
  // used for initial load
  incrementalSync: SYNC_PROCEDURES.incrementalSync.mutation(
    async ({ input, ctx }) => {
      const accessToken = await ctx.getAccessToken(input.emailAddress);

      const syncResponse = await incrementalSync({
        accessToken,
        emailId: input.emailAddress,
        pageToken: input.pageToken,
        numberOfMessagesToFetch: input.numberOfMessagesToFetch,
      });
      return syncResponse;
    },
  ),
  // fetches all messages since the startHistoryId (used for continuous synchronization)
  partialSync: SYNC_PROCEDURES.partialSync.mutation(async ({ input, ctx }) => {
    const accessToken = await ctx.getAccessToken(input.emailAddress);

    const syncResponse = await partialSync({
      accessToken,
      emailId: input.emailAddress,
      startHistoryId: input.startHistoryId,
    });
    return syncResponse;
  }),
});
