import type { Logger } from "@skylar/logger";
import type {
  emailBodyParseResultType,
  emailMetadataParseResultType,
  emailSenderType,
  MessagePartType,
} from "@skylar/parsers-and-types";

// parses "email", "<email>", "firstname lastname <email>"
function parseEmailSenderValue(value: string) {
  const stripStr = value.trim();
  if (stripStr.indexOf("<") < 0) {
    return {
      email: stripStr,
    };
  }
  const splitStr = stripStr.split("<");
  const firstPart = splitStr[0]!;

  const firstChar = firstPart.at(0);

  const name = firstChar == '"' ? "" : splitStr[0]?.trim();
  const email = splitStr[1]!.replace(">", "");
  return {
    name,
    email,
  };
}

export function getEmailMetadata(
  messageHeaders: { name: string; value: string }[],
): emailMetadataParseResultType {
  const emailHeaders: {
    from: emailSenderType;
    subject: string;
    inReplyTo: emailSenderType;
    bcc: emailSenderType;
    cc: emailSenderType[];
    createdAt: Date;
    deliveredTo: emailSenderType;
    replyTo: emailSenderType[];
  } = {
    from: { email: "" },
    subject: "",
    inReplyTo: { email: "" },
    bcc: { email: "" },
    cc: [],
    deliveredTo: { email: "" },
    replyTo: [],
    createdAt: new Date(),
  };

  for (const header of messageHeaders) {
    if (header.name === "Date") {
      emailHeaders.createdAt = new Date(header.value);
    }
    if (header.name === "Subject") {
      emailHeaders.subject = header.value;
    }
    if (header.name === "In-Reply-To") {
      emailHeaders.inReplyTo = parseEmailSenderValue(header.value);
    }
    if (header.name === "Bcc") {
      emailHeaders.bcc = parseEmailSenderValue(header.value);
    }
    if (header.name === "Cc") {
      emailHeaders.cc = header.value
        .split(",")
        .map((val) => parseEmailSenderValue(val));
    }
    if (header.name === "From") {
      emailHeaders.from = parseEmailSenderValue(header.value);
    }
    if (header.name === "Reply-To") {
      emailHeaders.replyTo = header.value
        .split(",")
        .map((val) => parseEmailSenderValue(val));
    }
    if (header.name === "Delivered-To") {
      emailHeaders.from = parseEmailSenderValue(header.value);
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
}): emailBodyParseResultType {
  const data: emailBodyParseResultType = {
    html: [],
    plain: [],
    attachments: [],
  };

  for (const payload of payloads) {
    if (payload.mimeType === "multipart/alternative") {
      // text/plain + text/html
      if (!payload.parts) {
        continue;
      }
      for (const part of payload.parts) {
        if (!part.body.data) {
          continue;
        }
        if (part.mimeType === "text/plain") {
          data.plain.push(part.body.data);
        } else if (part.mimeType === "text/html") {
          data.html.push(part.body.data);
        } else {
          logger.debug("unhandled multipart/alternative mimeType", {
            mimeType: payload.mimeType,
            emailId,
            mid,
          });
        }
      }
    } else if (payload.mimeType === "multipart/mixed") {
      if (!payload.parts) {
        continue;
      }
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
      if (!payload.parts) {
        continue;
      }
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
      if (!payload.parts) {
        continue;
      }
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
