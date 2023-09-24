import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  useLoginWithDiscord,
  useLoginWithFacebook,
  useLoginWithGithub,
} from "@skylar/auth/client";
import { state$ } from "@skylar/logic";
import type { SupportedAuthProvidersType } from "@skylar/parsers-and-types";

export const useLogin = () => {
  const params = useSearchParams();
  const redirectToPath = params.get("redirectTo") ?? "/inbox";
  const [redirectTo, setRedirectTo] = useState(redirectToPath);
  const loggingInto = state$.LOGIN.loggingInto.use();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set("redirectTo", redirectToPath);
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
      state$.LOGIN.loggingInto.set(provider);
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
