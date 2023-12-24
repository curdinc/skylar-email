import type { SupportedEmailProviderType } from "@skylar/parsers-and-types";

export const TrackingEvents = {
  composeAddAttachmentButtonClicked: "compose_add_attachment_button_clicked",
  composeForwardMessage: "compose_forward_message",
  composeReplySenderMessage: "compose_reply_sender_message",
  composeReplyAllMessage: "compose_reply_all_message",
  composeNewMessage: "compose_new_message",
  composeSendMessage: "compose_send_message",
  connectProviderButtonClicked: "connect_provider_button_clicked",
  connectedProvider: "connected_provider",
  initSyncStarted: "init_sync_started",
  initSyncCompleted: "init_sync_completed",
  initSyncFailed: "init_sync_failed",
  speedUpButtonClicked: "speed_up_button_clicked",
  threadOpened: "thread_opened",
} as const;

// use Record<string, never> for the value of events with no properties
export type TrackingEventProperties = {
  [TrackingEvents.composeAddAttachmentButtonClicked]: {
    isShortcut: boolean;
  };
  [TrackingEvents.composeForwardMessage]: {
    messageConversationLength: number;
    isShortcut: boolean;
  };
  [TrackingEvents.composeReplySenderMessage]: {
    messageConversationLength: number;
    isShortcut: boolean;
  };
  [TrackingEvents.composeReplyAllMessage]: {
    messageConversationLength: number;
    isShortcut: boolean;
  };
  [TrackingEvents.composeNewMessage]: {
    isShortcut: boolean;
  };
  [TrackingEvents.composeSendMessage]: {
    wordCount: number;
    messageConversationLength: number;
    isShortcut: boolean;
  };
  [TrackingEvents.connectProviderButtonClicked]: {
    providerType: SupportedEmailProviderType;
  };
  [TrackingEvents.connectedProvider]: {
    providerType: SupportedEmailProviderType;
    emailAddress: string;
  };
  [TrackingEvents.initSyncStarted]: Record<string, never>;
  [TrackingEvents.initSyncCompleted]: {
    timeTakenInSeconds: number;
  };
  [TrackingEvents.initSyncFailed]: Record<string, never>;
  [TrackingEvents.speedUpButtonClicked]: Record<string, never>;
  [TrackingEvents.threadOpened]: Record<string, never>;
};
