import { Axiom } from "@axiomhq/js";

import type { Logger } from "./types";

export function getServerLogger({
  token,
  dataset,
  url,
  orgId,
  req,
  meta,
}: {
  token: string;
  dataset: string;
  url: string;
  orgId: string;
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
    orgId,
    url,
    config: {
      req: report,
      source: "server",
      args: meta,
    },
  });

  return logger;
}

enum AxiomLogLevel {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
  off = 100,
}
export type RequestReport = {
  startTime: number;
  statusCode?: number;
  ip?: string | null;
  region?: string | null;
  path: string;
  host?: string | null;
  method: string;
  userAgent?: string | null;
};

export type LogEvent = {
  level: string;
  message: string;
  fields: Record<string, unknown>;
  _time: string;
  request?: RequestReport;
};

export type LoggerConfig = {
  args?: Record<string, unknown>;
  logLevel?: AxiomLogLevel;
  autoFlush?: boolean;
  source?: string;
  req?: RequestReport;
};

class AxiomLogger {
  private config;
  private axiom;
  private dataset;
  private token;
  private url;
  private orgId;
  constructor({
    token,
    dataset,
    orgId,
    url,
    config,
  }: {
    token: string;
    dataset: string;
    url: string;
    orgId: string;
    config: LoggerConfig;
  }) {
    this.config = config;
    this.dataset = dataset;
    this.token = token;
    this.url = url;
    this.orgId = orgId;
    this.axiom = new Axiom({
      token,
      orgId,
      url,
    });
  }

  debug = (message: string, args: Record<string, unknown> = {}) => {
    this._log(AxiomLogLevel.debug, message, args);
  };
  info = (message: string, args: Record<string, unknown> = {}) => {
    this._log(AxiomLogLevel.info, message, args);
  };
  warn = (message: string, args: Record<string, unknown> = {}) => {
    this._log(AxiomLogLevel.warn, message, args);
  };
  error = (message: string, args: Record<string, unknown> = {}) => {
    this._log(AxiomLogLevel.error, message, args);
  };

  _log = (
    level: AxiomLogLevel,
    message: string,
    args: Record<string, unknown> = {},
  ) => {
    const logEvent: LogEvent = {
      level: AxiomLogLevel[level].toString(),
      message,
      _time: new Date(Date.now()).toISOString(),
      fields: this.config.args ?? {},
      request: this.config.req,
    };
    // check if passed args is an object, if its not an object, add it to fields.args
    if (args instanceof Error) {
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
      logEvent.fields = { ...logEvent.fields, args: args };
    }

    switch (level) {
      case AxiomLogLevel.debug:
        console.debug(
          "[DEBUG]: ",
          logEvent.message,
          // "\nfields",
          // JSON.stringify(logEvent.fields, null, 2),
        );
        break;
      case AxiomLogLevel.info:
        console.info(
          "[INFO]: ",
          logEvent.message,
          // "\nfields",
          // JSON.stringify(logEvent.fields, null, 2),
        );
        break;
      case AxiomLogLevel.warn:
        console.warn(
          "[WARN]: ",
          logEvent.message,
          // "\nfields",
          // JSON.stringify(logEvent.fields, null, 2),
        );
        break;
      case AxiomLogLevel.error:
        console.error(
          "[ERROR]: ",
          logEvent.message,
          // JSON.stringify(logEvent.fields, null, 2),
        );
        break;
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
      orgId: this.orgId,
      url: this.url,
    });
  };
}
