"use client";

import { Icons } from "~/components/icons";
import { usePostLogin } from "./use-post-login";

export default function PostAuthPage() {
  usePostLogin();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-5">
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Logging you in.
        </h2>
        <p className="text-muted-foreground">Hang tight.</p>
      </div>
      <Icons.spinner className="h-10 w-10 animate-spin" />
    </div>
  );
}
