import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  REDIRECT_TO_SEARCH_STRING,
  useLoginWithDiscord,
  useLoginWithFacebook,
  useLoginWithGithub,
} from "@skylar/auth/client";
import { setLoggingInto, useGlobalStore } from "@skylar/logic";
import type { SupportedAuthProvidersType } from "@skylar/parsers-and-types";

export const useLogin = () => {
  const params = useSearchParams();
  const redirectToPath = params.get(REDIRECT_TO_SEARCH_STRING) ?? "/inbox";
  const [redirectTo, setRedirectTo] = useState(redirectToPath);
  const loggingInto = useGlobalStore((state) => state.LOGIN.loggingInto);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set(REDIRECT_TO_SEARCH_STRING, redirectToPath);
    setRedirectTo(
      new URL(
        `/login/post-auth?${urlSearchParams.toString()}`,
        window.location.origin,
      ).href,
    );
  }, [redirectToPath]);

  const signInWithGithub = useLoginWithGithub({
    redirectTo,
  });
  const signInWithDiscord = useLoginWithDiscord({
    redirectTo,
  });
  const signInWithFacebook = useLoginWithFacebook({
    redirectTo,
  });

  const onClickOauthLogin = (
    provider: SupportedAuthProvidersType,
    oauthLogin: () => Promise<void>,
  ) => {
    return async () => {
      setLoggingInto(provider);
      await oauthLogin();
    };
  };

  return {
    loggingInto,
    onClickOauthLogin,
    signInWithGithub,
    signInWithDiscord,
    signInWithFacebook,
  };
};
