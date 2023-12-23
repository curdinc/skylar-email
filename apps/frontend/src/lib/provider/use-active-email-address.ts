import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { getProviderById, useEmailAddressById } from "@skylar/client-db";
import { formatErrors } from "@skylar/parsers-and-types";

import { useLogger } from "../logger";
import {
  ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX,
  ROUTE_EMAIL_PROVIDER_INBOX,
  ROUTE_ONBOARDING_CONNECT,
} from "../routes";

export const useActiveEmailAddress = () => {
  const { providerIndex } = useParams();
  const logger = useLogger();
  const router = useRouter();
  const providerId =
    parseInt(typeof providerIndex === "string" ? providerIndex : "1", 10) ?? 1;
  if (providerId < 1) {
    router.push(ROUTE_EMAIL_PROVIDER_INBOX(ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX));
  }

  useEffect(() => {
    const checkValidProviderId = async () => {
      const provider = await getProviderById({ id: providerId });
      if (provider) {
        return;
      }

      if (providerId !== ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX) {
        router.push(
          ROUTE_EMAIL_PROVIDER_INBOX(ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX),
        );
      } else if (providerId === ROUTE_EMAIL_PROVIDER_DEFAULT_INBOX) {
        router.push(
          ROUTE_ONBOARDING_CONNECT({
            type: "initialConnection",
          }),
        );
      }
    };
    checkValidProviderId().catch((e) => {
      logger.error(formatErrors(e));
    });
  });
  return useEmailAddressById(providerId);
};
