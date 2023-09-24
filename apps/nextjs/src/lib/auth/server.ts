import type { RedirectFnType } from "@skylar/auth/*";
import { REDIRECT_TO_SEARCH_STRING } from "@skylar/auth/client";

import { UNAUTHENTICATED_ROUTES } from "../config";

export const onUnauthenticatedRedirectTo: RedirectFnType = ({
  path,
  queryParams,
}) => {
  if (UNAUTHENTICATED_ROUTES.includes(path)) {
    return { path, queryParams };
  }
  const newSearchParams = new URLSearchParams();
  newSearchParams.set(
    REDIRECT_TO_SEARCH_STRING,
    `${path}?${queryParams?.toString()}`,
  );
  return {
    path:
      (queryParams?.size ?? 0) > 0
        ? `/login?${newSearchParams.toString()}`
        : `/login?redirectTo=${path}`,
  };
};
