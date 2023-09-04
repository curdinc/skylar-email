import { Logger as AxiomLogger } from "next-axiom/dist/logger";

import { axiomLoggerToLogger } from "./shared";
import type { Logger } from "./types";

export function getServerLogger(
  req: Request,
  meta?: Record<string, unknown>,
): Logger {
  const report = {
    startTime: new Date().getTime(),
    path: req.url,
    method: req.method,
    host: req.headers.get("host"),
    userAgent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  };
  const logger = new AxiomLogger({
    req: report,
    source: "server",
    args: meta,
  });

  return axiomLoggerToLogger(logger);
}
