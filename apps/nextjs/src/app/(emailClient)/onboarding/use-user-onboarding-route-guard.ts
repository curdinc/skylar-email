import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAllEmailProviders } from "@skylar/client-db";

export const useUserOnboardingRouteGuard = () => {
  const router = useRouter();

  const { data: allEmailProviders, isLoading: isLoadingAllEmailProviders } =
    useAllEmailProviders();

  useEffect(() => {
    if (!allEmailProviders?.length) {
      router.push("/onboarding/connect");
    } else {
      router.push("/onboarding/sync");
    }
  }, [allEmailProviders, router]);

  return { isLoading: isLoadingAllEmailProviders };
};
