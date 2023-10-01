import type { EmailType } from "../../schema/email";
import type { ThreadType } from "../../schema/thread";

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

export function buildThreadList(emails: EmailType[]) {
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
      latest_snippet_html: "",
      content: [],
      content_search: [],
      email_provider_labels: [],
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
      subject_search: thread.subject_search.length
        ? thread.subject_search
        : buildSearchableString(email.subject),
      bcc: thread.bcc.concat([email.bcc.email]),
      cc: thread.cc.concat(email.cc.map((cc) => cc.email)),
      from: thread.from.concat([email.from.email]),
      to: thread.to.concat(email.to.map((to) => to.email)),
      reply_to: thread.reply_to.concat(
        email.reply_to.map((replyTo) => replyTo.email),
      ),
      delivered_to: thread.delivered_to.concat(
        email.delivered_to.map((deliveredTo) => deliveredTo.email),
      ),
      latest_snippet_html: email.snippet_html,
      content: thread.content.concat([email.content_text]),
      content_search: thread.content_search.concat(
        buildSearchableString(email.content_text),
      ),
      email_provider_labels: Array.from(
        new Set([
          ...email.email_provider_labels,
          ...thread.email_provider_labels,
        ]),
      ),
      attachment_names: thread.attachment_names.concat(email.attachment_names),
      created_at:
        thread.created_at === 0 ? email.created_at : thread.created_at,
      updated_at: email.created_at,
    });
    return threads;
  }, new Map<string, ThreadType>());
  return Array.from(threads.values());
}
