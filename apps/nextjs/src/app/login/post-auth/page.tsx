"use client";

import { Icons } from "~/components/icons";
import { TypographyH2 } from "~/components/ui/typography";
import { usePostLogin } from "./use-post-login";

export default function PostAuthPage() {
  usePostLogin();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-5">
      <TypographyH2>Logging you in. Hang tight.</TypographyH2>
      <Icons.spinner className="h-10 w-10 animate-spin" />
    </div>
  );
}
