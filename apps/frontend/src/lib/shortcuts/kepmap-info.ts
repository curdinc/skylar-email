export const SHORTCUT_KEYMAP_INFO = {
  "message.delete": {
    combo: "Delete",
    description: "Delete a given item in the list",
    label: "message.delete",
    actionId: "message.delete",
  },
  "message.mark-as-done": {
    combo: "e",
    description: "Mark a given item in the list as done",
    label: "message.mark-as-done",
    actionId: "message.mark-as-done",
  },
  "message.mark-as-read": {
    combo: "Shift+U",
    description: "Mark a given item in the list as read",
    label: "message.mark-as-read",
    actionId: "message.mark-as-read",
  },
  "message.mark-as-unread": {
    combo: "u",
    description: "Mark a given item in the list as unread",
    label: "message.mark-as-unread",
    actionId: "message.mark-as-unread",
  },
  "message.down": {
    combo: "j",
    description: "Go down the message list",
    label: "message.down",
    actionId: "message.down",
  },
  "message.down-alt": {
    combo: "ArrowDown",
    description: "Go down the next message list",
    label: "message.down-alt",
    actionId: "message.down",
  },
  "message.up": {
    combo: "k",
    description: "Go to up the message list",
    label: "message.up",
    actionId: "message.up",
  },
  "message.up-alt": {
    combo: "ArrowUp",
    description: "Go to up the message list",
    label: "message.up-alt",
    actionId: "message.up",
  },
  "message.previous-label": {
    combo: "h",
    description: "Close current label or go previous label",
    label: "message.previous-label",
    actionId: "message.previous-label",
  },
  "message.previous-label-alt": {
    combo: "ArrowLeft",
    description: "Close current label or go previous label",
    label: "message.previous-label-alt",
    actionId: "message.previous-label",
  },
  "message.next-label": {
    combo: "l",
    description: "Open current label or go next label",
    label: "message.next-label",
    actionId: "message.next-label",
  },
  "message.next-label-alt": {
    combo: "ArrowRight",
    description: "Open current label or go next label",
    label: "message.next-label-alt",
    actionId: "message.next-label",
  },
  "message.compose": {
    combo: "c",
    description: "Compose new message",
    label: "message.compose",
    actionId: "message.compose",
  },
  "message.forward": {
    combo: "f",
    description: "Forward message",
    label: "message.forward",
    actionId: "message.forward",
  },
  "message.reply-all": {
    combo: "r",
    description: "Reply to everyone on the message",
    label: "message.reply-all",
    actionId: "message.reply-all",
  },
  "message.reply-sender": {
    combo: "Shift+R",
    description: "Reply to the sender of the message",
    label: "message.reply-sender",
    actionId: "message.reply-sender",
  },
} as const;
