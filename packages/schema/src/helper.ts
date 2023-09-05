import type { BaseSchema } from "valibot";
import { flatten, ValiError, parse as valiParse } from "valibot";

export {
  gmailProviderIDTokenSchema,
  oauth2TokenResponseSchema,
  oauthOnboardingSchema,
  providerEnumList,
} from "./emailProvider";

export function validatorTrpcWrapper<
  TInput,
  TOutput,
  T extends BaseSchema<TInput, TOutput>,
>(schema: T) {
  return (raw: unknown) => {
    return valiParse(schema, raw);
  };
}

export function formatValidatorError(err: unknown) {
  return err instanceof ValiError ? flatten(err) : undefined;
}

export function parse<TInput, TOutput, T extends BaseSchema<TInput, TOutput>>(
  schema: T,
  raw: unknown,
) {
  return valiParse(schema, raw);
}
