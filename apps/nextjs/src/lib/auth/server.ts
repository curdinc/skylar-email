import type { RedirectFnType } from "@skylar/auth/*";

import { UNAUTHENTICATED_ROUTES } from "../config";

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
