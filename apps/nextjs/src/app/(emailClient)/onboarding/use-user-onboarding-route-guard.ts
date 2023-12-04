import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/lib/api";

export const useUserOnboardingRouteGuard = () => {
  const router = useRouter();

  const { data: userOnboardStep, isLoading } =
    api.onboarding.getUserOnboardStep.useQuery();

  useEffect(() => {
    if (!isLoading) {
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
          router.push("/onboarding/sync");
          break;
        }
      }
    }
  }, [isLoading, router, userOnboardStep]);

  return { isLoading };
};
