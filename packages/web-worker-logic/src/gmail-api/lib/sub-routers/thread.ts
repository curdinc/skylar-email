import { batchTrashThreads } from "@skylar/gmail-api";

import { THREAD_PROCEDURES } from "../procedure-types";
import { createGmailApiRouter, gmailApiRouterProcedure } from "../trpc-factory";

export const threadRouter = createGmailApiRouter({
  // make sure router is connected
  health: gmailApiRouterProcedure.query(() => "OK"),
  // deletes threads
  delete: THREAD_PROCEDURES.delete.mutation(async ({ input, ctx }) => {
    const accessToken = await ctx.getAccessToken(input.emailAddress);

    // add to clientDb
    await batchTrashThreads({
      accessToken,
      emailId: input.emailAddress,
      threadIds: input.threadIds,
    });
  }),
});
