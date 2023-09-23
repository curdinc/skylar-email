import type { RedirectFnType } from "@skylar/auth";

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
