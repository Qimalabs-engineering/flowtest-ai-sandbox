import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const team = [
  { name: "Ada Okonkwo", email: "ada@flowsim.dev", role: "Owner" },
  { name: "Tunde Bello", email: "tunde@flowsim.dev", role: "Admin" },
  { name: "Mary Wanjiru", email: "mary@flowsim.dev", role: "Developer" },
];

function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Organization, webhooks, team, and billing.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Visible to your team across the sandbox.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5"><Label>Organization name</Label><Input defaultValue="FlowSim Labs" /></div>
          <div className="grid gap-1.5"><Label>Slug</Label><Input defaultValue="flowsim-labs" /></div>
          <div className="grid gap-1.5 sm:col-span-2"><Label>Default base currency</Label><Input defaultValue="NGN" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook endpoint</CardTitle>
          <CardDescription>Where simulated events will be POSTed.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5"><Label>Webhook URL</Label><Input defaultValue="https://api.flowsim-labs.dev/hooks/flowsim" /></div>
          <div className="grid gap-1.5"><Label>Signing secret</Label><Input defaultValue="whsec_•••••••••••••••3a91" readOnly /></div>
          <div><Button onClick={() => toast.success("Webhook settings saved")}>Save changes</Button></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>Manage access to your sandbox workspace.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {team.map((m) => (
            <div key={m.email} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{m.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <Badge variant="secondary">{m.role}</Badge>
            </div>
          ))}
          <Separator />
          <div className="pt-3"><Button variant="outline">Invite member</Button></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>You're currently on the Growth plan.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Growth — $149/mo</p>
            <p className="text-xs text-muted-foreground">Renews on Jan 24, 2026</p>
          </div>
          <Button variant="outline">Manage billing</Button>
        </CardContent>
      </Card>
    </div>
  );
}
