"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

import "easymde/dist/easymde.min.css";

import { setCodeMirrorInstance, useGlobalStore } from "@skylar/logic";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AttachmentButton, AttachmentList } from "../attachment";
import { EmailRecipientsField } from "./email-recipients-field";
import { useReplyEmail } from "./use-reply-email";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export const ReplyEmail = () => {
  const codeMirrorInstance = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.codeMirrorInstance,
  );

  useEffect(() => {
    codeMirrorInstance?.focus();
  }, [codeMirrorInstance]);

  const {
    form,
    onSubmit,
    submitMutation: { isPending: isSendingEmail },
  } = useReplyEmail();

  return (
    // TODO: make inline image better + make attachment image preview show in gmail
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8 p-5">
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="w-14">From</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => {
            // hack to prevent error when using reactMultiEmail
            delete (field as unknown as { ref?: string }).ref;
            return (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="w-14">To</FormLabel>
                <FormControl>
                  <EmailRecipientsField {...field} emails={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="cc"
          render={({ field }) => {
            // hack to prevent error when using reactMultiEmail
            delete (field as unknown as { ref?: string }).ref;
            return (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="w-14">CC</FormLabel>
                <FormControl>
                  <EmailRecipientsField {...field} emails={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="bcc"
          render={({ field }) => {
            // hack to prevent error when using reactMultiEmail
            delete (field as unknown as { ref?: string }).ref;
            return (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="w-14">BCC</FormLabel>
                <FormControl>
                  <EmailRecipientsField {...field} emails={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => {
            return (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="w-14">Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Hello World" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="composeString"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="sr-only">Email text area</FormLabel>
                <FormControl>
                  <SimpleMdeReact
                    {...field}
                    getCodemirrorInstance={setCodeMirrorInstance}
                    className="prose min-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex items-center justify-between py-1">
          <AttachmentButton
            variant={"ghost"}
            size={"icon-lg"}
            className="p-2"
            type="button"
          />
          <Button isLoading={isSendingEmail} type="submit">
            Send
          </Button>
        </div>
        <AttachmentList />
      </form>
    </Form>
  );
};
