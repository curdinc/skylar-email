import type { EmailType } from "../../schema/email";
import type { ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";

function buildSearchableString(text: string) {
  const allWordsIncludingDuplicates = text.split(" ");
  const wordSet = allWordsIncludingDuplicates.reduce(function (prev, current) {
    prev.add(current);
    return prev;
  }, new Set<string>());
  return Array.from(wordSet);
}

function buildThreadList(emails: EmailType[]) {
  const threads = emails.reduce((threads, email) => {
    const { email_provider_thread_id } = email;
    const thread: ThreadType = threads.get(email_provider_thread_id) ?? {
      email_provider_thread_id: "",
      email_provider_message_id: [],
      rfc822_message_id: [],
      subject: "",
      subject_search: [],
      to: [],
      from: [],
      bcc: [],
      cc: [],
      reply_to: [],
      delivered_to: [],
      content: [],
      content_search: [],
      email_provider_labels: [],
      skylar_labels: [],
      attachment_names: [],
      created_at: 0,
      updated_at: 0,
    };

    threads.set(email_provider_thread_id, {
      email_provider_thread_id: email.email_provider_thread_id,
      email_provider_message_id: thread.email_provider_message_id.concat([
        email.email_provider_message_id,
      ]),
      rfc822_message_id: thread.rfc822_message_id.concat([
        email.rfc822_message_id,
      ]),
      subject: thread.subject ? thread.subject : email.subject,
      subject_search: thread.subject_search
        ? thread.subject_search
        : buildSearchableString(email.subject),
      bcc: email.bcc.map((bcc) => bcc.email).concat(thread.bcc),
      cc: email.cc.map((cc) => cc.email).concat(thread.cc),
      from: thread.from.concat([email.from.email]),
      to: email.to.map((to) => to.email).concat(thread.to ?? []),
      reply_to: email.reply_to
        .map((replyTo) => replyTo.email)
        .concat(thread.reply_to ?? []),
      delivered_to: email.delivered_to
        .map((deliveredTo) => deliveredTo.email)
        .concat(thread.delivered_to ?? []),
      content: thread.content.concat([email.content_text]),
      content_search: thread.content_search.concat(),
      email_provider_labels: email.labels.concat(thread.email_provider_labels),
      skylar_labels: thread.skylar_labels,
      attachment_names: email.attachment_names.concat(
        thread.attachment_names ?? [],
      ),
      created_at:
        thread.created_at === 0 ? email.created_at : thread.created_at,
      updated_at: email.created_at,
    });
    return threads;
  }, new Map<string, ThreadType>());
  // TODO: remove this console.log
  console.log("threads", threads);
  return Array.from(threads.values());
}

export async function bulkPutEmails({
  db,
  emails,
}: {
  db: ClientDb;
  emails: EmailType[];
}) {
  await db.transaction("rw", db.email, db.thread, async () => {
    await db.email.bulkPut(emails);
    await db.thread.bulkPut(buildThreadList(emails));
  });
}
