import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { object, string } from "valibot";

import {
  formatValidatorError,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { backgroundSync } from "./lib/background-sync";

const t = initTRPC.create({
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
  sync: t.router({
    backgroundSync: t.procedure
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
  }),
});

export type GmailBackgroundSyncRouterType = typeof gmailBackgroundSyncRouter;
