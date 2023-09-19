import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { RedirectFnType } from "@skylar/auth";

import { api } from "../api";

export const onLogoutRedirectTo: RedirectFnType = ({ path, queryParams }) => {
  const newSearchParams = new URLSearchParams();
  if (queryParams) {
    newSearchParams.set("redirectTo", `${path}?${queryParams.toString()}`);
  } else {
    newSearchParams.set("redirectTo", path);
  }
  return {
    path: `/login?${newSearchParams.toString()}`,
  };
};

export const useOnUserLogin = () => {
  const router = useRouter();
  const { refetch: getUserOnboardStep } =
    api.onboarding.getUserOnboardStep.useQuery(undefined, {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });
  const pathname = usePathname();

  const onUserLogin = useCallback(async () => {
    const { data: userOnboardStep } = await getUserOnboardStep();
    switch (userOnboardStep) {
      case "invite-code": {
        router.push("/onboarding/code");
        break;
      }
      case "email-provider": {
        router.push("/onboarding/connect");
        break;
      }
      case "card": {
        router.push("/onboarding/card");
        break;
      }
      case "done": {
        if (pathname.startsWith("/onboarding")) {
          router.push("/inbox");
        }
        break;
      }
    }
  }, [getUserOnboardStep, pathname, router]);

  return { onUserLogin };
};
