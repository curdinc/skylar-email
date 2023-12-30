export const SHORTCUT_KEYMAP_INFO = {
  "message.delete": {
    combo: "Delete",
    description: "Delete a given item in the list",
    label: "message.delete",
  },
  "message.mark-as-done": {
    combo: "e",
    description: "Mark a given item in the list as done",
    label: "message.mark-as-done",
  },
  "message.mark-as-read": {
    combo: "Shift+U",
    description: "Mark a given item in the list as read",
    label: "message.mark-as-read",
  },
  "message.mark-as-unread": {
    combo: "u",
    description: "Mark a given item in the list as unread",
    label: "message.mark-as-unread",
  },
  "message.down": {
    combo: "j",
    description: "Go down the message list",
    label: "message.down",
  },
  "message.down-alt": {
    combo: "ArrowDown",
    description: "Go down the next message list",
    label: "message.down-alt",
  },
  "message.up": {
    combo: "k",
    description: "Go to up the message list",
    label: "message.up",
  },
  "message.up-alt": {
    combo: "ArrowUp",
    description: "Go to up the message list",
    label: "message.up-alt",
  },
  "message.previous-label": {
    combo: "h",
    description: "Close current label or go previous label",
    label: "message.previous-label",
  },
  "message.previous-label-alt": {
    combo: "ArrowLeft",
    description: "Close current label or go previous label",
    label: "message.previous-label-alt",
  },
  "message.next-label": {
    combo: "l",
    description: "Open current label or go next label",
    label: "message.next-label",
  },
  "message.next-label-alt": {
    combo: "ArrowRight",
    description: "Open current label or go next label",
    label: "message.next-label-alt",
  },
  "message.compose": {
    combo: "c",
    description: "Compose new message",
    label: "message.compose",
  },
  "message.forward": {
    combo: "f",
    description: "Forward message",
    label: "message.forward",
  },
  "message.reply-all": {
    combo: "r",
    description: "Reply to everyone on the message",
    label: "message.reply-all",
  },
  "message.reply-sender": {
    combo: "Shift+R",
    description: "Reply to the sender of the message",
    label: "message.reply-sender",
  },
} as const;
