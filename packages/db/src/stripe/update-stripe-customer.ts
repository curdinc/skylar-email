import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";

type SetStripeCustomerType = Partial<
  (typeof schema.stripeCustomer)["$inferSelect"]
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
    .update(schema.stripeCustomer)
    .set(set)
    .where(eq(schema.stripeCustomer.customerId, stripeCustomerId));
}
