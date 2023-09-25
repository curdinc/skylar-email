import type { Logger } from "@skylar/logger";
import type {
  emailBodyParseResultType,
  emailMetadataParseResultType,
  emailSenderType,
  MessageResponseType,
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

// Found at https://stackoverflow.com/questions/37445865/where-to-find-body-of-email-depending-of-mimetype
export function getEmailBody({
  messageResponse,
  mid,
  logger,
  emailId,
}: {
  messageResponse: MessageResponseType;
  mid: string;
  logger: Logger;
  emailId: string;
}) {
  const result: emailBodyParseResultType = {
    plain: [],
    html: [],
    attachments: [],
  };

  let parts = [messageResponse.payload];

  while (parts.length) {
    const part = parts.shift();
    if (!part) {
      continue;
    }

    if (part.parts) {
      parts = parts.concat(part.parts);
    } else if (part.mimeType === "text/plain") {
      result.plain.push(part.body.data ?? "");
    } else if (part.mimeType === "text/html") {
      result.html.push(part.body.data ?? "");
    } else if (part.body.attachmentId) {
      result.attachments.push({
        partId: part.partId,
        mimeType: part.mimeType,
        filename: part.filename,
        body: part.body,
      });
    } else {
      logger.debug("unhandled mimeType", {
        mimeType: part.mimeType,
        emailId,
        mid,
      });
    }
  }

  return result;
}
