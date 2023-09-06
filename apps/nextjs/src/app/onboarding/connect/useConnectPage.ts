import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { state$ } from "@skylar/logic";

import { api } from "~/lib/utils/api";

export function useConnectEmailProviderPage() {
  const router = useRouter();
  const [emailProvider, setEmailProvider] = useState<"Gmail" | "Outlook">(
    "Gmail",
  );

  const { mutate: checkValiAlphaCode, isLoading: isCheckingCode } =
    api.onboarding.validateAlphaCode.useMutation({
      onError() {
        router.replace("/onboarding/code");
      },
    });
  useEffect(() => {
    console.log(
      "state$.ONBOARDING.alphaCode.peek(),",
      state$.ONBOARDING.alphaCode.peek(),
    );
    const code = state$.ONBOARDING.alphaCode.peek();
    if (!code) {
      router.replace("/onboarding/code");
    }
    checkValiAlphaCode({
      alphaCode: state$.ONBOARDING.alphaCode.peek(),
    });
  }, [checkValiAlphaCode, router]);

  const onSelectEmailProvider = (provider: string) => {
    if (provider === "Gmail" || provider === "Outlook") {
      setEmailProvider(provider);
    }
  };

  const goBack = () => {
    router.back();
  };

  return {
    isCheckingCode,
    onSelectEmailProvider,
    emailProvider,
    goBack,
  };
}
