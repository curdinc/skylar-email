/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Mailbox } from "./Mailbox";
import { MIMEMessageContent } from "./MIMEMessageContent";
import { MIMEMessageHeader } from "./MIMEMessageHeader";
import { MIMETextError } from "./MIMETextError";
import type {
  AttachmentOptions,
  Boundaries,
  ContentHeaders,
  ContentOptions,
  EnvironmentContext,
  MailboxAddrObject,
  MailboxAddrText,
  MailboxType,
} from "./types";

export class MIMEMessage {
  envctx: EnvironmentContext;
  headers: MIMEMessageHeader;
  boundaries: Boundaries = { mixed: "", alt: "", related: "" };
  validTypes = ["text/html", "text/plain"];
  validContentTransferEncodings = [
    "7bit",
    "8bit",
    "binary",
    "quoted-printable",
    "base64",
  ];
  messages: MIMEMessageContent[] = [];

  constructor(envctx: EnvironmentContext) {
    this.envctx = envctx;
    this.headers = new MIMEMessageHeader(this.envctx);
    this.messages = [];

    this.generateBoundaries();
  }

  asRaw() {
    const eol = this.envctx.eol;
    const lines = this.headers.dump();

    const plaintext = this.getMessageByType("text/plain");
    const html = this.getMessageByType("text/html");
    const primaryMessage = html ? html : plaintext ? plaintext : undefined;

    if (primaryMessage === undefined) {
      throw new MIMETextError(
        "MIMETEXT_MISSING_BODY",
        "No content added to the message.",
      );
    }

    const hasAttachments = this.hasAttachments();
    const hasInlineAttachments = this.hasInlineAttachments();

    const structure =
      hasInlineAttachments && hasAttachments
        ? "mixed+related"
        : hasAttachments
        ? "mixed"
        : hasInlineAttachments
        ? "related"
        : plaintext && html
        ? "alternative"
        : "";

    if (structure === "mixed+related") {
      const attachments = this.getAttachments()
        .map((a) => "--" + this.boundaries.mixed + eol + a.dump() + eol + eol)
        .join("")
        .slice(0, -1 * eol.length);
      const inlineAttachments = this.getInlineAttachments()
        .map((a) => "--" + this.boundaries.related + eol + a.dump() + eol + eol)
        .join("")
        .slice(0, -1 * eol.length);
      return (
        lines +
        eol +
        "Content-Type: multipart/mixed; boundary=" +
        this.boundaries.mixed +
        eol +
        eol +
        "--" +
        this.boundaries.mixed +
        eol +
        "Content-Type: multipart/related; boundary=" +
        this.boundaries.related +
        eol +
        eol +
        this.dumpTextContent(plaintext, html, this.boundaries.related) +
        eol +
        eol +
        inlineAttachments +
        "--" +
        this.boundaries.related +
        "--" +
        eol +
        attachments +
        "--" +
        this.boundaries.mixed +
        "--"
      );
    } else if (structure === "mixed") {
      const attachments = this.getAttachments()
        .map((a) => "--" + this.boundaries.mixed + eol + a.dump() + eol + eol)
        .join("")
        .slice(0, -1 * eol.length);
      return (
        lines +
        eol +
        "Content-Type: multipart/mixed; boundary=" +
        this.boundaries.mixed +
        eol +
        eol +
        this.dumpTextContent(plaintext, html, this.boundaries.mixed) +
        eol +
        (plaintext && html ? "" : eol) +
        attachments +
        "--" +
        this.boundaries.mixed +
        "--"
      );
    } else if (structure === "related") {
      const inlineAttachments = this.getInlineAttachments()
        .map((a) => "--" + this.boundaries.related + eol + a.dump() + eol + eol)
        .join("")
        .slice(0, -1 * eol.length);
      return (
        lines +
        eol +
        "Content-Type: multipart/related; boundary=" +
        this.boundaries.related +
        eol +
        eol +
        this.dumpTextContent(plaintext, html, this.boundaries.related) +
        eol +
        eol +
        inlineAttachments +
        "--" +
        this.boundaries.related +
        "--"
      );
    } else if (structure === "alternative") {
      return (
        lines +
        eol +
        "Content-Type: multipart/alternative; boundary=" +
        this.boundaries.alt +
        eol +
        eol +
        this.dumpTextContent(plaintext, html, this.boundaries.alt) +
        eol +
        eol +
        "--" +
        this.boundaries.alt +
        "--"
      );
    } else {
      return lines + eol + primaryMessage.dump();
    }
  }

