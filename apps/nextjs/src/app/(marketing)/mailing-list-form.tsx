"use client";

import type { ChangeEventHandler, FormEventHandler } from "react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";

export function MailingListForm() {
  const { toast } = useToast();
  const { mutate: joinMailingList, isLoading } =
    api.mailingList.joinMailingList.useMutation({
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "You've been added to the alpha waitlist.",
        });
        setEmail("");
      },
      onError: (error) => {
        toast({
          title: "Something went wrong.",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  const [email, setEmail] = useState("");
  const onChangeEmail: ChangeEventHandler<HTMLInputElement> = (e) =>
    setEmail(e.target.value);
  const onJoinMailingList: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    joinMailingList({ email });
  };

  return (
    <form
      className="flex w-full flex-col gap-3 md:w-fit md:flex-row"
      onSubmit={onJoinMailingList}
    >
      <Input
        type="email"
        value={email}
        onChange={onChangeEmail}
        placeholder="nakamoto@satoshi.com"
        className="md:w-96"
      />
      <Button
        type="submit"
        isLoading={isLoading}
        className="min-w-fit"
        size="lg"
      >
        Join the alpha waitlist
      </Button>
    </form>
  );
}
