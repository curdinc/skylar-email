import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { object, string } from "valibot";

import {
  formatValidatorError,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { backgroundSync } from "./background-sync";

const t = initTRPC.context().create({
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

let isInitiatedSyncGuard = false;

export const gmailBackgroundSyncRouter = t.router({
  health: t.procedure.query(() => "OK"),
  syncProvider: t.procedure
    .input(
      validatorTrpcWrapper(
        object({
          emailAddress: string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      console.log("input", input);
      if (!isInitiatedSyncGuard) {
        isInitiatedSyncGuard = true;
        await backgroundSync({
          emailAddress: input.emailAddress,
        });
      }
      return "OK";
    }),
});

export type GmailBackgroundSyncRouterType = typeof gmailBackgroundSyncRouter;
