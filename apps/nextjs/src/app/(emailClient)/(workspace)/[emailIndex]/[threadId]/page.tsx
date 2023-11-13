"use client";

import { useState } from "react";

import type { EmailType } from "@skylar/client-db/schema/email";

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
  const { emailThread, isLoadingThread } = useThreadPage();

  if (isLoadingThread) {
    return <div>Loading...</div>;
  }
  const EmailList = emailThread?.map((email, idx) => {
    return (
      <EmailDisplay
        email={email}
        key={email.rfc822_message_id}
        isOpenInitially={idx === emailThread.length - 1}
      />
    );
  });
  return (
    <div className="grid justify-items-center gap-5 p-1 sm:p-2 md:gap-6 md:p-5">
      <TypographyH1>{emailThread?.[0]?.subject}</TypographyH1>
      {EmailList}
    </div>
  );
}

export function EmailDisplay({
  email,
  isOpenInitially,
}: {
  email: EmailType;
  isOpenInitially: boolean;
}) {
  const dateUpdated = formatTimeToMMMDDYYYYHHmm(email.created_at);
  const [isOpen, setIsOpen] = useState(isOpenInitially ? email.subject : "");

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
      <AccordionItem value={email.subject} className="w-full">
        <AccordionTrigger
          className="grid w-full grid-cols-1 text-start"
          showArrow={false}
        >
          <div className="flex w-full min-w-full flex-col items-baseline justify-between md:flex-row">
            <div className="min-w-fit text-base font-semibold">
              {email.from.name ?? email.from.email}
            </div>

            <div className="min-w-fit text-sm text-muted-foreground">
              {dateUpdated}
            </div>
          </div>
          {isOpen ? (
            <div className="min-w-fit text-sm text-muted-foreground">
              To: {email.to[0]?.name ? email.to[0]?.name : email.to[0]?.email}
              {email.to.length > 1 ? `& ${email.to.length - 1} others` : null}
            </div>
          ) : (
            <RawHtmlDisplay
              className={"truncate text-sm text-muted-foreground"}
              html={email.snippet_html}
            />
          )}
        </AccordionTrigger>
        <AccordionContent>
          <RawHtmlDisplay
            className={cn(
              !email.content_html && "whitespace-pre-wrap",
              "w-full min-w-0",
            )}
            html={email.content_html ? email.content_html : email.content_text}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
