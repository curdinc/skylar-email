import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { stripeCustomer } from "../../schema/stripe";

export async function getStripeCustomerByUserId({
  db,
  userId,
}: {
  db: DbType;
  userId: number;
}) {
  const stripeCustomerFound = await db.query.stripeCustomer.findFirst({
    where: eq(stripeCustomer.userId, userId),
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
