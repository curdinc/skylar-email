"use client";

import React from "react";

import { useSignInWithDiscord, useSignInWithGithub } from "@skylar/auth";
import { useSignInWithFacebook } from "@skylar/auth/src/client/hooks";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils/ui";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [loadingOauth, setIsLoading] = React.useState<boolean>(false);
  const signInWithGithub = useSignInWithGithub();
  const signInWithDiscord = useSignInWithDiscord();
  const signInWithFacebook = useSignInWithFacebook();

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
        leftIcon={<Icons.gitHub className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin(signInWithGithub)}
      >
        Github
      </Button>
      <Button
        variant="outline"
        isLoading={loadingOauth}
        leftIcon={<Icons.discord className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin(signInWithDiscord)}
      >
        Discord
      </Button>
      <Button
        variant="outline"
        isLoading={loadingOauth}
        leftIcon={<Icons.facebook className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin(signInWithFacebook)}
      >
        Facebook
      </Button>
    </div>
  );
}