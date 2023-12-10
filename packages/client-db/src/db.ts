import type { Table } from "dexie";
import Dexie from "dexie";

import type {
  EmailSyncInfoType,
  MessageType,
  ProviderType,
  ThreadType,
} from "@skylar/parsers-and-types";
import {
  EMAIL_SYNC_INFO_INDEX,
  MESSAGE_INDEX,
  PROVIDER_INDEX,
  THREAD_INDEX,
} from "@skylar/parsers-and-types";

/**
 *  When adding a new table, add it to the type below and add a new variable to the {@link ClientDb} class
 */
type DbTablesType = "thread" | "message" | "sync" | "provider";

const CLIENT_DB_NAME = "skylar_inbox";

class ClientDb extends Dexie {
  thread!: Table<ThreadType, string>;
  message!: Table<MessageType, string>;
  sync!: Table<EmailSyncInfoType, string>;
  provider!: Table<ProviderType, string>;
  constructor() {
    super(CLIENT_DB_NAME, {});
    this.version(1).stores({
      thread: THREAD_INDEX,
      message: MESSAGE_INDEX,
      sync: EMAIL_SYNC_INFO_INDEX,
      provider: PROVIDER_INDEX,
    } satisfies Record<DbTablesType, string>);
  }
}

export const clientDb = new ClientDb();
