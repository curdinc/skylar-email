import { createMiddleware } from "../trpc/factory";

export const enforceExternalVendor = createMiddleware(({ next }) => {
  // throw new TRPCError({
  //   code: "FORBIDDEN",
  //   message: "Unauthorized origin",
  // });
  return next();
});
