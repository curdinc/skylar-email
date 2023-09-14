import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { stripeCustomer } from "../../schema/stripe";

type SetStripeCustomerType = Partial<(typeof stripeCustomer)["$inferSelect"]>;

export async function updateStripeCustomer({
  db,
  stripeCustomerId,
  set,
}: {
  db: DbType;
  stripeCustomerId: string;
  set: SetStripeCustomerType;
}) {
  await db
    .update(stripeCustomer)
    .set(set)
    .where(eq(stripeCustomer.customerId, stripeCustomerId));
}
