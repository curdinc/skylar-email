import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { formatValidatorError } from "@skylar/parsers-and-types";

export type TokenStore = Map<string, { at: string; exp: number }>;
type GmailApiRouterContext = {
  getAccessToken: (emailAddress: string) => Promise<string>;
  tokenStore: TokenStore;
};

const t = initTRPC.context<GmailApiRouterContext>().create({
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
