import type { Logger } from "@skylar/logger";
import type { MessagePartType } from "@skylar/parsers-and-types";

export function getEmailMetadata(
  messageHeaders: { name: string; value: string }[],
) {
  const emailHeaders = {
    from: "",
    subject: "",
    name: "",
    timestamp: new Date(),
  };

  for (const header of messageHeaders) {
    if (header.name === "Date") {
      emailHeaders.timestamp = new Date(header.value);
    }
    if (header.name === "Subject") {
      emailHeaders.subject = header.value;
    }
    if (header.name === "From") {
      const fromEmail = header.value?.match(/<(.*)>/)?.[1];
      const fromName = header.value?.split(" ")[0];
      emailHeaders.name = fromName ?? "";
      emailHeaders.from = fromEmail ?? "";
    }
  }

  return emailHeaders;
}

export function getEmailBody({
  payloads,
  mid,
  logger,
  emailId,
}: {
  payloads: MessagePartType[];
  mid: string;
  logger: Logger;
  emailId: string;
}) {
  const data: { html: string[]; plain: string[]; attachments: string[] } = {
    html: [],
    plain: [],
    attachments: [],
  };

  for (const payload of payloads) {
    if (!payload.parts) {
      continue;
    }
    if (payload.mimeType === "multipart/alternative") {
      // text/plain + text/html
      for (const part of payload.parts) {
        if (!part.body.data) {
          continue;
        }
        if (part.mimeType === "text/plain") {
          data.plain.push(part.body.data);
        } else if (part.mimeType === "text/html") {
          data.html.push(part.body.data);
        } else {
          logger.debug("unhandled mimeType", {
            emailId,
            payload,
            mid,
          });
        }
      }
    } else if (payload.mimeType === "multipart/mixed") {
      const pieces = getEmailBody({
        payloads: payload.parts,
        mid,
        logger,
        emailId,
      });
      data.attachments = data.attachments.concat(pieces.attachments);
      data.html = data.html.concat(pieces.html);
      data.plain = data.plain.concat(pieces.plain);
    } else if (payload.mimeType === "multipart/related") {
      const pieces = getEmailBody({
        payloads: payload.parts,
        mid,
        logger,
        emailId,
      });
      data.attachments = data.attachments.concat(pieces.attachments);
      data.html = data.html.concat(pieces.html);
      data.plain = data.plain.concat(pieces.plain);
    } else if (payload.mimeType === "multipart/report") {
      const pieces = getEmailBody({
        payloads: payload.parts,
        mid,
        logger,
        emailId,
      });
      data.attachments = data.attachments.concat(pieces.attachments);
      data.html = data.html.concat(pieces.html);
      data.plain = data.plain.concat(pieces.plain);
    } else if (payload.mimeType === "text/plain") {
      if (payload.body.data) {
        data.plain.push(payload.body.data);
      }
    } else if (payload.mimeType === "text/html") {
      if (payload.body.data) {
        data.html.push(payload.body.data);
      }
    } else {
      logger.debug("unhandled mimeType", {
        mimeType: payload.mimeType,
        emailId,
        mid,
      });
    }
  }
  return data;
}