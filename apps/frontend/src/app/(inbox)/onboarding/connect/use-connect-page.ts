import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";

import { putProvider } from "@skylar/client-db";
import type {
  ProviderInsertType,
  SupportedEmailProviderType,
} from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { captureEvent, identifyUser } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { api } from "~/lib/api";
import { GMAIL_SCOPES } from "~/lib/config";
import { useLogger } from "~/lib/logger";
import { hasRequiredGmailScopes } from "~/lib/provider/hasGmailScopes";
import type { ROUTE_ONBOARDING_CONNECT } from "~/lib/routes";
import { ROUTE_ONBOARDING_SYNC } from "~/lib/routes";

export function useConnectEmailProviderPage() {
  const router = useRouter();
  const logger = useLogger();
  const { toast } = useToast();
  const queryParams = useSearchParams();
  let connectToEmailDescription = "Connect to your email to get started.";
  if (
    "type" in queryParams &&
    queryParams.type ===
      ("missingScopes" satisfies Parameters<
        typeof ROUTE_ONBOARDING_CONNECT
      >[0]["type"]) &&
    "email" in queryParams &&
    typeof queryParams.email === "string"
  ) {
    const email = queryParams.email;
    connectToEmailDescription = `${email} is missing some required scopes. Please connect it again to grant the required scopes.`;
  }

  const [providerType, setProviderType] =
    useState<SupportedEmailProviderType>("gmail");

  const onSelectEmailProvider = (provider: string) => {
    if (provider === "gmail" || provider === "outlook") {
      setProviderType(provider);
    }
  };

  const [isConnectingToProvider, setIsConnectingToProvider] = useState(false);

  const { mutate: addProvider } = useMutation({
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
      setIsConnectingToProvider(false);
    },
    onSuccess: () => {
      router.push(ROUTE_ONBOARDING_SYNC);
    },
  });

  const { mutate: exchangeCode } = api.oauth.googleCodeExchange.useMutation({
    onSuccess(emailProviderInfo) {
      const hasGrantedRequiredGmailScopes =
        hasRequiredGmailScopes(emailProviderInfo);

      if (!hasGrantedRequiredGmailScopes) {
        toast({
          title: "Error connecting to email provider",
          description: "Please make sure to enable the requested scopes",
          variant: "destructive",
        });

        setIsConnectingToProvider(false);
        return;
      }
      addProvider({
        type: emailProviderInfo.providerType,
        user_email_address: emailProviderInfo.providerInfo.email,
        image_uri: emailProviderInfo.providerInfo.imageUri,
        inbox_name: emailProviderInfo.providerInfo.name,
        refresh_token: emailProviderInfo.providerInfo.refreshToken,
        access_token: emailProviderInfo.accessToken,
      });

      identifyUser(emailProviderInfo.providerInfo.email);

      captureEvent({
        event: TrackingEvents.connectedProvider,
        properties: {
          providerType,
          emailAddress: emailProviderInfo.providerInfo.email,
        },
      });
    },
    onError: (error) => {
      logger.error("Error exchanging google oauth code", {
        error,
      });
      toast({
        title: "Error connecting to email provider",
        description: `${error.message} Please try again later`,
        variant: "destructive",
      });
      setIsConnectingToProvider(false);
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
      setIsConnectingToProvider(false);
      toast({
        title: "Error connecting to email provider",
        description: `${errorResponse.error_description}. Please try again later`,
        variant: "destructive",
      });
      logger.error("User encounter error connecting to Google", {
        error: errorResponse,
      });
    },
    onNonOAuthError(nonOAuthError) {
      setIsConnectingToProvider(false);
      logger.info("User encounter non oauth error connecting to google", {
        error: nonOAuthError,
      });
    },
    select_account: true,
  });

  const connectToGmail = useCallback(() => {
    setIsConnectingToProvider(true);
    initiateConnectToGmail();
  }, [initiateConnectToGmail]);

  const connectToOutlook = useCallback(() => {
    throw new Error("Not implemented");
  }, []);

  return {
    connectToEmailDescription,
    onSelectEmailProvider,
    providerType,
    providerTypeDisplayName:
      providerType.charAt(0).toUpperCase() + providerType.slice(1),
    isConnectingToProvider,
    connectToGmail,
    connectToOutlook,
  };
}
