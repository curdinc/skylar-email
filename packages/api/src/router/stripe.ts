import Stripe from "stripe";

import {
  getStripeCustomerByUserId,
  getValidStripeCustomerByUserId,
  insertStripeCustomer,
  updateStripeCustomer,
} from "@skylar/db";
import {
  CreateSubscriptionSchema,
  SetDefaultPaymentMethodSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

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
        userId: parseInt(user.id),
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
            userId: parseInt(user.id),
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
          expand: [],
        });

        const stripeCustomer = await getValidStripeCustomerByUserId({
          db,
          userId: parseInt(user.id),
        });
        const customer = await stripe.customers.retrieve(
          stripeCustomer.customer_id,
        );
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [
            {
              price: prices.data[0]?.id,
            },
          ],
          off_session: true,
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
        userId: parseInt(user.id),
      });

      const setupIntent = await stripe.setupIntents.create({
        customer: stripeCustomer.customer_id,
        automatic_payment_methods: { enabled: true },
        usage: "off_session",
      });
      return { clientSecret: setupIntent.client_secret };
    },
  ),
  setDefaultPaymentMethod: stripeProcedure
    .input(validatorTrpcWrapper(SetDefaultPaymentMethodSchema))
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
          stripe,
        },
        input,
      }) => {
        const stripeCustomer = await getValidStripeCustomerByUserId({
          db,
          userId: parseInt(user.id),
        });
        await stripe.paymentMethods.attach(input.paymentMethodId, {
          customer: stripeCustomer.customer_id,
        });
        const customer = await stripe.customers.update(
          stripeCustomer.customer_id,
          {
            invoice_settings: {
              default_payment_method: input.paymentMethodId,
            },
          },
        );
        await updateStripeCustomer({
          db,
          stripeCustomerId: customer.id,
          set: { payment_method_added_at: new Date() },
        });
      },
    ),
});
