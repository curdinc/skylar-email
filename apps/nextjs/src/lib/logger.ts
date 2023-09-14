"use client";

import { useLogger as useAxiomLogger } from "next-axiom";
import { LogLevel as AxiomLogLevel } from "next-axiom/dist/logger";

import type { Logger, LogLevel } from "@skylar/logger";
import { axiomLoggerToLogger } from "@skylar/logger";

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

/**
 * Make sure that this is being used in a next js app that has been wrapped with {@link withLoggerForNextConfig}.
 * @param args Args to instantiate the logger with
 * @returns a logger
 */
export function useLogger(args?: {
  meta?: Record<string, unknown>;
  defaultLogLevel?: LogLevel;
}): Logger {
  const logger = useAxiomLogger({
    args: args?.meta,
    logLevel: args?.defaultLogLevel
      ? getAxiomLogLevel(args?.defaultLogLevel)
      : undefined,
  });

  return axiomLoggerToLogger(logger);
}
