import { Separator } from "~/components/ui/separator";
import { InviteCodeForm } from "./invite-code";

export const runtime = "edge";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Invite Code</h3>
        <p className="text-sm text-muted-foreground">
          Share the gift of productivity with your colleagues.
        </p>
      </div>
      <Separator />
      <InviteCodeForm />
    </div>
  );
}
