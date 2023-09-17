import type { DbType } from "../..";
import { schema } from "../..";
import type { gmailProvider } from "../../schema/email-providers";

type insertGmailProviderInput = (typeof gmailProvider)["$inferInsert"];

export async function insertGmailProvider({
  db,
  input,
}: {
  db: DbType;
  input: insertGmailProviderInput;
}) {
  const result = await db
    .insert(schema.gmailProvider)
    .values({
      ...input,
    })
    .onConflictDoUpdate({
      target: [schema.gmailProvider.emailProviderDetailId],
      set: {
        refreshToken: input.refreshToken,
      },
    })
    .returning({
      gmailProviderId: schema.gmailProvider.gmailProviderId,
    });

  return result[0];
}
