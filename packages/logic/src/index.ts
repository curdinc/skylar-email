import { observable } from "@legendapp/state";

export type SupportedAuthProviders = "github" | "facebook" | "discord";

export const state$ = observable<{
  ONBOARDING: { alphaCode: string };
  LOGIN: {
    loggingInto: SupportedAuthProviders | undefined;
  };
  env: {
    NEXT_PUBLIC_BACKEND_URL: "";
    NODE_ENV: string;
    getCookieValue: (cookieName: string) => string;
    getHeaders: () => Record<string, string>;
  };
}>({
  ONBOARDING: { alphaCode: "" },
  LOGIN: { loggingInto: undefined },
  // Not used right now. Needed to make the api stuff work
  env: {
    NEXT_PUBLIC_BACKEND_URL: "",
    NODE_ENV: "",
    getCookieValue: (_cookieName: string) => "",
    getHeaders: () => ({}),
  },
});
