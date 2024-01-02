import type { MessageType, ThreadType } from "@skylar/parsers-and-types";

import { bulkGetThreads } from "../message/bulk-get-threads";
import { buildSearchableString } from "./build-searchable-string";

export async function buildThreadList(messages: MessageType[]) {
  const emailProviderThreadIds = messages.map(
    (email) => email.provider_thread_id,
  );
  const uniqueEmailProviderThreadIds = Array.from(
    new Set(emailProviderThreadIds),
  );
  const existingThreads = await bulkGetThreads({
    providerThreadIds: uniqueEmailProviderThreadIds,
  });
  const existingThreadMap = new Map<string, ThreadType>();
  existingThreads.forEach((thread) => {
    if (thread) {
      existingThreadMap.set(thread.provider_thread_id, thread);
    }
  });

  messages.sort((a, b) => a.created_at - b.created_at);
  const threads = await messages.reduce(
    async (threads, message) => {
      const { provider_thread_id } = message;
      const resolvedThreads = await threads;
      const thread: ThreadType = resolvedThreads.get(provider_thread_id) ??
        existingThreadMap.get(provider_thread_id) ?? {
          user_email_address: "",
          provider_thread_id: "",
          provider_message_ids: [],
          rfc822_message_ids: [],
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
          provider_message_labels: [],
          attachment_names: [],
          attachment_names_search: [],
          created_at: 0,
          updated_at: 0,
        };

      thread.from_search = thread.from_search
        .concat(message.from.email_address)
        .concat(message.from.name ?? "")
        .filter((x) => !!x);
      thread.to_search = thread.to_search
        .concat(message.to.map((to) => to.email_address))
        .concat(message.to.map((to) => to.name ?? "").filter((x) => !!x));
      thread.cc_search = thread.cc_search
        .concat(message.cc.map((cc) => cc.email_address))
        .concat(message.cc.map((cc) => cc.name ?? ""))
        .filter((x) => !!x);
      thread.bcc_search = thread.bcc_search
        .concat(message.bcc?.email_address ?? "")
        .concat(message.bcc?.name ?? "")
        .filter((x) => !!x);
      thread.reply_to_search = thread.reply_to_search
        .concat(message.reply_to.map((replyTo) => replyTo.email_address))
        .concat(message.reply_to.map((replyTo) => replyTo.name ?? ""))
        .filter((x) => !!x);
      thread.delivered_to_search = thread.delivered_to_search
        .concat(
          message.delivered_to.map((deliveredTo) => deliveredTo.email_address),
        )
        .concat(
          message.delivered_to.map((deliveredTo) => deliveredTo.name ?? ""),
        )
        .filter((x) => !!x);
      thread.attachment_names_search = thread.attachment_names_search.concat(
        message.attachment_names,
      );
      thread.content_search = thread.content_search.concat(
        buildSearchableString(message.content_text),
      );

      if (message.created_at > thread.updated_at) {
        // need to get existing thread from cache
        thread.from.push([message.from]);
        thread.to.push(message.to);
        thread.cc.push(message.cc[0]?.email_address ? message.cc : []);
        thread.bcc.push(message.bcc?.email_address ? [message.bcc] : []);
        thread.reply_to.push(message.reply_to);
        thread.delivered_to.push(message.delivered_to);

        thread.provider_message_ids.push(message.provider_message_id);
        thread.rfc822_message_ids.push(message.rfc822_message_id);
        thread.content.push(
          message.content_html ? message.content_html : message.content_text,
        );
        thread.attachment_names = thread.attachment_names.concat(
          message.attachment_names,
        );
      } else if (message.created_at < thread.created_at) {
        // need to get existing thread from cache
        thread.from.unshift([message.from]);
        thread.to.unshift(message.to);
        thread.cc.unshift(message.cc[0]?.email_address ? message.cc : []);
        thread.bcc.unshift(message.bcc?.email_address ? [message.bcc] : []);
        thread.reply_to.unshift(message.reply_to);
        thread.delivered_to.unshift(message.delivered_to);

        thread.provider_message_ids.unshift(message.provider_message_id);
        thread.rfc822_message_ids.unshift(message.rfc822_message_id);
        thread.content.unshift(
          message.content_html ? message.content_html : message.content_text,
        );
        thread.attachment_names = message.attachment_names.concat(
          thread.attachment_names,
        );
      }

      const updatedThreadAt = Math.max(message.created_at, thread.updated_at);
      const createdThreadAt =
        thread.created_at === 0
          ? message.created_at
          : Math.min(message.created_at, thread.created_at);

      resolvedThreads.set(provider_thread_id, {
        ...thread,
        user_email_address: message.user_email_address,
        provider_thread_id: message.provider_thread_id,
        latest_snippet_html: message.snippet_html,
        subject: thread.subject ? thread.subject : message.subject,
        subject_search: thread.subject_search.length
          ? thread.subject_search
          : buildSearchableString(message.subject),
        // we use the latest email labels as the source of truth
        provider_message_labels: message.email_provider_labels,
        created_at: createdThreadAt,
        updated_at: updatedThreadAt,
      });

      return resolvedThreads;
    },
    new Promise<Map<string, ThreadType>>((res) =>
      res(new Map<string, ThreadType>()),
    ),
  );

  return Array.from(threads.values());
}
