import type { DbType } from "../..";
import { stripeCustomer } from "../../schema/stripe";

export async function insertStripeCustomer({
  db,
  customerDetails,
}: {
  db: DbType;
  customerDetails: { customerId: string; userId: number };
}) {
  await db.insert(stripeCustomer).values({
    customerId: customerDetails.customerId,
    userId: customerDetails.userId,
  });
}
