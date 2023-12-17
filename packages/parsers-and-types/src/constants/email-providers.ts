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

// ! The following few variables and types regarding composing and replying should be kept in sync
export const COMPOSE_MESSAGE_OPTIONS = [
  "reply-sender",
  "reply-all",
  "forward",
  "new-email",
  "none",
] as const;
export type AllComposeMessageOptionsType =
  (typeof COMPOSE_MESSAGE_OPTIONS)[number];
export type ValidReplyMessageOptionsType =
  | "reply-sender"
  | "reply-all"
  | "forward";
export type ValidComposeMessageOptionsType = "new-email";
