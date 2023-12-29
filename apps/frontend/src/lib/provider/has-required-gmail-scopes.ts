import { hasGrantedAllScopesGoogle } from "@react-oauth/google";

import { GMAIL_SCOPES } from "../config";

export const hasRequiredGmailScopes = (emailProviderInfo: {
  accessToken: string;
  scope: string;
  expiresIn: number;
  tokenType: string;
}) => {
  const scopes = GMAIL_SCOPES.split(" ");
  const hasGrantedGoogleGrantedScopes = hasGrantedAllScopesGoogle(
    {
      access_token: emailProviderInfo.accessToken,
      scope: emailProviderInfo.scope,
      expires_in: emailProviderInfo.expiresIn,
      prompt: "select_account",
      token_type: emailProviderInfo.tokenType,
    },
    scopes[0] ?? "",
    ...scopes.slice(1),
  );
  return hasGrantedGoogleGrantedScopes;
};
