import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";

import { putProvider } from "@skylar/client-db";
import type { SupportedEmailProviderType } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import { captureEvent, identifyUser } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { GMAIL_SCOPES } from "~/lib/config";
import { useLogger } from "~/lib/logger";
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

  const { mutate: exchangeCode } = useMutation({
    mutationFn: async ({
      code,
      provider,
    }: {
      code: string;
      provider: SupportedEmailProviderType;
    }) => {
      const { gmailApiWorker } = await import("@skylar/web-worker-logic");

      const providerInfo =
        await gmailApiWorker.provider.addOauthProvider.mutate({
          code: code,
          provider,
        });

      // add to client db
      await putProvider({
        provider: {
          type: provider,
          user_email_address: providerInfo.emailAddress,
          image_uri: providerInfo.imageUri,
          inbox_name:
            providerInfo.name ?? providerInfo.emailAddress.split("@")[0] ?? "",
          refresh_token: providerInfo.refreshToken,
        },
      });

      return providerInfo;
    },
    onSuccess(providerInfo) {
      identifyUser(providerInfo.emailAddress);

      captureEvent({
        event: TrackingEvents.connectedProvider,
        properties: {
          providerType,
          emailAddress: providerInfo.emailAddress,
        },
      });

      router.push(ROUTE_ONBOARDING_SYNC);
    },
    onError(error, variables) {
      toast({
        title: "Error connecting to email provider",
        description: error.message,
        variant: "destructive",
      });
      logger.error("Error adding email provider to client DB", {
        error,
        variables,
      });
      setIsConnectingToProvider(false);
    },
  });

  const initiateConnectToGmail = useGoogleLogin({
    flow: "auth-code",
    scope: GMAIL_SCOPES,
    onSuccess: (codeResponse) => {
      exchangeCode({
        code: codeResponse.code,
        provider: "gmail",
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
