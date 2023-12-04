import type { EmailType } from "../../schema/email";
import type { ThreadType } from "../../schema/thread";
import { bulkGetThreads } from "../emails/bulk-get-threads";

const USELESS_WORDS = [
  "",
  " ",
  "-",
  "–",
  "&",
  "!",
  "!!",
  "*",
  ":",
  ">",
  "<",
  ",",
  "(",
  ")",
];

function buildSearchableString(text: string) {
  const allWordsIncludingDuplicates = text.split(" ");
  const wordSet = allWordsIncludingDuplicates.reduce(function (prev, current) {
    if (USELESS_WORDS.includes(current)) {
      return prev;
    }
    const firstAlphaIndex = current.search(/[a-z]/i);
    // converts "\"This\"" to "this" so that we can search for "this" and find "\"This\"""
    const firstAlpha = current.substring(firstAlphaIndex).toLowerCase();

    prev.add(firstAlpha);
    return prev;
  }, new Set<string>());
  return Array.from(wordSet);
}

export async function buildThreadList(emails: EmailType[]) {
  const emailProviderThreadIds = emails.map(
    (email) => email.email_provider_thread_id,
  );
  const uniqueEmailProviderThreadIds = Array.from(
    new Set(emailProviderThreadIds),
  );
  const existingThreads = await bulkGetThreads({
    emailProviderThreadIds: uniqueEmailProviderThreadIds,
  });
  const existingThreadMap = new Map<string, ThreadType>();
  existingThreads.forEach((thread) => {
    if (thread) {
      existingThreadMap.set(thread.email_provider_thread_id, thread);
    }
  });

  const threads = await emails.reduce(
    async (threads, email) => {
      const { email_provider_thread_id } = email;
      const resolvedThreads = await threads;
      const thread: ThreadType = resolvedThreads.get(
        email_provider_thread_id,
      ) ??
        existingThreadMap.get(email_provider_thread_id) ?? {
          user_email_address: "",
          email_provider_thread_id: "",
          email_provider_message_id: [],
          rfc822_message_id: [],
          subject: "",
          subject_search: [],
          to: [],
          to_search: [],
          from: [],
          from_search: [],
          bcc: [],
          bcc_search: [],
          cc: [],
          cc_search: [],
          reply_to: [],
          reply_to_search: [],
          delivered_to: [],
          delivered_to_search: [],
          latest_snippet_html: "",
          content: [],
          content_search: [],
          email_provider_labels: [],
          attachment_names: [],
          created_at: 0,
          updated_at: 0,
        };

      // need to get existing thread from cache

      thread.from.push([email.from]);
      thread.to.push(email.to);
      thread.cc.push(email.cc[0]?.email ? email.cc : []);
      thread.bcc.push(email.bcc.email ? [email.bcc] : []);
      thread.reply_to.push(email.reply_to);
      thread.delivered_to.push(email.delivered_to);

      thread.from_search = thread.from_search
        .concat(email.from.email)
        .concat(email.from.name ?? "")
        .filter((x) => !!x);
      thread.to_search = thread.to_search
        .concat(email.to.map((to) => to.email))
        .concat(email.to.map((to) => to.name ?? "").filter((x) => !!x));
      thread.cc_search = thread.cc_search
        .concat(email.cc.map((cc) => cc.email))
        .concat(email.cc.map((cc) => cc.name ?? ""))
        .filter((x) => !!x);
      thread.bcc_search = thread.bcc_search
        .concat(email.bcc.email)
        .concat(email.bcc.name ?? "")
        .filter((x) => !!x);
      thread.reply_to_search = thread.reply_to_search
        .concat(email.reply_to.map((replyTo) => replyTo.email))
        .concat(email.reply_to.map((replyTo) => replyTo.name ?? ""))
        .filter((x) => !!x);
      thread.delivered_to_search = thread.delivered_to_search
        .concat(email.delivered_to.map((deliveredTo) => deliveredTo.email))
        .concat(email.delivered_to.map((deliveredTo) => deliveredTo.name ?? ""))
        .filter((x) => !!x);

      resolvedThreads.set(email_provider_thread_id, {
        user_email_address: email.user_email_address,
        email_provider_thread_id: email.email_provider_thread_id,
        email_provider_message_id: thread.email_provider_message_id.concat([
          email.email_provider_message_id,
        ]),
        rfc822_message_id: thread.rfc822_message_id.concat([
          email.rfc822_message_id,
        ]),
        subject: thread.subject ? thread.subject : email.subject,
        subject_search: thread.subject_search.length
          ? thread.subject_search
          : buildSearchableString(email.subject),
        from: thread.from,
        from_search: thread.from_search,
        to: thread.to,
        to_search: thread.to_search,
        cc: thread.cc,
        cc_search: thread.cc_search,
        bcc: thread.bcc,
        bcc_search: thread.bcc_search,
        reply_to: thread.reply_to,
        reply_to_search: thread.reply_to_search,
        delivered_to: thread.delivered_to,
        delivered_to_search: thread.delivered_to_search,
        latest_snippet_html: email.snippet_html,
        content: thread.content.concat([email.content_text]),
        content_search: thread.content_search.concat(
          buildSearchableString(email.content_text),
        ),
        // we use the latest email labels as the source of truth
        email_provider_labels: email.email_provider_labels,
        attachment_names: thread.attachment_names.concat(
          email.attachment_names,
        ),
        created_at:
          thread.created_at === 0 ? email.created_at : thread.created_at,
        updated_at: email.created_at,
      });

      return resolvedThreads;
    },
    new Promise<Map<string, ThreadType>>((res) =>
      res(new Map<string, ThreadType>()),
    ),
  );

  return Array.from(threads.values());
}
