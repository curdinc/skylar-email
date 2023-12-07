import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { REDIRECT_TO_SEARCH_STRING } from "@skylar/auth/client";
import { useActiveEmailProviders } from "@skylar/logic";

export const usePostLogin = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectToPath =
    searchParams.get(REDIRECT_TO_SEARCH_STRING) ?? "/inbox";

  const activeEmailProviders = useActiveEmailProviders();

  useEffect(() => {
    if (!activeEmailProviders.length) {
      router.push("/onboarding/connect");
    } else {
      router.push(redirectToPath);
    }
  }, [activeEmailProviders, router, redirectToPath]);

  return { isLoading: false };
};
