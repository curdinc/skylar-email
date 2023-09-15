import { TRPCError } from "@trpc/server";

import { createMiddleware } from "../trpc/factory";

export const enforceExternalVendor = createMiddleware(({ ctx, next }) => {
  throw new TRPCError({
    code: "FORBIDDEN",
    message: "Unauthorized origin",
  });
  return next();
});
