import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  useSignInWithDiscord,
  useSignInWithFacebook,
  useSignInWithGithub,
} from "@skylar/auth/client";
import { state$ } from "@skylar/logic";
import type { SupportedAuthProvidersType } from "@skylar/schema";

export const useLogin = () => {
  const params = useSearchParams();
  const redirectToPath = params.get("redirectTo") ?? "/inbox";
  const [redirectTo, setRedirectTo] = useState(redirectToPath);
  const loggingInto = state$.LOGIN.loggingInto.use();

  useEffect(() => {
    setRedirectTo(new URL(redirectToPath, window.location.origin).href);
  }, [redirectToPath]);

  const signInWithGithub = useSignInWithGithub({
    redirectTo,
  });
  const signInWithDiscord = useSignInWithDiscord({
    redirectTo,
  });
  const signInWithFacebook = useSignInWithFacebook({
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
