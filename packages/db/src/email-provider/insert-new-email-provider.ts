import type { EmailProviderDetailType } from "@skylar/parsers-and-types";

import type { DbType } from "../../index";
import { schema } from "../../index";

export async function insertNewEmailProvider({
  db,
  newProvider,
}: {
  db: DbType;
  newProvider: EmailProviderDetailType;
}) {
  const result = await db
    .insert(schema.email_provider_detail)
    .values({
      email: newProvider.email,
      email_provider: newProvider.emailProvider,
      user_id: newProvider.user_id,
    })
    .returning({
      email_provider_detail_id:
        schema.email_provider_detail.email_provider_detail_id,
    });

  return { email_provider_detail_id: result[0]?.email_provider_detail_id };
}
