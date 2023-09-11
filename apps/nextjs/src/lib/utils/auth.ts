import type { RedirectFnType } from "@skylar/auth/*";
import { UserType } from "@skylar/schema";

import { UNAUTHENTICATED_ROUTES } from "./config";

export const onUnauthenticatedRedirectTo: RedirectFnType = ({
  path,
  queryParams,
}) => {
  if (UNAUTHENTICATED_ROUTES.includes(path)) {
    return { path, queryParams };
  }
  const newSearchParams = new URLSearchParams();
  newSearchParams.set("redirectTo", `${path}?${queryParams?.toString()}`);
  return {
    path:
      (queryParams?.size ?? 0) > 0
        ? `/login?${newSearchParams.toString()}`
        : `/login?redirectTo=${path}`,
  };
};

export const onLogoutRedirectTo: RedirectFnType = ({ path, queryParams }) => {
  const newSearchParams = new URLSearchParams();
  if (queryParams) {
    newSearchParams.set("redirectTo", `${path}?${queryParams.toString()}`);
  } else {
    newSearchParams.set("redirectTo", path);
  }
  return {
    path: `/login?${newSearchParams.toString()}`,
  };
};

export const onUserLogin = async (user: UserType) => {
  console.log("user", user);
  // TODO: Initiate new user if needed and redirect to onboarding
  return Promise.resolve();
};
