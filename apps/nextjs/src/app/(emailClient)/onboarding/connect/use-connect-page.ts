import { useCallback, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";

import { putProvider } from "@skylar/client-db";
import type {
  ProviderInsertType,
  SupportedEmailProviderType,
} from "@skylar/parsers-and-types";

import { api } from "~/lib/api";
import { GMAIL_SCOPES } from "~/lib/config";
import { useLogger } from "~/lib/logger";
import { useUserOnboardingRouteGuard } from "../use-user-onboarding-route-guard";

export function useConnectEmailProviderPage() {
  const logger = useLogger();
  const { isLoading: isCheckingUserOnboardStep } =
    useUserOnboardingRouteGuard();

  const [emailProvider, setEmailProvider] =
    useState<SupportedEmailProviderType>("gmail");
  const onSelectEmailProvider = (provider: string) => {
    if (provider === "gmail" || provider === "outlook") {
      setEmailProvider(provider);
    }
  };

  const { mutate: addProvider } = useMutation({
    onMutate: async (provider: ProviderInsertType) => {
      await putProvider({ provider });
    },
  });
  const utils = api.useUtils();

  const [isConnectingToEmailProvider, setIsConnectingToEmailProvider] =
    useState(false);
  const { mutate: exchangeCode } = api.oauth.googleCodeExchange.useMutation({
    onSuccess(emailProviderInfo) {
      utils.onboarding.getUserOnboardStep.invalidate().catch((e) => {
        logger.error("Error invalidating user onboarding step", { error: e });
      });
      addProvider({
        email_provider: emailProviderInfo.providerType,
        email: emailProviderInfo.providerInfo.email,
        image_uri: emailProviderInfo.providerInfo.imageUri,
        inbox_name: emailProviderInfo.providerInfo.name,
        refresh_token: emailProviderInfo.providerInfo.refreshToken,
      });
      setIsConnectingToEmailProvider(false);
    },
  });

  const initiateConnectToGmail = useGoogleLogin({
    flow: "auth-code",
    scope: GMAIL_SCOPES,
    onSuccess: (codeResponse) => {
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
    emailProviderDisplayName:
      emailProvider.charAt(0).toUpperCase() + emailProvider.slice(1),
    isConnectingToEmailProvider,
    connectToGmail,
    connectToOutlook,
  };
}
