"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  useSignInWithDiscord,
  useSignInWithFacebook,
  useSignInWithGithub,
} from "@skylar/auth/client";

import { BrandIcons } from "~/components/icons/brand-icons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils/ui";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const params = useSearchParams();
  const redirectToPath = params.get("redirectTo") ?? "/inbox";
  const [redirectTo, setRedirectTo] = useState(redirectToPath);
  React.useEffect(() => {
    setRedirectTo(new URL(redirectToPath, window.location.origin).href);
  }, [redirectToPath]);

  const [loadingOauth, setIsLoading] = React.useState<boolean>(false);
  const signInWithGithub = useSignInWithGithub({
    redirectTo,
  });
  const signInWithDiscord = useSignInWithDiscord({
    redirectTo,
  });
  const signInWithFacebook = useSignInWithFacebook({
    redirectTo,
  });

  const onClickOauthLogin = (oauthLogin: () => Promise<void>) => {
    return async () => {
      setIsLoading(true);
      await oauthLogin();
    };
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        isLoading={loadingOauth}
        leftIcon={<BrandIcons.gitHub className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin(signInWithGithub)}
      >
        Github
      </Button>
      <Button
        variant="outline"
        isLoading={loadingOauth}
        leftIcon={<BrandIcons.discord className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin(signInWithDiscord)}
      >
        Discord
      </Button>
      <Button
        variant="outline"
        isLoading={loadingOauth}
        leftIcon={<BrandIcons.facebook className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin(signInWithFacebook)}
      >
        Facebook
      </Button>
    </div>
  );
}
