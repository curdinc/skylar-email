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
import { Progress } from "~/components/ui/progress";
import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import { useSyncPage } from "./use-sync-page";

export default function SyncProgress() {
  const { providersSyncing, syncProgress, syncStep } = useSyncPage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initializing {providersSyncing.join(", ")}</CardTitle>
        <CardDescription>
          We are setting up your inbox right now. This can take a while. please
          keep this tab open
        </CardDescription>
      </CardHeader>
      <CardContent className="grid justify-items-center gap-6">
        <div className="text-sm text-muted-foreground">{syncStep}</div>
        <Progress value={syncProgress} />
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          onClick={() => {
            captureEvent({
              event: TrackingEvents.speedUpButtonClicked,
              properties: {},
            });

            console.log("syncProgress", syncProgress);
          }}
        >
          Speed up
        </Button>
      </CardFooter>
    </Card>
  );
}
