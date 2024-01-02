export type LogLevel = "debug" | "info" | "warn" | "error";

export type Logger = Record<
  LogLevel,
  (message: string, meta?: Record<string, unknown>) => void
> & {
  addMetadata: (meta: Record<string, unknown>) => Logger;
  flush: () => Promise<void>;
};
