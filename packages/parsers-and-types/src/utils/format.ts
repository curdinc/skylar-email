import { ValiError } from "valibot";

import { formatValidatorError } from "./valibot-wrappers";

export function formatErrors(err: unknown) {
  if (err instanceof ValiError) {
    return JSON.stringify(formatValidatorError(err));
  }
  if (err instanceof Error) {
    return err.message;
  }
  return JSON.stringify(err);
}
