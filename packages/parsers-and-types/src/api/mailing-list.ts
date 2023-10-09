import { object } from "valibot";

import { emailSchema } from "../core-parsers";

export const JoinMailingListSchema = object({
  email: emailSchema,
});
