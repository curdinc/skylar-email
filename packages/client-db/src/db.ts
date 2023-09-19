import Dexie, { Table } from "dexie";

import { EMAIL_INDEX, EmailIndexType, EmailType } from "../schema/email";
import { THREAD_INDEX, ThreadIndexType, ThreadType } from "../schema/thread";

// ! When adding a new table, add it to the type below and add a new variable to the {@link ClientDb} class
type DbTablesType = "thread" | "email";

export class ClientDb extends Dexie {
  thread!: Table<ThreadType, number>;
  email!: Table<EmailType, number>;
  constructor(userEmail: string) {
    super(userEmail);
    this.version(1).stores({
      thread: THREAD_INDEX,
      email: EMAIL_INDEX,
    } satisfies Record<DbTablesType, string>);
  }

  async where<
    TABLE_NAME extends DbTablesType,
    VALUES extends Record<any, any> = TABLE_NAME extends "thread"
      ? ThreadIndexType
      : TABLE_NAME extends "email"
      ? EmailIndexType
      : never,
  >(table: TABLE_NAME, value: VALUES) {
    return this[table].where(value);
  }
}

export const initClientDb = (userEmail: string) => new ClientDb(userEmail);
