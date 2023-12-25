import { sendMail } from "@skylar/gmail-api";
import { composeRfc822Message } from "@skylar/message-manager";

import { MESSAGE_PROCEDURES } from "../procedure-types";
import { createGmailApiRouter, gmailApiRouterProcedure } from "../trpc-factory";

export const messageRouter = createGmailApiRouter({
  // make sure router is connected
  health: gmailApiRouterProcedure.query(() => "OK"),
  // Sends a rfc822 message
  send: MESSAGE_PROCEDURES.send.mutation(async ({ input, ctx }) => {
    const accessToken = await ctx.getAccessToken(input.emailAddress);

    // compose
    const rfc822Base64EncodedMessageData = composeRfc822Message(
      input.emailConfig,
    );
    await sendMail({
      accessToken,
      emailId: input.emailAddress,
      rfc822Base64EncodedMessageData: rfc822Base64EncodedMessageData,
      replyToGmailThreadId: input.replyToGmailThreadId,
    });
  }),
});
