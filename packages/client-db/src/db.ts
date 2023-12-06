import type { Table } from "dexie";
import Dexie from "dexie";

import type { EmailType } from "../schema/email";
import { EMAIL_INDEX } from "../schema/email";
import type { ProviderType } from "../schema/provider";
import { PROVIDER_INDEX } from "../schema/provider";
import type { EmailSyncInfoType } from "../schema/sync";
import { EMAIL_SYNC_INFO_INDEX } from "../schema/sync";
import type { ThreadType } from "../schema/thread";
import { THREAD_INDEX } from "../schema/thread";

/**
 *  When adding a new table, add it to the type below and add a new variable to the {@link ClientDb} class
 */
type DbTablesType = "thread" | "email" | "sync" | "provider";

export const CLIENT_DB_NAME = "skylar_inbox";

export class ClientDb extends Dexie {
  thread!: Table<ThreadType, string>;
  email!: Table<EmailType, string>;
  sync!: Table<EmailSyncInfoType, string>;
  provider!: Table<ProviderType, string>;
  constructor() {
    super(CLIENT_DB_NAME, {});
    this.version(1).stores({
      thread: THREAD_INDEX,
      email: EMAIL_INDEX,
      sync: EMAIL_SYNC_INFO_INDEX,
      provider: PROVIDER_INDEX,
    } satisfies Record<DbTablesType, string>);
  }
}

export const clientDb = new ClientDb();
