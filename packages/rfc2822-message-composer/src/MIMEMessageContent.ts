/* eslint-disable @typescript-eslint/no-explicit-any */
import { MIMEMessageContentHeader } from "./MIMEMessageHeader";
import type { EnvironmentContext } from "./types";

export class MIMEMessageContent {
  envctx: EnvironmentContext;
  headers;
  data;

  constructor(envctx: EnvironmentContext, data: string, headers = {}) {
    this.envctx = envctx;
    this.headers = new MIMEMessageContentHeader(this.envctx);
    this.data = data;
    this.setHeaders(headers);
  }

  dump() {
    const eol = this.envctx.eol;
    return this.headers.dump() + eol + eol + this.data;
  }

  isAttachment(): boolean {
    const disposition = this.headers.get("Content-Disposition");
    return (
      typeof disposition === "string" && disposition.includes("attachment")
    );
  }

  isInlineAttachment(): boolean {
    const disposition = this.headers.get("Content-Disposition");
    return typeof disposition === "string" && disposition.includes("inline");
  }

  setHeader(name: string, value: any) {
    this.headers.set(name, value);
    return name;
  }

  getHeader(name: string) {
    return this.headers.get(name);
  }

  setHeaders(obj: Record<string, string>) {
    return Object.keys(obj).map((prop) => this.setHeader(prop, obj[prop]));
  }

  getHeaders() {
    return this.headers.toObject();
  }
}
