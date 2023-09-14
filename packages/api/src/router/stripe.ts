import Stripe from "stripe";

import {
  getStripeCustomerByUserId,
  getValidStripeCustomerByUserId,
  insertStripeCustomer,
} from "@skylar/db";
import { CreateSubscriptionSchema, validatorTrpcWrapper } from "@skylar/schema";

import { createMiddleware, createTRPCRouter } from "../trpc/factory";
import { protectedProcedure } from "../trpc/procedures";

const injectStripe = createMiddleware(async ({ ctx: { env }, next }) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
  });

  return next({
    ctx: {
      stripe,
    },
  });
});

const stripeProcedure = protectedProcedure.use(injectStripe);
export const stripeRouter = createTRPCRouter({
  maybeCreateCustomer: stripeProcedure.mutation(
    async ({
      ctx: {
        db,
        session: { user },
        stripe,
      },
    }) => {
      const stripeCustomer = await getStripeCustomerByUserId({
        db,
        userId: user.id,
      });
      if (!stripeCustomer) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `skylar_${user.id}_${user.name}`,
        });
        // save customer
        await insertStripeCustomer({
          db,
          customerDetails: {
            customerId: customer.id,
            userId: user.id,
          },
        });
      }
    },
  ),
  createSubscription: stripeProcedure
    .input(validatorTrpcWrapper(CreateSubscriptionSchema))
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
          stripe,
        },
        input,
      }) => {
        const prices = await stripe.prices.list({
          lookup_keys: [input.priceLookupKey],
          expand: ["data.product"],
        });
        const noExpand = await stripe.prices.list({
          lookup_keys: [input.priceLookupKey],
          expand: ["data.product"],
        });

        const stripeCustomer = await getValidStripeCustomerByUserId({
          db,
          userId: user.id,
        });
        const customer = await stripe.customers.retrieve(
          stripeCustomer.customerId,
        );
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              price: prices.data[0]?.id,
            },
          ],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
        });

        return subscription;
      },
    ),
  createSetupIntent: stripeProcedure.mutation(
    async ({
      ctx: {
        db,
        session: { user },
        stripe,
      },
    }) => {
      const stripeCustomer = await getValidStripeCustomerByUserId({
        db,
        userId: user.id,
      });

      const setupIntent = await stripe.setupIntents.create({
        customer: stripeCustomer.customerId,
        automatic_payment_methods: { enabled: true },
        usage: "off_session",
      });
      return { clientSecret: setupIntent.client_secret };
    },
  ),
});
