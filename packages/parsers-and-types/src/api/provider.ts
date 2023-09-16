import type { Output } from "valibot";
import { email, enumType, integer, number, object, string } from "valibot";

import { providerEnumList } from "./email-provider/oauth";

const EmailProviderDetailSchema = object({
  emailProvider: enumType(providerEnumList),
  user_id: number([integer()]),
  email: string([email()]),
});

export type EmailProviderDetailType = Output<typeof EmailProviderDetailSchema>;
