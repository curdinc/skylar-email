"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/utils/api";
import { siteConfig } from "~/lib/utils/config";

export default function BetaCodeForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate, isLoading } = api.onboarding.validateAlphaCode.useMutation({
    onSuccess() {
      router.push(`/onboarding/connect?code=${alphaCode}`);
    },
    onError(error) {
      toast({
        title: "Invalid Alpha Code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [alphaCode, setAlphaCode] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alpha Invite Code</CardTitle>
        <CardDescription>
          <span className="block">
            Skylar is currently invite-only early alpha access.
          </span>{" "}
          <span className="block">
            We sometimes invite interested users from{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              twitter
            </a>{" "}
            or ask your friends on the platform.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="beta-code" className="sr-only">
            alpha Code
          </Label>
          <Input
            id="alpha-code"
            placeholder="skylar_alpha_1234..."
            value={alphaCode}
            onChange={(e) => {
              setAlphaCode(e.target.value);
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <Button
          isLoading={isLoading}
          onClick={() => {
            mutate({
              alphaCode,
            });
          }}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
