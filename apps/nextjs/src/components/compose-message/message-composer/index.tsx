"use client";

import "codemirror/keymap/sublime";
import "easymde/dist/easymde.min.css";

import { useCallback, useEffect, useRef } from "react";
import SimpleMdeReact from "react-simplemde-editor";

import {
  setCodeMirrorInstance,
  setIsSelecting,
  useGlobalStore,
} from "@skylar/logic";

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
import { EmailAddressRecipientsField } from "./email-address-recipients-field";
import { useMessageComposer } from "./use-message-composer";

export const MessageComposer = () => {
  const codeMirrorInstance = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.codeMirrorInstance,
  );
  const beforeMessageComposeTextAreaRef = useRef<HTMLInputElement>(null);
  const afterMessageComposeTextAreaRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (_: CodeMirror.Editor, event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        if (event.getModifierState("Shift")) {
          beforeMessageComposeTextAreaRef.current?.focus();
        } else {
          afterMessageComposeTextAreaRef.current?.focus();
        }
      }
      if (event.key === "Escape") {
        const selections = codeMirrorInstance?.getSelections();
        const selectionLength = selections?.length ?? 0;
        if (selectionLength === 1 && (selections?.[0]?.length ?? 0) > 0) {
          setIsSelecting(true);
          const cursor = codeMirrorInstance?.getCursor();
          if (cursor) {
            codeMirrorInstance?.setSelections([
              {
                anchor: cursor,
                head: cursor,
              },
            ]);
          }
        } else if (selectionLength > 1) {
          setIsSelecting(true);
        }
      }
    },
    [codeMirrorInstance],
  );
  useEffect(() => {
    codeMirrorInstance?.focus();
    codeMirrorInstance?.addKeyMap("sublime", true);
    codeMirrorInstance?.on("keydown", handleKeyDown);
  }, [codeMirrorInstance, handleKeyDown]);

  const {
    form,
    onSubmit,
    submitMutation: { isPending: isSendingEmail },
  } = useMessageComposer();

  return (
    // TODO: make inline image better + make attachment image preview show in gmail
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 p-5">
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
                  <EmailAddressRecipientsField
                    {...field}
                    emails={field.value}
                  />
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
                  <EmailAddressRecipientsField
                    {...field}
                    emails={field.value}
                  />
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
                  <EmailAddressRecipientsField
                    {...field}
                    emails={field.value}
                  />
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
                  <Input
                    placeholder="Hello World"
                    {...field}
                    ref={beforeMessageComposeTextAreaRef}
                  />
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
            ref={afterMessageComposeTextAreaRef}
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
