import { useRouter, useSearchParams } from "next/navigation";
import { useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";

import { api } from "~/lib/api";

export function useCheckSuccessfulSetupIntent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stripe = useStripe();
  const setupIntentClientSecret = searchParams.get(
    "setup_intent_client_secret",
  );
  const { mutateAsync: setDefaultPaymentMethod } =
    api.stripe.setDefaultPaymentMethod.useMutation();

  useQuery({
    queryKey: ["stripe", "checkPaymentIntent", setupIntentClientSecret],
    enabled: !!stripe && !!setupIntentClientSecret,
    queryFn: async () => {
      if (!stripe || !setupIntentClientSecret) {
        // this should not happen since we only run the query when both are defined
        return { error: "card status check query fired before it was ready" };
      }

      const { error, setupIntent } = await stripe.retrieveSetupIntent(
        setupIntentClientSecret,
      );
      if (error) {
        return { error: error.message };
      }
      if (setupIntent) {
        console.log("setupIntent", JSON.stringify(setupIntent, null, 2));
        switch (setupIntent.status) {
          case "succeeded": {
            await setDefaultPaymentMethod({
              paymentMethodId:
                typeof setupIntent.payment_method === "string"
                  ? setupIntent.payment_method
                  : setupIntent.payment_method?.id ?? "",
            });
            router.push("/inbox");
            break;
          }
          case "processing": {
            // TODO: poll for status
            break;
          }
          case "requires_payment_method": {
            const redirectParams = new URLSearchParams({
              "error-message":
                "Something went wrong confirming your card details. Please try again with another card",
            });
            router.push(`/onboarding/card?${redirectParams.toString()}`);
            break;
          }
          default: {
            return {
              error: "Something went wrong confirming your card details",
            };
          }
        }
      }
      return { error: "Something went wrong confirming your card details" };
    },
  });
}
export function useCardConfirmationPage() {
  useCheckSuccessfulSetupIntent();
}