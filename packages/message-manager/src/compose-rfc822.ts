import { createMimeMessage } from "mimetext";

import type { EmailConfigType } from "@skylar/parsers-and-types";

export function composeRfc822Message(emailConfig: EmailConfigType) {
  if (
    emailConfig.replyConfig &&
    emailConfig.replyConfig.rootSubject !== emailConfig.subject
  ) {
    throw new Error("Reply subject does not match subject.");
  }

  const msg = createMimeMessage();

  if (emailConfig.replyConfig) {
    msg.setHeader("In-Reply-To", emailConfig.replyConfig.inReplyToRfcMessageId);
    msg.setHeader("References", emailConfig.replyConfig.references.join(" "));
  }
  msg.setSender({
    name: emailConfig.from.name,
    addr: emailConfig.from.emailAddress,
  });
  msg.setRecipient(emailConfig.to);
  msg.setSubject(emailConfig.subject);
  if (emailConfig.text) {
    msg.addMessage({
      contentType: "text/plain",
      data: emailConfig.text,
    });
  }
  if (emailConfig.html) {
    // specify inline attachment's content id inside img src tag. <img src="cid:[ID]">
    msg.addMessage({
      contentType: "text/html",
      data: emailConfig.html,
    });
  }
  if (emailConfig.bcc) {
    msg.setBcc(emailConfig.bcc);
  }
  if (emailConfig.cc) {
    msg.setCc(emailConfig.cc);
  }
  // add attachments
  emailConfig.attachments.map((a) => {
    msg.addAttachment({
      ...a,
    });
  });
  return msg.asEncoded();
}
