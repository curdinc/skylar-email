import type { RedirectFnType } from "@skylar/auth";
import { REDIRECT_TO_SEARCH_STRING } from "@skylar/auth/client";

export const onLogoutRedirectTo: RedirectFnType = ({ path, queryParams }) => {
  const newSearchParams = new URLSearchParams();
  if (queryParams) {
    newSearchParams.set(
      REDIRECT_TO_SEARCH_STRING,
      `${path}?${queryParams.toString()}`,
    );
  } else {
    newSearchParams.set(REDIRECT_TO_SEARCH_STRING, path);
  }
  return {
    path: `/login?${newSearchParams.toString()}`,
  };
};
