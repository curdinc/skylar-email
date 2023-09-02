import type { NextConfig } from "next";
import { useLogger as useAxiomLogger, withAxiom } from "next-axiom";
import {
  Logger as AxiomLogger,
  LogLevel as AxiomLogLevel,
} from "next-axiom/dist/logger";

type LogLevel = "debug" | "info" | "warn" | "error";

export type Logger = Record<
  LogLevel,
  (message: string, meta?: Record<string, any>) => void
>;

function getAxiomLogLevel(logLevel: LogLevel): AxiomLogLevel {
  switch (logLevel) {
    case "debug":
      return AxiomLogLevel.debug;
    case "info":
      return AxiomLogLevel.info;
    case "warn":
      return AxiomLogLevel.warn;
    case "error":
      return AxiomLogLevel.error;
    default:
      throw new Error("Invalid log level");
  }
}

export function withLoggerForNextConfig(nextConfig: NextConfig) {
  return withAxiom(nextConfig);
}

/**
 * Make sure that this is being used in a next js app that has been wrapped with {@link withLoggerForNextConfig}.
 * @param args Args to instantiate the logger with
 * @returns a logger
 */
export function useLogger(args: {
  meta: Record<string, any>;
  defaultLogLevel: LogLevel;
}): Logger {
  const logger = useAxiomLogger({
    args: args.meta,
    logLevel: getAxiomLogLevel(args.defaultLogLevel),
  });

  return {
    debug: logger.debug,
    info: logger.info,
    warn: logger.warn,
    error: logger.error,
  };
}

export function getServerLogger(
  req: Request,
  meta?: Record<string, any>,
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

  return {
    debug: logger.debug,
    info: logger.info,
    warn: logger.warn,
    error: logger.error,
  };
}
