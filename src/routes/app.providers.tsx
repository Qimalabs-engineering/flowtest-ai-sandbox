import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { providers } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/app/providers")({
  component: ProvidersPage,
});

function ProvidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Providers</h1>
          <p className="text-sm text-muted-foreground">Simulated banks, payment gateways, and mobile money APIs.</p>
        </div>
        <Button><Plus className="mr-1.5 h-4 w-4" /> Create Provider</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <CardDescription className="mt-1">{p.type}</CardDescription>
                </div>
                <StatusBadge status={p.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <MapPin className="h-3.5 w-3.5" /> {p.country}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Supported operations</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.operations.map((o) => (
                    <Badge key={o} variant="secondary" className="font-normal">{o}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Reliability</span>
                  <span className="font-medium">{p.reliability}%</span>
                </div>
                <Progress value={p.reliability} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
