import type { BaseSchema } from "valibot";
import {
  array,
  custom,
  intersect,
  object,
  optional,
  picklist,
  string,
  void_,
} from "valibot";

import {
  emailConfigSchema,
  emailSchema,
  supportedEmailProvidersSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { gmailApiRouterProcedure } from "./trpc-factory";

const buildGmailApiRouterProcedure = <
  TInput extends BaseSchema,
  TOutput extends BaseSchema,
>({
  input,
  output,
}: {
  input: TInput;
  output: TOutput;
}) => {
  return gmailApiRouterProcedure
    .input(validatorTrpcWrapper(input))
    .output(validatorTrpcWrapper(output));
};

export const LABEL_PROCEDURES = {
  list: buildGmailApiRouterProcedure({
    input: object({
      emailAddress: emailSchema,
    }),
    output: array(
      object({
        type: picklist(["user", "system"]),
        name: string(),
        id: string(),
        labelListVisibility: picklist([
          "labelShow",
          "labelHide",
          "labelShowIfUnread",
        ]),
      }),
    ),
  }),
  modify: buildGmailApiRouterProcedure({
    input: object(
      {
        emailAddress: emailSchema,
        addLabelsIds: array(array(string())),
        deleteLabelsIds: array(array(string())),
        threadIds: array(string()),
      },
      [
        custom((value) => {
          if (
            value.addLabelsIds.length !== value.deleteLabelsIds.length &&
            value.addLabelsIds.length !== value.threadIds.length
          ) {
            return false;
          }
          return true;
        }, "Length mismatch in modify labels: addLabelsIds, deleteLabelsIds, and threadIds must be the same length"),
      ],
    ),
    output: void_("Error: unable to modify labels."),
  }),
};

export const MESSAGE_PROCEDURES = {
  send: buildGmailApiRouterProcedure({
    input: intersect([
      object({
        emailAddress: emailSchema,
        emailConfig: emailConfigSchema,
      }),
      object({ replyToGmailThreadId: optional(string()) }),
    ]),
    output: void_("Error: unable to modify labels."),
  }),
};

export const PROVIDER_PROCEDURES = {
  addOauthProvider: buildGmailApiRouterProcedure({
    input: object({
      code: string(),
      provider: supportedEmailProvidersSchema,
    }),
    output: emailSchema,
  }),
};
