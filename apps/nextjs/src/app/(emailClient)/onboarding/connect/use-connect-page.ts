import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

import { api } from "~/lib/api";
import { GMAIL_SCOPES } from "~/lib/config";
import { useLogger } from "~/lib/logger";
import { useUserOnboardingRouteGuard } from "../use-user-onboarding-route-guard";

export function useConnectEmailProviderPage() {
  const router = useRouter();
  const logger = useLogger();
  const { isLoading: isCheckingUserOnboardStep } =
    useUserOnboardingRouteGuard();

  const [emailProvider, setEmailProvider] = useState<"Gmail" | "Outlook">(
    "Gmail",
  );
  const onSelectEmailProvider = (provider: string) => {
    if (provider === "Gmail" || provider === "Outlook") {
      setEmailProvider(provider);
    }
  };

  const [isConnectingToEmailProvider, setIsConnectingToEmailProvider] =
    useState(false);
  const { mutate: exchangeCode } =
    api.emailProviderRouter.googleCodeExchange.useMutation({
      onSuccess() {
        router.push("/onboarding/card");
        setIsConnectingToEmailProvider(false);
      },
    });
  const initiateConnectToGmail = useGoogleLogin({
    flow: "auth-code",
    scope: GMAIL_SCOPES,
    onSuccess: (codeResponse) => {
      setIsConnectingToEmailProvider(false);
      exchangeCode({
        provider: "gmail",
        code: codeResponse.code,
      });
    },
    onError: (errorResponse) => {
      setIsConnectingToEmailProvider(false);
      logger.error("User encounter error connecting to Google", {
        ...errorResponse,
      });
    },
    onNonOAuthError(nonOAuthError) {
      setIsConnectingToEmailProvider(false);
      logger.info("User encounter non oauth error connecting to google", {
        ...nonOAuthError,
      });
    },
    select_account: true,
  });

  const connectToGmail = useCallback(() => {
    setIsConnectingToEmailProvider(true);
    initiateConnectToGmail();
  }, [initiateConnectToGmail]);

  const connectToOutlook = useCallback(() => {
    throw new Error("Not implemented");
  }, []);

  return {
    isCheckingUserOnboardStep,
    onSelectEmailProvider,
    emailProvider,
    isConnectingToEmailProvider,
    connectToGmail,
    connectToOutlook,
  };
}
