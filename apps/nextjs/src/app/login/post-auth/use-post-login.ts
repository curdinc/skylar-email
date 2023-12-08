import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { REDIRECT_TO_SEARCH_STRING } from "@skylar/auth/client";
import { useAllEmailProviders } from "@skylar/client-db";

export const usePostLogin = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectToPath =
    searchParams.get(REDIRECT_TO_SEARCH_STRING) ?? "/inbox";

  const { data: allEmailProviders, isLoading: isLoadingAllEmailProviders } =
    useAllEmailProviders();

  useEffect(() => {
    if (!allEmailProviders) {
      return;
    }
    if (!allEmailProviders.length) {
      router.push("/onboarding/connect");
    } else {
      router.push(redirectToPath);
    }
  }, [allEmailProviders, router, redirectToPath]);

  return { isLoading: isLoadingAllEmailProviders };
};
