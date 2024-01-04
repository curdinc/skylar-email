import { loggerLink } from "@trpc/client";

// configure all logger links for the web workers
export const loggerLinkConfig = loggerLink({
  enabled: (opts) => opts.direction === "down" && opts.result instanceof Error,
});
