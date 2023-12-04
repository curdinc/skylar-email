"use client";

import { Icons } from "~/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useCardConfirmationPage } from "./use-card-cofirmation-page";

export default function CardConfirmationPage() {
  useCardConfirmationPage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirming card details</CardTitle>
        <CardDescription>
          <span className="block">This will only take a short while</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid justify-center gap-6 pb-10 pt-5">
        <Icons.spinner className="h-10 w-10 animate-spin" />
      </CardContent>
    </Card>
  );
}
