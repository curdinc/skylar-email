export type PathType = {
  path: string;
  queryParams?: URLSearchParams;
};

export type AuthSettingServerType =
  | {
      guardByDefault?: true;
      onUnauthenticatedRedirectTo?:
        | PathType
        | ((path: PathType) => Promise<PathType> | PathType);
    }
  | {
      guardByDefault?: false;
      onAuthenticatedRedirectTo?:
        | PathType
        | ((path: PathType) => Promise<PathType> | PathType);
    };

export type AuthSettingClientType = {
  onLogin: (path: PathType) => void | Promise<void>;
  onLoginRedirectTo?:
    | PathType
    | ((path: PathType) => Promise<PathType> | PathType);
  onLogout: (path: PathType) => void | Promise<void>;
  onLogoutRedirectTo?:
    | PathType
    | ((path: PathType) => Promise<PathType> | PathType);
};
