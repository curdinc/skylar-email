import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe("");
export const PRICE_LOOK_UP_KEYS = {
  yearlySubscription: "skylar_email_subscription_yearly",
  monthlySubscription: "skylar_email_subscription_monthly",
} as const;
export type PriceLookUpKeyType =
  (typeof PRICE_LOOK_UP_KEYS)[keyof typeof PRICE_LOOK_UP_KEYS];
