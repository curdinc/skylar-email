"use client";

import Link from "next/link";

import { BrandIcons } from "~/components/icons/brand-icons";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useConnectEmailProviderPage } from "./use-connect-page";

export default function ConnectEmailOnboardingForm() {
  const {
    isCheckingUserOnboardStep,
    onSelectEmailProvider,
    emailProvider,
    goBack,
  } = useConnectEmailProviderPage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Provider</CardTitle>
        <CardDescription>Connect to your email to get started.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup
          defaultValue="card"
          className="grid grid-cols-2 gap-4"
          onValueChange={onSelectEmailProvider}
          value={emailProvider}
        >
          <div>
            <RadioGroupItem value="Gmail" id="gmail" className="peer sr-only" />
            <Label
              htmlFor="gmail"
              className="flex h-[105px] flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <BrandIcons.google className="mb-3 h-6 w-6" />
              Gmail
            </Label>
          </div>
          <div>
            <RadioGroupItem
              disabled
              value="Outlook"
              id="outlook"
              className="peer sr-only"
            />
            <Label
              htmlFor="outlook"
              className="flex h-[105px] flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <BrandIcons.outlook className="mb-3 h-6 w-6" />
              Outlook (coming soon)
            </Label>
          </div>
        </RadioGroup>
        <Button isLoading={isCheckingUserOnboardStep}>
          Connect to {emailProvider}
        </Button>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button variant={"ghost"} onClick={goBack}>
          back
        </Button>
        <Link href="/onboarding/card" className={buttonVariants()}>
          Continue
        </Link>
      </CardFooter>
    </Card>
  );
}