import type { BaseSchema } from "valibot";
import {
  flatten,
  object,
  string,
  ValiError,
  parse as valiParse,
} from "valibot";

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

export function parse<TInput, TOutput, T extends BaseSchema<TInput, TOutput>>(
  schema: T,
  raw: unknown,
) {
  return valiParse(schema, raw);
}

export const testSchema = object({ name: string() });
