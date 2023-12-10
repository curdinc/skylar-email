import type { SupportedEmailProviderType } from "@skylar/parsers-and-types";

export const TrackingEvents = {
  connectProviderButtonClicked: "connect_provider_button_clicked",
  connectedProvider: "connected_provider",
  syncStarted: "sync_started",
  syncCompleted: "sync_completed",
  speedUpClicked: "speed_up_clicked",
} as const;

export type TrackingEventProperties = {
  [TrackingEvents.connectProviderButtonClicked]: Record<string, never>; // no properties
  [TrackingEvents.connectedProvider]: {
    type: SupportedEmailProviderType;
    emailAddress: string;
  };
  [TrackingEvents.syncStarted]: Record<string, never>;
  [TrackingEvents.syncCompleted]: Record<string, never>;
  [TrackingEvents.speedUpClicked]: Record<string, never>;
};
