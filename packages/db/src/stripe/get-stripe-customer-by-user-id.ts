import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";

export async function getStripeCustomerByUserId({
  db,
  userId,
}: {
  db: DbType;
  userId: number;
}) {
  const stripeCustomerFound = await db.query.stripe_customer.findFirst({
    where: eq(schema.stripe_customer.user_id, userId),
  });
  return stripeCustomerFound;
}

export async function getValidStripeCustomerByUserId({
  db,
  userId,
}: {
  db: DbType;
  userId: number;
}) {
  const stripeCustomerFound = await getStripeCustomerByUserId({ db, userId });
  if (!stripeCustomerFound) {
    throw new Error(`No stripe customer found for user id: ${userId}`);
  }
  return stripeCustomerFound;
}
