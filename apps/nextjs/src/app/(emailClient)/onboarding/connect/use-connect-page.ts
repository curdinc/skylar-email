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

  const goBack = () => {
    router.back();
  };

  const [isConnectingToEmailProvider, setIsConnectingToEmailProvider] =
    useState(false);
  const { mutateAsync: getToken } =
    api.emailProviderRouter.getToken.useMutation({
      onSuccess() {
        console.log("first");
      },
    });
  const initiateConnectToGmail = useGoogleLogin({
    flow: "auth-code",
    scope: GMAIL_SCOPES,
    onSuccess: (codeResponse) => {
      setIsConnectingToEmailProvider(false);
      console.log("codeResponse", codeResponse);
      // if (typeof codeResponse == CodeResponse)

      // console.log(token);
      // const { isLoading, error, data } = useQuery('repoData', () =>
      //   fetch('https://api.github.com/repos/tannerlinsley/react-query').then(res =>
      //     res.json()
      //   )
      // )
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
    goBack,
    isConnectingToEmailProvider,
    connectToGmail,
    connectToOutlook,
  };
}
