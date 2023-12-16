import type { SupportedEmailProviderType } from "@skylar/parsers-and-types";

export const TrackingEvents = {
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
  [TrackingEvents.connectProviderButtonClicked]: {
    providerType: SupportedEmailProviderType;
  };
  [TrackingEvents.connectedProvider]: {
    providerType: SupportedEmailProviderType;
    emailAddress: string;
  };
  [TrackingEvents.initSyncStarted]: Record<string, never>;
  [TrackingEvents.initSyncCompleted]: Record<string, never>;
  [TrackingEvents.initSyncFailed]: Record<string, never>;
  [TrackingEvents.speedUpButtonClicked]: Record<string, never>;
  [TrackingEvents.threadOpened]: Record<string, never>;
};
