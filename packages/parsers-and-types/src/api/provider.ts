import type { Output } from "valibot";
import { email, enumType, integer, number, object, string } from "valibot";

import { SUPPORTED_EMAIL_PROVIDER_LIST } from "../..";

const EmailProviderDetailSchema = object({
  emailProvider: enumType(SUPPORTED_EMAIL_PROVIDER_LIST),
  user_id: number([integer()]),
  email: string([email()]),
});

export type EmailProviderDetailType = Output<typeof EmailProviderDetailSchema>;
