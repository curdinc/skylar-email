import { batchModifyLabels, listLabels } from "@skylar/gmail-api";

import { LABEL_PROCEDURES } from "../procedure-types";
import { createGmailApiRouter, gmailApiRouterProcedure } from "../trpc-factory";

export const labelRouter = createGmailApiRouter({
  // make sure router is connected
  health: gmailApiRouterProcedure.query(() => "OK"),
  // Lists all labels in the user's mailbox.
  list: LABEL_PROCEDURES.list.query(async ({ input, ctx }) => {
    const accessToken = await ctx.getAccessToken(input.emailAddress);
    const labels = await listLabels({
      accessToken,
      emailId: input.emailAddress,
    });
    return labels.map((label) => ({
      ...label,
      labelListVisibility: label.labelListVisibility ?? "labelShow",
    }));
  }),
  // modifies the specified labels on the specified threads.
  modify: LABEL_PROCEDURES.modify.mutation(async ({ input, ctx }) => {
    const accessToken = await ctx.getAccessToken(input.emailAddress);
    await batchModifyLabels({
      accessToken,
      emailId: input.emailAddress,
      addLabels: input.addLabelsIds,
      deleteLabels: input.deleteLabelsIds,
      threadIds: input.threadIds,
    });
  }),
});
