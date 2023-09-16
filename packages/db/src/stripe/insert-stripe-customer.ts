import type { DbType } from "../..";
import { schema } from "../..";

export async function insertStripeCustomer({
  db,
  customerDetails,
}: {
  db: DbType;
  customerDetails: { customerId: string; userId: number };
}) {
  await db.insert(schema.stripe_customer).values({
    customer_id: customerDetails.customerId,
    user_id: customerDetails.userId,
  });
}