  asEncoded() {
    return this.envctx.toBase64WebSafe(this.asRaw());
  }

  dumpTextContent(
    plaintext: MIMEMessageContent | undefined,
    html: MIMEMessageContent | undefined,
    boundary: string,
  ) {
    const eol = this.envctx.eol;
    const primaryMessage = html ? html : plaintext;

    let data = "";

    if (
      plaintext &&
      html &&
      !this.hasInlineAttachments() &&
      this.hasAttachments()
    )
      data =
        "--" +
        boundary +
        eol +
        "Content-Type: multipart/alternative; boundary=" +
        this.boundaries.alt +
        eol +
        eol +
        "--" +
        this.boundaries.alt +
        eol +
        plaintext.dump() +
        eol +
        eol +
        "--" +
        this.boundaries.alt +
        eol +
        html.dump() +
        eol +
        eol +
        "--" +
        this.boundaries.alt +
        "--";
    else if (plaintext && html && this.hasInlineAttachments())
      data = "--" + boundary + eol + html.dump();
    else if (plaintext && html)
      data =
        "--" +
        boundary +
        eol +
        plaintext.dump() +
        eol +
        eol +
        "--" +
        boundary +
        eol +
        html.dump();
    else data = "--" + boundary + eol + primaryMessage!.dump();

    return data;
  }

  hasInlineAttachments() {
    return this.messages.some((msg) => msg.isInlineAttachment());
  }

  hasAttachments(): boolean {
    return this.messages.some((msg) => msg.isAttachment());
  }

  getAttachments(): MIMEMessageContent[] | [] {
    const matcher = (msg: MIMEMessageContent) => msg.isAttachment();
    return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
  }

  getInlineAttachments(): MIMEMessageContent[] | [] {
    const matcher = (msg: MIMEMessageContent) => msg.isInlineAttachment();
    return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
  }

  getMessageByType(type: string): MIMEMessageContent | undefined {
    const matcher = (msg: MIMEMessageContent) =>
      !msg.isAttachment() &&
      !msg.isInlineAttachment() &&
      ((msg.getHeader("Content-Type") as string) || "").includes(type);
    return this.messages.some(matcher)
      ? this.messages.filter(matcher)[0]
      : undefined;
  }

  addAttachment(opts: AttachmentOptions) {
    if (!this.isObject(opts.headers)) opts.headers = {};

    if (typeof opts.filename !== "string") {
      throw new MIMETextError(
        "MIMETEXT_MISSING_FILENAME",
        "The property filename must exist while adding attachments.",
      );
    }

    let type = opts.headers["Content-Type"] || opts.contentType || "none";
    if (this.envctx.validateContentType(type) === false) {
      throw new MIMETextError(
        "MIMETEXT_INVALID_MESSAGE_TYPE",
        `You specified an invalid content type "${type}".`,
      );
    }

    const encoding =
      opts.headers["Content-Transfer-Encoding"] || opts.encoding || "base64";
    if (!this.validContentTransferEncodings.includes(encoding)) {
      type = "application/octet-stream";
    }

    const contentId = opts.headers["Content-ID"];
    if (
      typeof contentId === "string" &&
      contentId.length > 2 &&
      !contentId.startsWith("<") &&
      !contentId.endsWith(">")
    ) {
      opts.headers["Content-ID"] = "<" + opts.headers["Content-ID"] + ">";
    }

    const disposition = opts.inline ? "inline" : "attachment";

    opts.headers = Object.assign({}, opts.headers, {
      "Content-Type": `${type}; name="${opts.filename}"`,
      "Content-Transfer-Encoding": encoding,
      "Content-Disposition": `${disposition}; filename="${opts.filename}"`,
    });

    return this._addMessage({ data: opts.data, headers: opts.headers });
  }

