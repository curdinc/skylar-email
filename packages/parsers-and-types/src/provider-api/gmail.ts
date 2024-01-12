import { intersect, object, optional, string } from "valibot";

import { BASE_PROCEDURES_TYPES } from "./base";

export const GMAIL_PROCEDURES_TYPES = {
  ...BASE_PROCEDURES_TYPES,
  // overriden types
  SYNC_PROCEDURES: {
    ...BASE_PROCEDURES_TYPES.SYNC_PROCEDURES,
    partialSync: {
      ...BASE_PROCEDURES_TYPES.SYNC_PROCEDURES.partialSync,
      input: intersect([
        BASE_PROCEDURES_TYPES.SYNC_PROCEDURES.partialSync.input,
        object({ startHistoryId: string() }),
      ]),
    },
    incrementalSync: {
      ...BASE_PROCEDURES_TYPES.SYNC_PROCEDURES.incrementalSync,
      input: intersect([
        BASE_PROCEDURES_TYPES.SYNC_PROCEDURES.incrementalSync.input,
        object({ pageToken: optional(string()) }),
      ]),
    },
  },
  MESSAGE_PROCEDURES: {
    send: {
      ...BASE_PROCEDURES_TYPES.MESSAGE_PROCEDURES.send,
      input: intersect([
        BASE_PROCEDURES_TYPES.MESSAGE_PROCEDURES.send.input,
        object({ replyToGmailThreadId: optional(string()) }),
      ]),
    },
  },
};
