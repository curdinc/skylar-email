"use client";

import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

import { stripePromise } from "~/lib/stripe";
import { useUserOnboardingRouteGuard } from "../useUserOnboardingRouteGuard";
import { PaymentCollectionForm } from "./PaymentCollectionForm";

export default function AddCardForm() {
  useUserOnboardingRouteGuard();

  const options: StripeElementsOptions = {
    mode: "subscription",
    amount: 0,
    currency: "usd",
    appearance: {
      /*...*/
    },
  } as const;

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentCollectionForm />
    </Elements>
  );
}
