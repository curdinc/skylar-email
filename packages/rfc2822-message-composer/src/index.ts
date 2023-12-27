import * as mime from "mime-types";

import { MIMEMessage } from "./MIMEMessage";

const envctx = {
  toBase64: function toBase64(data: string) {
    return Buffer.from(data).toString("base64");
  },
  toBase64WebSafe: function toBase64WebSafe(data: string) {
    return Buffer.from(data)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  },
  eol: "\n",
  validateContentType: (v: string): string | false => {
    return mime.contentType(v);
  },
};

export function createMimeMessage() {
  return new MIMEMessage(envctx);
}
