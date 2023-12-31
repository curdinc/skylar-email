import type { ThreadType } from "@skylar/parsers-and-types";
import { EMAIL_PROVIDER_LABELS } from "@skylar/parsers-and-types";

export function filterForInbox(args: { invert: boolean } = { invert: false }) {
  return (thread: ThreadType) => {
    return [EMAIL_PROVIDER_LABELS.GMAIL.INBOX].every((label) =>
      args.invert
        ? !thread.provider_message_labels.includes(label)
        : thread.provider_message_labels.includes(label),
    );
  };
}
export function filterForUnread(args: { invert: boolean } = { invert: false }) {
  return (thread: ThreadType) => {
    return [EMAIL_PROVIDER_LABELS.GMAIL.UNREAD].every((label) =>
      args.invert
        ? !thread.provider_message_labels.includes(label)
        : thread.provider_message_labels.includes(label),
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
    return labels.every((label) =>
      thread.provider_message_labels.includes(label),
    );
  };
}

export const isThreadUnread = (thread: ThreadType) => {
  return thread.provider_message_labels.includes(
    EMAIL_PROVIDER_LABELS.GMAIL.UNREAD,
  );
};
