import Dexie, { Table } from "dexie";

import { EMAIL_INDEX, EmailType } from "../schema/email";
import { SYNC_INDEX, SyncType } from "../schema/sync";
import { THREAD_INDEX, ThreadType } from "../schema/thread";

/**
 *  When adding a new table, add it to the type below and add a new variable to the {@link ClientDb} class
 */
type DbTablesType = "thread" | "email" | "sync";

export class ClientDb extends Dexie {
  thread!: Table<ThreadType, string>;
  email!: Table<EmailType, string>;
  sync!: Table<SyncType, string>;
  constructor(userEmail: string) {
    super(userEmail);
    this.version(1).stores({
      thread: THREAD_INDEX,
      email: EMAIL_INDEX,
      sync: SYNC_INDEX,
    } satisfies Record<DbTablesType, string>);
  }
}

export const initClientDb = (userEmail: string) => new ClientDb(userEmail);
