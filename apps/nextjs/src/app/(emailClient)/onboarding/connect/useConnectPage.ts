import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { state$ } from "@skylar/logic";

import { api } from "~/lib/utils/api";

export function useConnectEmailProviderPage() {
  const router = useRouter();
  const [emailProvider, setEmailProvider] = useState<"Gmail" | "Outlook">(
    "Gmail",
  );

  const { mutate: getUserOnboardStep, isLoading: isCheckingUserOnboardStep } =
    api.onboarding.getUserOnboardStep.useMutation({
      onSuccess(data) {
        if (data === "invite-code") {
          router.replace("/onboarding/code");
        }
        if (data === "done") {
          router.replace("/inbox");
        }
      },
      onError() {
        router.replace("/onboarding/code");
      },
    });

  useEffect(() => {
    const code = state$.ONBOARDING.alphaCode.peek();
    if (!code) {
      router.replace("/onboarding/code");
    }
    getUserOnboardStep();
  }, [getUserOnboardStep, router]);

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
