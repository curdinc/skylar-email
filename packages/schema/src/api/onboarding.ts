import { object, string } from "valibot";

export const AlphaCodeCheckerSchema = object({
  alphaCode: string(),
});

export const CreateSubscriptionSchema = object({
  priceLookupKey: string(),
});
