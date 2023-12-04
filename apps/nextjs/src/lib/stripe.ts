import { loadStripe } from "@stripe/stripe-js";

import { env } from "~/env";

export const stripePromise = loadStripe(
  env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY,
);
export const PRICE_LOOK_UP_KEYS = {
  yearlySubscription: "skylar_email_subscription_yearly",
  monthlySubscription: "skylar_email_subscription_monthly",
} as const;
export type PriceLookUpKeyType =
  (typeof PRICE_LOOK_UP_KEYS)[keyof typeof PRICE_LOOK_UP_KEYS];
