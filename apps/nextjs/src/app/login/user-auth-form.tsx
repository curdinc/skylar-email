"use client";

import React from "react";

import { BrandIcons } from "~/components/icons/brand-icons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/ui";
import { useLogin } from "./use-login";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    onClickOauthLogin,
    signInWithGithub,
    signInWithDiscord,
    signInWithFacebook,
    loggingInto,
  } = useLogin();

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        isLoading={loggingInto === "github"}
        disabled={!!loggingInto}
        leftIcon={<BrandIcons.gitHub className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin("github", signInWithGithub)}
      >
        Github
      </Button>
      <Button
        variant="outline"
        isLoading={loggingInto === "discord"}
        disabled={!!loggingInto}
        leftIcon={<BrandIcons.discord className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin("discord", signInWithDiscord)}
      >
        Discord
      </Button>
      <Button
        variant="outline"
        isLoading={loggingInto === "facebook"}
        disabled={!!loggingInto}
        leftIcon={<BrandIcons.facebook className="mr-2 h-4 w-4" />}
        onClick={onClickOauthLogin("facebook", signInWithFacebook)}
      >
        Facebook
      </Button>
    </div>
  );
}
