"use client";

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
import { siteConfig } from "~/lib/config";
import { useCodePage } from "./use-code-page";

export default function BetaCodeForm() {
  const {
    code,
    isSubmittingCode,
    onCodeChange,
    onSubmitCode,
    isCheckingOnboardStep,
  } = useCodePage();

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
      <form>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="beta-code" className="sr-only">
              alpha Code
            </Label>
            <Input
              id="alpha-code"
              placeholder="skylar_alpha_1234..."
              value={code}
              onChange={onCodeChange}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            type="submit"
            disabled={isCheckingOnboardStep}
            isLoading={isSubmittingCode}
            onClick={onSubmitCode}
          >
            Next
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
