const GMAIL_SCOPES =
  "https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/contacts" as const;

// TODO: maybe use a better way - the worker does not have access to the window object
export const hasGrantedGoogleGrantedScopes = (grantedScopes: string) => {
  const EXPECTED_SCOPES_GOOGLE = GMAIL_SCOPES.split(" ");
  const grantedScopesArray = grantedScopes.split(" ");
  const isGranted = !EXPECTED_SCOPES_GOOGLE.some(
    (scope) => grantedScopesArray.indexOf(scope) === -1,
  );
  return isGranted;
};
