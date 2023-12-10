import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";

import { putProvider } from "@skylar/client-db";
import type {
  ProviderInsertType,
  SupportedEmailProviderType,
} from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { GMAIL_SCOPES } from "~/lib/config";
import { useLogger } from "~/lib/logger";
import { ROUTE_ONBOARDING_SYNC } from "~/lib/routes";

export function useConnectEmailProviderPage() {
  const router = useRouter();
  const logger = useLogger();
  const { toast } = useToast();

  const [emailProvider, setEmailProvider] =
    useState<SupportedEmailProviderType>("gmail");

  const onSelectEmailProvider = (provider: string) => {
    if (provider === "gmail" || provider === "outlook") {
      setEmailProvider(provider);
    }
  };

  const [isConnectingToEmailProvider, setIsConnectingToEmailProvider] =
    useState(false);

  const { mutate: addEmailProvider } = useMutation({
    mutationFn: async (provider: ProviderInsertType) => {
      await putProvider({ provider });
    },
    onError(error, variables) {
      toast({
        title: "Error connecting to email provider",
        description: "Please try again later",
        variant: "destructive",
      });
      logger.error("Error adding email provider to client DB", {
        error,
        variables,
      });
    },
    onSettled: () => {
      setIsConnectingToEmailProvider(false);
    },
    onSuccess: () => {
      router.push(ROUTE_ONBOARDING_SYNC);
    },
  });

  const { mutate: exchangeCode } = api.oauth.googleCodeExchange.useMutation({
    onSuccess(emailProviderInfo) {
      addEmailProvider({
        email_provider: emailProviderInfo.providerType,
        email: emailProviderInfo.providerInfo.email,
        image_uri: emailProviderInfo.providerInfo.imageUri,
        inbox_name: emailProviderInfo.providerInfo.name,
        refresh_token: emailProviderInfo.providerInfo.refreshToken,
      });
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
    onSelectEmailProvider,
    emailProvider,
    emailProviderDisplayName:
      emailProvider.charAt(0).toUpperCase() + emailProvider.slice(1),
    isConnectingToEmailProvider,
    connectToGmail,
    connectToOutlook,
  };
}
