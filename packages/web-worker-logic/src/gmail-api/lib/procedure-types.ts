import type { BaseSchema } from "valibot";

import {
  GMAIL_PROCEDURES_TYPES,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { gmailApiRouterProcedure } from "./trpc-factory";

const buildGmailApiRouterProcedure = <
  TInput extends BaseSchema,
  TOutput extends BaseSchema,
>(procedureType: {
  input: TInput;
  output: TOutput;
}) => {
  return gmailApiRouterProcedure
    .input(validatorTrpcWrapper(procedureType.input))
    .output(validatorTrpcWrapper(procedureType.output));
};

export const LABEL_PROCEDURES = {
  list: buildGmailApiRouterProcedure(
    GMAIL_PROCEDURES_TYPES.LABEL_PROCEDURES.list,
  ),
  modify: buildGmailApiRouterProcedure(
    GMAIL_PROCEDURES_TYPES.LABEL_PROCEDURES.modify,
  ),
};

export const MESSAGE_PROCEDURES = {
  send: buildGmailApiRouterProcedure(
    GMAIL_PROCEDURES_TYPES.MESSAGE_PROCEDURES.send,
  ),
};

export const PROVIDER_PROCEDURES = {
  addOauthProvider: buildGmailApiRouterProcedure(
    GMAIL_PROCEDURES_TYPES.PROVIDER_PROCEDURES.addOauthProvider,
  ),
};

export const THREAD_PROCEDURES = {
  delete: buildGmailApiRouterProcedure(
    GMAIL_PROCEDURES_TYPES.THREAD_PROCEDURES.delete,
  ),
};

export const SYNC_PROCEDURES = {
  incrementalSync: buildGmailApiRouterProcedure(
    GMAIL_PROCEDURES_TYPES.SYNC_PROCEDURES.incrementalSync,
  ),
  partialSync: buildGmailApiRouterProcedure(
    GMAIL_PROCEDURES_TYPES.SYNC_PROCEDURES.partialSync,
  ),
};
