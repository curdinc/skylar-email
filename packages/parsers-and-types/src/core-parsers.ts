import { email, string, transform } from "valibot";

export const emailSchema = transform(string([email()]), (value) =>
  value.trim().toLowerCase(),
);
