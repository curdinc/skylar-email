import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useConnectedProviders } from "@skylar/client-db";

export const useUserOnboardingRouteGuard = () => {
  const router = useRouter();

  const { data: allEmailProviders, isLoading: isLoadingAllEmailProviders } =
    useConnectedProviders();

  useEffect(() => {
    if (!allEmailProviders?.length) {
      router.push("/onboarding/connect");
    } else {
      router.push("/onboarding/sync");
    }
  }, [allEmailProviders, router]);

  return { isLoading: isLoadingAllEmailProviders };
};
