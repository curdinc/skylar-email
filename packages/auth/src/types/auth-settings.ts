export type PathType = {
  path: string;
  queryParams?: URLSearchParams;
};

export type AuthSettingServerType =
  | {
      guardByDefault?: true;
      onUnauthenticatedRedirectTo?:
        | PathType
        | ((
            currentRoute: string,
            queryParams: URLSearchParams,
          ) => Promise<PathType> | PathType);
    }
  | {
      guardByDefault?: false;
      onAuthenticatedRedirectTo?:
        | PathType
        | ((
            currentRoute: string,
            queryParams: URLSearchParams,
          ) => Promise<PathType> | PathType);
    };

export type AuthSettingClientType = {
  onLoginRedirectTo?:
    | PathType
    | ((
        currentRoute: string,
        queryParams: URLSearchParams,
      ) => Promise<PathType> | PathType);
  onLogoutRedirectTo?:
    | PathType
    | ((
        currentRoute: string,
        queryParams: URLSearchParams,
      ) => Promise<PathType> | PathType);
};
