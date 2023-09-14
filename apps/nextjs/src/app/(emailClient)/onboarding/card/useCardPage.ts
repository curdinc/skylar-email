import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeError, StripePaymentElement } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { useLogger } from "~/lib/logger";

function useCreateCustomer() {
  const { toast } = useToast();

  const [isCustomerCreated, setIsCustomerCreated] = useState(false);
  const { mutate: maybeCreateCustomer } =
    api.stripe.maybeCreateCustomer.useMutation({
      onSuccess: () => {
        setIsCustomerCreated(true);
      },
      onError: () => {
        toast({
          title: "Something went wrong",
          description:
            "Error setting up payment collection. Please refresh and try again",
          variant: "destructive",
        });
      },
    });

  useQuery({
    queryKey: ["stripe", "maybeCreateCustomer"],
    queryFn: () => {
      maybeCreateCustomer();
      return "OK" as const;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return {
    isCustomerCreated,
  };
}

function useFocusPaymentElement() {
  const onPaymentElementLoad = useCallback((e: StripePaymentElement) => {
    e.focus();
  }, []);
  return { onPaymentElementLoad };
}

function useSubmitPaymentElement() {
  const stripe = useStripe();
  const elements = useElements();
  const logger = useLogger();
  const { toast } = useToast();
  const { isCustomerCreated } = useCreateCustomer();

  const { mutateAsync: createSetupIntent } =
    api.stripe.createSetupIntent.useMutation();

  const handlePaymentError = useCallback(
    (error: StripeError) => {
      logger.error("Error submitting stripe payment element", {
        ...error,
      });
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message,
      });
      setIsSubmittingPaymentDetails(false);
    },
    [logger, toast],
  );

  const canSubmitPaymentDetail = !!stripe && !!elements && isCustomerCreated;
  const [isSubmittingPaymentDetails, setIsSubmittingPaymentDetails] =
    useState(false);
  const handlePaymentElementSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSubmitPaymentDetail) {
        return;
      }
      setIsSubmittingPaymentDetails(true);

      // Trigger form validation and wallet collection
      const { error: submitElementError } = await elements.submit();
      if (submitElementError) {
        setIsSubmittingPaymentDetails(false);
        return;
      }

      const setupIntent = await createSetupIntent();

      try {
        const { error: confirmationError } = await stripe.confirmSetup({
          clientSecret: setupIntent.clientSecret ?? "",
          elements,
          confirmParams: {
            return_url: `https://example.com/onboarding/card`,
          },
        });
        if (confirmationError) {
          handlePaymentError(confirmationError);
        }
      } catch (e) {
        logger.error("Error confirming stripe setup intent", {
          error: e,
        });
      } finally {
        setIsSubmittingPaymentDetails(false);
      }
    },
    [
      canSubmitPaymentDetail,
      createSetupIntent,
      elements,
      handlePaymentError,
      logger,
      stripe,
    ],
  );

  return {
    handlePaymentElementSubmit,
    isSubmittingPaymentDetails,
    canSubmitPaymentDetail,
  };
}

export function useCheckSuccessfulPayment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stripe = useStripe();
  const paymentIntent = searchParams.get("payment_intent_client_secret");

  useQuery({
    queryKey: ["stripe", "checkPaymentIntent", paymentIntent],
    enabled: !!stripe && !!paymentIntent,
    queryFn: async () => {
      if (!stripe || !paymentIntent) {
        // this should not happen since we only run the query when both are defined
        return { error: "card status check query fired before it was ready" };
      }

      const { error, setupIntent } =
        await stripe.retrieveSetupIntent(paymentIntent);
      if (error) {
        return { error: error.message };
      }
      if (setupIntent) {
        switch (setupIntent.status) {
          case "succeeded": {
            router.push("/inbox");
            break;
          }
          case "processing": {
            // TODO: poll for status
            break;
          }
          case "requires_payment_method": {
            const redirectParams = new URLSearchParams({
              mgs: "Something went wrong confirming your card details. Please try again with another card",
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

export function useCardPage() {
  const { onPaymentElementLoad } = useFocusPaymentElement();

  const {
    handlePaymentElementSubmit,
    isSubmittingPaymentDetails,
    canSubmitPaymentDetail,
  } = useSubmitPaymentElement();

  return {
    onPaymentElementLoad,
    handlePaymentElementSubmit,
    canSubmitPaymentDetail,
    isSubmittingPaymentDetails,
  };
}
