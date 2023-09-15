import { useState } from "react";
import { useRouter } from "next/navigation";

import { useUserOnboardingRouteGuard } from "../use-user-onboarding-route-guard";

export function useConnectEmailProviderPage() {
  const router = useRouter();
  const [emailProvider, setEmailProvider] = useState<"Gmail" | "Outlook">(
    "Gmail",
  );
  const { isLoading: isCheckingUserOnboardStep } =
    useUserOnboardingRouteGuard();

  const onSelectEmailProvider = (provider: string) => {
    if (provider === "Gmail" || provider === "Outlook") {
      setEmailProvider(provider);
    }
  };

  const goBack = () => {
    router.back();
  };

  return {
    isCheckingUserOnboardStep,
    onSelectEmailProvider,
    emailProvider,
    goBack,
  };
}
