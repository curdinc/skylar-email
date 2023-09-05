import {
  GmailPushNotificationSchema,
  testSchema,
  validatorTrpcWrapper,
} from "@skylar/schema";

import {
  createTRPCRouter,
  externalVendorProcedure,
  publicProcedure,
} from "../trpc";

export const gmailRouter = createTRPCRouter({
  incomingEmail: externalVendorProcedure
    .input(validatorTrpcWrapper(GmailPushNotificationSchema))
    .mutation(async ({ ctx, input }) => {
      console.log("input.message.data", input.message.data);
      // const data = input.message.data;
      //   const parsedData = parse(
      //     GmailPushNotificationDataObjectSchema,
      //     JSON.parse(Buffer.from(input.message.data, "base64").toString("utf-8")),
      //   );
      //   console.log("parsedData", parsedData);
    }),
  hello: publicProcedure
    .input(validatorTrpcWrapper(testSchema))
    .mutation(({ ctx, input }) => {
      console.log("input.message.data", input);
    }),
});
