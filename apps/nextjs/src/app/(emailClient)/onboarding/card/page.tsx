"use client";

import { Elements } from "@stripe/react-stripe-js";

import { stripeConfig } from "~/lib/config";
import { stripePromise } from "~/lib/stripe";
import { useUserOnboardingRouteGuard } from "../use-user-onboarding-route-guard";
import { PaymentCollectionForm } from "./payment-collection-form";

export default function AddCardForm() {
  useUserOnboardingRouteGuard();

  return (
    <Elements stripe={stripePromise} options={stripeConfig}>
      <PaymentCollectionForm />
    </Elements>
  );
}
