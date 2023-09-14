import { useCallback } from "react";
import { useRouter } from "next/navigation";

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

  const onUserLogin = useCallback(async () => {
    const { data: userOnboardStep } = await getUserOnboardStep();
    if (userOnboardStep === "invite-code") {
      router.replace("/onboarding/code");
    }

    // Connect email provider
    // Add payment method

    if (userOnboardStep === "done") {
      router.replace("/inbox");
    }
  }, [getUserOnboardStep, router]);

  return { onUserLogin };
};
