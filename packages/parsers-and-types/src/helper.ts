import type { BaseSchema } from "valibot";
import { flatten, ValiError, parse as valiParse } from "valibot";

export function validatorTrpcWrapper<
  TInput,
  TOutput,
  T extends BaseSchema<TInput, TOutput>,
>(schema: T) {
  return (raw: unknown) => {
    console.log(raw, JSON.stringify(raw, null, 2));
    return valiParse(schema, raw);
  };
}

export function formatValidatorError(err: unknown) {
  return err instanceof ValiError ? flatten(err) : undefined;
}

export function formatErrors(err: unknown) {
  if (err instanceof ValiError) {
    return JSON.stringify(flatten(err));
  }
  if (err instanceof Error) {
    return err.message;
  }
  return JSON.stringify(err);
}

export function parse<TInput, TOutput, T extends BaseSchema<TInput, TOutput>>(
  schema: T,
  raw: unknown,
) {
  return valiParse(schema, raw);
}
