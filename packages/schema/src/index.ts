import type { BaseSchema } from "valibot";
import { flatten, object, parse, string, ValiError } from "valibot";

export {
  authCodeSchema,
  gmailProviderIDTokenSchema,
  oauth2TokenResponseSchema,
  providerEnumList,
} from "./emailProvider";

export function validatorTrpcWrapper<
  TInput,
  TOutput,
  T extends BaseSchema<TInput, TOutput>,
>(schema: T) {
  return (raw: unknown) => {
    return parse(schema, raw);
  };
}

export function formatValidatorError(err: unknown) {
  return err instanceof ValiError ? flatten(err) : undefined;
}

export const testSchema = object({ name: string() });
