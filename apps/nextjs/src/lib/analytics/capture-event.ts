import { posthogInstance } from "./posthog-instance";
import type {
  TrackingEventProperties,
  TrackingEvents,
} from "./tracking-events";

export const captureEvent = <
  T extends (typeof TrackingEvents)[keyof typeof TrackingEvents],
>({
  event,
  properties,
}: {
  event: T;
  properties: TrackingEventProperties[T];
}) => {
  posthogInstance().capture(event, properties);
};

export const identifyUser = (emailAddress: string) => {
  posthogInstance().identify(emailAddress);
};
