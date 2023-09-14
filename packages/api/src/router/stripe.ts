import Stripe from "stripe";

import { insertStripeCustomer } from "@skylar/db";

import { createMiddleware, createTRPCRouter } from "../trpc/factory";
import { protectedProcedure } from "../trpc/procedures";

const injectStripe = createMiddleware(async ({ ctx: { env }, next }) => {
  const stripe = new Stripe(env.STRIPE_PUBLISHABLE_API_KEY, {
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
  createCustomer: stripeProcedure.mutation(
    async ({
      ctx: {
        db,
        session: { user },
        stripe,
      },
    }) => {
      // TODO: check if this throws if the email is the same. or if both are the same?
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      // save customer
      await insertStripeCustomer({
        db,
        customerDetails: {
          customerId: customer.id,
          userId: user.id,
        },
      });
    },
  ),
});
