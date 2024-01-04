import {
  array,
  custom,
  number,
  object,
  picklist,
  string,
  void_,
} from "valibot";

import { messageConfigSchema } from "../api/email";
import { syncResponseSchema } from "../api/email-provider/gmail-provider";
import { supportedEmailProvidersSchema } from "../api/email-provider/oauth";
import { emailSchema } from "../core-parsers";

const LABEL_PROCEDURES = {
  list: {
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
  },
  modify: {
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
  },
};

const MESSAGE_PROCEDURES = {
  send: {
    input: object({
      emailAddress: emailSchema,
      messageConfig: messageConfigSchema,
    }),
    output: void_("Error: unable to modify labels."),
  },
};

const PROVIDER_PROCEDURES = {
  addOauthProvider: {
    input: object({
      code: string(),
      provider: supportedEmailProvidersSchema,
    }),
    output: object({
      emailAddress: emailSchema,
      name: string(),
      imageUri: string(),
      refreshToken: string(),
    }),
  },
};

const THREAD_PROCEDURES = {
  delete: {
    input: object({
      emailAddress: emailSchema,
      threadIds: array(string()),
    }),
    output: void_("Error: unable to delete thread."),
  },
};

const SYNC_PROCEDURES = {
  backgroundFullSync: {
    input: object({
      emailAddress: emailSchema,
    }),
    output: void_("Error: unable to sync."),
  },
  partialSync: {
    input: object({
      emailAddress: emailSchema,
    }),
    output: syncResponseSchema,
  },
  incrementalSync: {
    input: object({
      emailAddress: emailSchema,
      numberOfMessagesToFetch: number(),
    }),
    output: syncResponseSchema,
  },
};

export const BASE_PROCEDURES_TYPES = {
  LABEL_PROCEDURES,
  MESSAGE_PROCEDURES,
  PROVIDER_PROCEDURES,
  THREAD_PROCEDURES,
  SYNC_PROCEDURES,
} as const;
