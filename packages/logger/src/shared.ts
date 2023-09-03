import type { Logger as AxiomLogger } from "next-axiom";

import type { Logger } from "./types";

export function axiomLoggerToLogger(logger: AxiomLogger): Logger {
  return {
    debug: (message, args) => {
      if (process.env.NODE_ENV === "development") {
        args
          ? console.log(`[DEBUG]: ${message}`, args)
          : console.log(`[DEBUG]: ${message}`);
      }
      logger.debug(message, args);
    },
    info: (message, args) => {
      if (process.env.NODE_ENV === "development") {
        args
          ? console.log(`[INFO]: ${message}`, args)
          : console.log(`[INFO]: ${message}`);
      } else {
        logger.info(message, args);
      }
    },
    warn: (message, args) => {
      if (process.env.NODE_ENV === "development") {
        args
          ? console.warn(`[WARN]: ${message}`, args)
          : console.warn(`[DEBUG]: ${message}`);
      }
      logger.warn(message, args);
    },
    error: (message, args) => {
      if (process.env.NODE_ENV === "development") {
        args
          ? console.error(`[ERROR]: ${message}`, args)
          : console.error(`[ERROR]: ${message}`);
      }
      logger.error(message, args);
    },
  };
}
