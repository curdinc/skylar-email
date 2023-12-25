"use client";

import { BrandIcons } from "~/components/icons/brand-icons";
import { Button } from "~/components/ui/button";
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
import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { useConnectEmailProviderPage } from "./use-connect-page";

export default function ConnectEmailOnboardingForm() {
  const {
    onSelectEmailProvider,
    providerType,
    providerTypeDisplayName,
    connectToGmail,
    connectToOutlook,
    isConnectingToProvider,
    connectToEmailDescription,
  } = useConnectEmailProviderPage();

  const onInitiateConnect = () => {
    captureEvent({
      event: TrackingEvents.connectProviderButtonClicked,
      properties: { providerType },
    });
    const connect =
      providerType === "gmail" ? connectToGmail : connectToOutlook;
    connect();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Provider</CardTitle>
        <CardDescription>{connectToEmailDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup
          defaultValue="card"
          className="grid grid-cols-2 gap-4"
          onValueChange={onSelectEmailProvider}
          value={providerType}
        >
          <div>
            <RadioGroupItem value="gmail" id="gmail" className="peer sr-only" />
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
              value="outlook"
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
      </CardContent>
      <CardFooter>
        <Button
          isLoading={isConnectingToProvider}
          onClick={onInitiateConnect}
          className="w-full"
        >
          Connect to {providerTypeDisplayName}
        </Button>
      </CardFooter>
    </Card>
  );
}
