import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useActiveEmailProviders } from "@skylar/logic";

export const useUserOnboardingRouteGuard = () => {
  const router = useRouter();
  const activeEmailProviders = useActiveEmailProviders();

  useEffect(() => {
    if (!activeEmailProviders.length) {
      router.push("/onboarding/connect");
    } else {
      router.push("/onboarding/sync");
    }
  }, [activeEmailProviders, router]);

  return { isLoading: false };
};
