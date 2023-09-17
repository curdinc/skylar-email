import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";

export async function getStripeCustomerByCustomerId({
  db,
  customerId,
}: {
  db: DbType;
  customerId: string;
}) {
  const stripeCustomerFound = await db.query.stripeCustomer.findFirst({
    where: eq(schema.stripeCustomer.customerId, customerId),
  });
  return stripeCustomerFound;
}

export async function getValidStripeCustomerByCustomerId({
  db,
  customerId,
}: {
  db: DbType;
  customerId: string;
}) {
  const stripeCustomerFound = await getStripeCustomerByCustomerId({
    db,
    customerId,
  });
  if (!stripeCustomerFound) {
    throw new Error(`No stripe customer found for customer id: ${customerId}`);
  }
  return stripeCustomerFound;
}
