import type { ThreadType } from "@skylar/client-db/schema/thread";

export const EMAIL_PROVIDER_LABELS = {
  GMAIL: {
    UNREAD: "UNREAD",
    INBOX: "INBOX",
    STARRED: "STARRED",
    SENT: "SENT",
    DRAFT: "DRAFT",
    TRASH: "TRASH",
    SPAM: "SPAM",
    IMPORTANT: "IMPORTANT",
    CATEGORY_PERSONAL: "CATEGORY_PERSONAL",
    CATEGORY_SOCIAL: "CATEGORY_SOCIAL",
    CATEGORY_PROMOTIONS: "CATEGORY_PROMOTIONS",
  },
} as const;
export const EMAIL_PROVIDER_LABELS_ARRAY = Object.values(
  EMAIL_PROVIDER_LABELS,
).flatMap((labels) => Object.values(labels));

export const isThreadUnread = (thread: ThreadType) => {
  return thread.email_provider_labels.includes(
    EMAIL_PROVIDER_LABELS.GMAIL.UNREAD,
  );
};
