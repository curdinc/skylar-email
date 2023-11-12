import { EMAIL_PROVIDER_LABELS } from "@skylar/logic";

import type { ThreadType } from "../../schema/thread";

export function filterForInbox(args: { invert: boolean } = { invert: false }) {
  return (thread: ThreadType) => {
    return [EMAIL_PROVIDER_LABELS.GMAIL.INBOX].every((label) =>
      args.invert
        ? !thread.email_provider_labels.includes(label)
        : thread.email_provider_labels.includes(label),
    );
  };
}
export function filterForUnread(args: { invert: boolean } = { invert: false }) {
  return (thread: ThreadType) => {
    return [EMAIL_PROVIDER_LABELS.GMAIL.UNREAD].every((label) =>
      args.invert
        ? !thread.email_provider_labels.includes(label)
        : thread.email_provider_labels.includes(label),
    );
  };
}

export function filterForEmails({
  emails,
  invert = false,
}: {
  invert?: boolean;
  emails: string[];
}) {
  return (thread: ThreadType) => {
    return emails.every((email) =>
      invert
        ? !(thread.user_email_address !== email)
        : thread.user_email_address === email,
    );
  };
}

export function filterForLabels(labels: string[]) {
  return (thread: ThreadType) => {
    // console.log("labels", labels);
    // console.log("thread.email_provider_labels", thread.email_provider_labels);
    return labels.every((label) =>
      thread.email_provider_labels.includes(label),
    );
  };
}
