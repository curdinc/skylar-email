"use client";

import { useState } from "react";

import type { MessageType } from "@skylar/client-db/schema/message";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { RawHtmlDisplay } from "~/components/ui/raw-html-display";
import { TypographyH1 } from "~/components/ui/typography";
import { formatTimeToMMMDDYYYYHHmm } from "~/lib/email";
import { cn } from "~/lib/ui";
import { useThreadPage } from "./use-thread-page";

export function EmailThreadPage() {
  const { thread, isLoadingThread } = useThreadPage();

  if (isLoadingThread) {
    return <div>Loading...</div>;
  }
  const EmailList = thread?.map((email, idx) => {
    return (
      <EmailDisplay
        message={email}
        key={email.rfc822_message_id}
        isOpenInitially={idx === thread.length - 1}
      />
    );
  });

  return (
    <div className="grid justify-items-center gap-5 p-1 sm:p-2 md:gap-6 md:p-5">
      <TypographyH1>{thread?.[0]?.subject}</TypographyH1>
      {EmailList}
    </div>
  );
}

export function EmailDisplay({
  message,
  isOpenInitially,
}: {
  message: MessageType;
  isOpenInitially: boolean;
}) {
  const dateUpdated = formatTimeToMMMDDYYYYHHmm(message.created_at);
  const [isOpen, setIsOpen] = useState(isOpenInitially ? message.subject : "");

  const onClickEmailHeader = (isEmailOpen: string) => {
    setIsOpen(isEmailOpen);
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen}
      onValueChange={onClickEmailHeader}
      className="w-full"
    >
      <AccordionItem value={message.subject} className="w-full">
        <AccordionTrigger
          className="grid w-full grid-cols-1 text-start"
          showArrow={false}
        >
          <div className="flex w-full min-w-full flex-col items-baseline justify-between md:flex-row">
            <div className="min-w-fit text-base font-semibold">
              {message.from.name ?? message.from.email_address}
            </div>

            <div className="min-w-fit text-sm text-muted-foreground">
              {dateUpdated}
            </div>
          </div>
          {isOpen ? (
            <div className="min-w-fit text-sm text-muted-foreground">
              To:{" "}
              {message.to[0]?.name
                ? message.to[0]?.name
                : message.to[0]?.email_address}
              {message.to.length > 1
                ? `& ${message.to.length - 1} others`
                : null}
            </div>
          ) : (
            <RawHtmlDisplay
              className={"truncate text-sm text-muted-foreground"}
              html={message.snippet_html}
            />
          )}
        </AccordionTrigger>
        <AccordionContent>
          {/* TODO: Display inline image */}
          <RawHtmlDisplay
            className={cn(
              !message.content_html && "whitespace-pre-wrap",
              "w-full min-w-0",
              "prose",
            )}
            html={
              message.content_html ? message.content_html : message.content_text
            }
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
