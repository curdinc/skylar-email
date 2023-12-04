import type { Output } from "valibot";
import { enumType, integer, number, object } from "valibot";

import { SUPPORTED_EMAIL_PROVIDER_LIST } from "../..";
import { emailSchema } from "../core-parsers";

const EmailProviderDetailSchema = object({
  emailProvider: enumType(SUPPORTED_EMAIL_PROVIDER_LIST),
  user_id: number([integer()]),
  email: emailSchema,
});

export type EmailProviderDetailType = Output<typeof EmailProviderDetailSchema>;
