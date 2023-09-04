"use client";

import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
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
import { siteConfig } from "~/lib/utils/config";
import { cn } from "~/lib/utils/ui";

export default function BetaCodeForm() {
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
          <Input id="alpha-code" placeholder="skylar_alpha_1234..." />
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <Link href="/onboarding/connect" className={cn(buttonVariants())}>
          Next
        </Link>
      </CardFooter>
    </Card>
  );
}
