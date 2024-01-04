import { batchTrashThreads } from "@skylar/gmail-api";

import { THREAD_PROCEDURES } from "../lib/procedure-types";
import { createGmailApiRouter } from "../trpc/factory";
import { publicGmailApiRouterProcedure } from "../trpc/procedures";

export const threadRouter = createGmailApiRouter({
  // make sure router is connected
  health: publicGmailApiRouterProcedure.query(() => "OK"),
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
