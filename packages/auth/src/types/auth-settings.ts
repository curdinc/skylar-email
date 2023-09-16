import type { UserType } from "@skylar/parsers-and-types";

export type PathType = {
  path: string;
  queryParams?: URLSearchParams;
};

export type RedirectFnType = (path: PathType) => Promise<PathType> | PathType;

export type AuthSettingServerType =
  | {
      guardByDefault?: true;
      onUnauthenticatedRedirectTo?: PathType | RedirectFnType;
    }
  | {
      guardByDefault?: false;
      onAuthenticatedRedirectTo?: PathType | RedirectFnType;
    };

export type AuthSettingClientType = {
  onLogin: (user: UserType) => void | Promise<void>;
  onLoginRedirectTo?: PathType | RedirectFnType;
  onLogout: () => void | Promise<void>;
  onLogoutRedirectTo?: PathType | RedirectFnType;
};
