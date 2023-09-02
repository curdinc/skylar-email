import type { BaseSchema } from "valibot";
import { flatten, object, parse, string, ValiError } from "valibot";

export function validatorTrpcWrapper<T extends BaseSchema<any, any>>(
  schema: T,
) {
  return (raw: unknown) => {
    return parse(schema, raw);
  };
}

export function formatValidatorError(err: unknown) {
  return err instanceof ValiError ? flatten(err) : undefined;
}

export const testSchema = object({ name: string() });
