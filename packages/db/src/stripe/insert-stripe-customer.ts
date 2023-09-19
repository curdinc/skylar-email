import type { DbType } from "../..";
import { schema } from "../..";

export async function insertStripeCustomer({
  db,
  customerDetails,
}: {
  db: DbType;
  customerDetails: { customerId: string; userId: number };
}) {
  await db.insert(schema.stripeCustomer).values({
    customerId: customerDetails.customerId,
    userId: customerDetails.userId,
  });
}
