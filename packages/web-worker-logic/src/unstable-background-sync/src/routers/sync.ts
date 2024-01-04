import { object, string } from "valibot";

import { validatorTrpcWrapper } from "@skylar/parsers-and-types";

import { backgroundSync } from "../lib/background-sync";
import { createGmailBgSyncRouter } from "../trpc/factory";
import { publicGmailBgSyncProcedure } from "../trpc/procedures";

let isInitiatedSyncGuard = false;

export const syncRouter = createGmailBgSyncRouter({
  backgroundSync: publicGmailBgSyncProcedure
    .input(
      validatorTrpcWrapper(
        object({
          emailAddress: string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      if (!isInitiatedSyncGuard) {
        isInitiatedSyncGuard = true;
        await backgroundSync({
          emailAddress: input.emailAddress,
        });
      }
      return "OK";
    }),
});
