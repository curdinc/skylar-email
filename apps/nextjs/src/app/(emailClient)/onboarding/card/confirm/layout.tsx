"use client";

import { Elements } from "@stripe/react-stripe-js";

import { stripeConfig } from "~/lib/config";
import { stripePromise } from "~/lib/stripe";

export default function CardConfirmationPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Elements stripe={stripePromise} options={stripeConfig}>
      {children}
    </Elements>
  );
}
