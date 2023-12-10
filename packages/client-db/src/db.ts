import type { Table } from "dexie";
import Dexie from "dexie";

import type { ProviderType } from "@skylar/parsers-and-types";
import { PROVIDER_INDEX } from "@skylar/parsers-and-types";
import type { MessageType } from "@skylar/parsers-and-types/src/client-db-schema/message-types/src/client-db-schema/message";
import { MESSAGE_INDEX } from "@skylar/parsers-and-types/src/client-db-schema/message-types/src/client-db-schema/message";

import type { EmailSyncInfoType } from "../../parsers-and-types/src/client-db-schema/syncand-types/src/client-db-schema/sync";
import { EMAIL_SYNC_INFO_INDEX } from "../../parsers-and-types/src/client-db-schema/syncand-types/src/client-db-schema/sync";
import type { ThreadType } from "../../parsers-and-types/src/client-db-schema/threadd-types/src/client-db-schema/thread";
import { THREAD_INDEX } from "../../parsers-and-types/src/client-db-schema/threadd-types/src/client-db-schema/thread";

/**
 *  When adding a new table, add it to the type below and add a new variable to the {@link ClientDb} class
 */
type DbTablesType = "thread" | "message" | "sync" | "provider";

export const CLIENT_DB_NAME = "skylar_inbox";

export class ClientDb extends Dexie {
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
