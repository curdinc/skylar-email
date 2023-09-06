import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  useSignInWithDiscord,
  useSignInWithFacebook,
  useSignInWithGithub,
} from "@skylar/auth/client";
import type { SupportedAuthProviders } from "@skylar/logic";
import { state$ } from "@skylar/logic";

export const useLogin = () => {
  const params = useSearchParams();
  const redirectToPath = params.get("redirectTo") ?? "/inbox";
  const [redirectTo, setRedirectTo] = useState(redirectToPath);

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
    provider: SupportedAuthProviders,
    oauthLogin: () => Promise<void>,
  ) => {
    return async () => {
      state$.LOGIN.loggingInto.set(provider);
      await oauthLogin();
    };
  };

  return {
    onClickOauthLogin,
    signInWithGithub,
    signInWithDiscord,
    signInWithFacebook,
  };
};
