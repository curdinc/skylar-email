const ROUTE_ONBOARDING = "/onboarding";
export const ROUTE_ONBOARDING_CONNECT = (
  queries:
    | { type: "initialConnection" }
    | { type: "missingScopes"; email: string },
) => `${ROUTE_ONBOARDING}/connect?${new URLSearchParams(queries).toString()}`;
export const ROUTE_ONBOARDING_SYNC = `${ROUTE_ONBOARDING}/sync`;

export const ROUTE_HOME = "/";
export const ROUTE_EMAIL_PROVIDER_INBOX = (index: number) => `/${index}`;
export const ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX = 1;
