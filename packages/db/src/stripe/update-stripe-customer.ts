import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";

type SetStripeCustomerType = Partial<
  (typeof schema.stripe_customer)["$inferSelect"]
>;

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
    .update(schema.stripe_customer)
    .set(set)
    .where(eq(schema.stripe_customer.customer_id, stripeCustomerId));
}
