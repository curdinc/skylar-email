import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

function useErrorSettingUpPaymentMethod() {
  const { toast } = useToast();
  const searchparams = useSearchParams();
  const errorMessage = searchparams.get("error-message");
  const logger = useLogger();
  useEffect(() => {
    if (errorMessage) {
      logger.error(`Error setting up payment method ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: errorMessage,
      });
    }
  }, [logger, errorMessage, toast]);
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
            return_url: `${location.origin}/onboarding/card/confirm`,
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

export function useCardPage() {
  useErrorSettingUpPaymentMethod();
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
