import { Axiom } from "@axiomhq/js";
import type { LogEvent, LoggerConfig } from "next-axiom/dist/logger";
import { LogLevel } from "next-axiom/dist/logger";

import type { Logger } from "./types";

export function getServerLogger({
  token,
  dataset,
  req,
  meta,
}: {
  token: string;
  dataset: string;
  req: Request;
  meta?: Record<string, unknown>;
}): Logger {
  const report = {
    startTime: new Date().getTime(),
    path: req.url,
    method: req.method,
    host: req.headers.get("host"),
    userAgent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  };
  const logger = new AxiomLogger({
    token,
    dataset,
    config: {
      req: report,
      source: "server",
      args: meta,
    },
  });

  return logger;
}

class AxiomLogger {
  private config;
  private axiom;
  private dataset;
  private token;
  constructor({
    token,
    dataset,
    config,
  }: {
    token: string;
    dataset: string;
    config: LoggerConfig;
  }) {
    this.config = config;
    this.dataset = dataset;
    this.token = token;
    this.axiom = new Axiom({
      token,
    });
  }

  debug = (message: string, args: Record<string, unknown> = {}) => {
    this._log(LogLevel.debug, message, args);
  };
  info = (message: string, args: Record<string, unknown> = {}) => {
    this._log(LogLevel.info, message, args);
  };
  warn = (message: string, args: Record<string, unknown> = {}) => {
    this._log(LogLevel.warn, message, args);
  };
  error = (message: string, args: Record<string, unknown> = {}) => {
    this._log(LogLevel.error, message, args);
  };

  _log = (
    level: LogLevel,
    message: string,
    args: Record<string, unknown> = {},
  ) => {
    const logEvent: LogEvent = {
      level: LogLevel[level].toString(),
      message,
      _time: new Date(Date.now()).toISOString(),
      fields: this.config.args ?? {},
    };
    // check if passed args is an object, if its not an object, add it to fields.args
    if (args instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      logEvent.fields = {
        ...logEvent.fields,
        message: args.message,
        stack: args.stack,
        name: args.name,
      };
    } else if (
      typeof args === "object" &&
      args !== null &&
      Object.keys(args).length > 0
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedArgs = JSON.parse(
        JSON.stringify(args, (_key: string, value: unknown) => {
          if (value instanceof Error) {
            return {
              // Pull all enumerable properties, supporting properties on custom Errors
              ...value,
              // Explicitly pull Error's non-enumerable properties
              name: value.name,
              message: value.message,
              stack: value.stack,
            };
          }

          return value;
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      logEvent.fields = { ...logEvent.fields, ...parsedArgs };
    } else if (args?.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      logEvent.fields = { ...logEvent.fields, args: args };
    }
    this.axiom.ingest(this.dataset, logEvent);
  };

  flush = async () => {
    await this.axiom.flush();
  };

  addMetadata = (meta: Record<string, unknown>) => {
    const config = { ...this.config, args: { ...this.config.args, ...meta } };

    return new AxiomLogger({
      config: config,
      token: this.token,
      dataset: this.dataset,
    });
  };
}
