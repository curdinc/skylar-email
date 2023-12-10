import type {
  emailBodyParseResultType,
  emailMetadataParseResultType,
  EmailSenderType,
  MessageResponseType,
} from "@skylar/parsers-and-types";

// parses "email", "<email>", "firstname lastname <email>"
function parseEmailSenderValue(value: string): EmailSenderType {
  const stripStr = value.trim();
  if (stripStr.indexOf("<") < 0) {
    return {
      emailAddress: stripStr,
    };
  }
  const splitStr = stripStr.split("<");
  const firstPart = splitStr[0]!;

  const firstChar = firstPart.at(0);

  const name = firstChar == '"' ? "" : splitStr[0]?.trim();
  const emailAddress = splitStr[1]!.replace(">", "");
  return {
    name,
    emailAddress,
  };
}

export function getEmailMetadata(
  messageHeaders: { name: string; value: string }[],
): emailMetadataParseResultType {
  const emailHeaders: {
    from: EmailSenderType;
    subject: string;
    inReplyTo: EmailSenderType;
    bcc: EmailSenderType;
    cc: EmailSenderType[];
    createdAt: Date;
    deliveredTo: EmailSenderType[];
    replyTo: EmailSenderType[];
    rfc822MessageId: string;
    to: EmailSenderType[];
  } = {
    from: { emailAddress: "" },
    subject: "",
    inReplyTo: { emailAddress: "" },
    bcc: { emailAddress: "" },
    cc: [],
    deliveredTo: [],
    replyTo: [],
    createdAt: new Date(),
    rfc822MessageId: "",
    to: [],
  };

  for (const header of messageHeaders) {
    if (header.name.toLowerCase() === "Date".toLowerCase()) {
      emailHeaders.createdAt = new Date(header.value);
    }
    if (header.name.toLowerCase() === "Subject".toLowerCase()) {
      emailHeaders.subject = header.value;
    }
    if (header.name.toLowerCase() === "In-Reply-To".toLowerCase()) {
      emailHeaders.inReplyTo = parseEmailSenderValue(header.value);
    }
    if (header.name.toLowerCase() === "Bcc".toLowerCase()) {
      emailHeaders.bcc = parseEmailSenderValue(header.value);
    }
    if (header.name.toLowerCase() === "Cc".toLowerCase()) {
      emailHeaders.cc = header.value
        .split(",")
        .map((val) => parseEmailSenderValue(val));
    }
    if (header.name.toLowerCase() === "From".toLowerCase()) {
      emailHeaders.from = parseEmailSenderValue(header.value);
    }
    if (header.name.toLowerCase() === "Reply-To".toLowerCase()) {
      emailHeaders.replyTo = header.value
        .split(",")
        .map((val) => parseEmailSenderValue(val));
    }
    if (header.name.toLowerCase() === "Delivered-To".toLowerCase()) {
      emailHeaders.deliveredTo = header.value
        .split(",")
        .map((val) => parseEmailSenderValue(val));
    }
    if (header.name.toLowerCase() === "To".toLowerCase()) {
      emailHeaders.to = header.value
        .split(",")
        .map((val) => parseEmailSenderValue(val));
    }
    if (header.name.toLowerCase() === "Message-ID".toLowerCase()) {
      emailHeaders.rfc822MessageId = header.value;
    }
  }

  return emailHeaders;
}

// Found at https://stackoverflow.com/questions/37445865/where-to-find-body-of-email-depending-of-mimetype
export function getEmailBody({
  messageResponse,
  emailProviderMessageId,
  emailId,
  onError,
}: {
  messageResponse: MessageResponseType;
  emailProviderMessageId: string;
  emailId: string;
  onError?: (error: Error) => void;
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
      const attachmentId = part.body.attachmentId;
      result.attachments.push({
        partId: part.partId,
        mimeType: part.mimeType,
        filename: part.filename,
        body: { ...part.body, attachmentId },
      });
    } else {
      onError?.(
        new Error("unhandled mimeType", {
          cause: {
            mimeType: part.mimeType,
            emailId,
            emailProviderMessageId,
          },
        }),
      );
    }
  }

  return result;
}
