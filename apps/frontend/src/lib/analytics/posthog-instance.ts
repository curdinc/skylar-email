import posthog from "posthog-js";

import { env } from "~/env";

export function posthogInstance() {
  const instance = posthog;
  if (typeof window !== "undefined") {
    instance.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: window.location.origin + "/ingest",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      persistence: "localStorage",
    });
  }
  return instance;
}
