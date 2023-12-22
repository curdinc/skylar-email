"use client";

import { Elements } from "@stripe/react-stripe-js";

import { stripeConfig } from "~/lib/config";
import { stripePromise } from "~/lib/stripe";
import { PaymentCollectionForm } from "./payment-collection-form";

export default function AddCardForm() {
  return (
    <Elements stripe={stripePromise} options={stripeConfig}>
      <PaymentCollectionForm />
    </Elements>
  );
}
