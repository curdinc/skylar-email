import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { formatValidatorError } from "@skylar/parsers-and-types";

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

export const createGmailApiRouter = t.router;
export const gmailApiRouterProcedure = t.procedure;