  addMessage(opts: ContentOptions) {
    if (!this.isObject(opts.headers)) opts.headers = {};

    let type = opts.headers["Content-Type"] || opts.contentType || "none";
    if (!this.validTypes.includes(type)) {
      throw new MIMETextError(
        "MIMETEXT_INVALID_MESSAGE_TYPE",
        `Valid content types are ${this.validTypes.join(
          ", ",
        )} but you specified "${type}".`,
      );
    }

    const encoding =
      opts.headers["Content-Transfer-Encoding"] || opts.encoding || "7bit";
    if (!this.validContentTransferEncodings.includes(encoding)) {
      type = "application/octet-stream";
    }

    const charset = opts.charset || "UTF-8";

    opts.headers = Object.assign({}, opts.headers, {
      "Content-Type": `${type}; charset=${charset}`,
      "Content-Transfer-Encoding": encoding,
    });

    return this._addMessage({ data: opts.data, headers: opts.headers });
  }

  private _addMessage(opts: { data: string; headers: ContentHeaders }) {
    const msg = new MIMEMessageContent(this.envctx, opts.data, opts.headers);

    this.messages.push(msg);

    return msg;
  }

  setSender(
    input: MailboxAddrObject | MailboxAddrText,
    config: { type: MailboxType } = { type: "From" },
  ) {
    const mailbox = new Mailbox(input, config);
    this.setHeader("From", mailbox);
    return mailbox;
  }

  getSender(): Mailbox | undefined {
    return this.getHeader("From") as Mailbox | undefined;
  }

  setRecipients(
    input:
      | MailboxAddrObject
      | MailboxAddrText
      | MailboxAddrObject[]
      | MailboxAddrText[],
    config: { type: MailboxType } = { type: "To" },
  ) {
    const arr = !this.isArray(input) ? [input] : input;
    const recs = arr.map((_input) => new Mailbox(_input, config));
    this.setHeader(config.type, recs);
    return recs;
  }

  getRecipients(
    config: { type: MailboxType } = { type: "To" },
  ): Mailbox | Mailbox[] | undefined {
    return this.getHeader(config.type) as Mailbox | Mailbox[] | undefined;
  }

  setRecipient(
    input:
      | MailboxAddrObject
      | MailboxAddrText
      | MailboxAddrObject[]
      | MailboxAddrText[],
  ) {
    return this.setRecipients(input, { type: "To" });
  }

  setTo(
    input:
      | MailboxAddrObject
      | MailboxAddrText
      | MailboxAddrObject[]
      | MailboxAddrText[],
  ) {
    return this.setRecipients(input, { type: "To" });
  }

  setCc(
    input:
      | MailboxAddrObject
      | MailboxAddrText
      | MailboxAddrObject[]
      | MailboxAddrText[],
  ) {
    return this.setRecipients(input, { type: "Cc" });
  }

  setBcc(
    input:
      | MailboxAddrObject
      | MailboxAddrText
      | MailboxAddrObject[]
      | MailboxAddrText[],
  ) {
    return this.setRecipients(input, { type: "Bcc" });
  }

  setSubject(value: string) {
    this.setHeader("subject", value);
    return value;
  }

  getSubject() {
    return this.getHeader("subject");
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

  toBase64(v: string): string {
    return this.envctx.toBase64(v);
  }

  toBase64WebSafe(v: string): string {
    return this.envctx.toBase64WebSafe(v);
  }

  generateBoundaries() {
    this.boundaries = {
      mixed: Math.random().toString(36).slice(2),
      alt: Math.random().toString(36).slice(2),
      related: Math.random().toString(36).slice(2),
    };
  }

  isArray(v: unknown): v is any[] {
    return !!v && v.constructor === Array;
  }

  isObject(v: unknown): v is object {
    return !!v && v.constructor === Object;
  }
}
