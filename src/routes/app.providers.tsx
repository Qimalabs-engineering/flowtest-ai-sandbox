import { Link, createFileRoute } from "@tanstack/react-router";
import { MapPin, Plus, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { providers } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { sandboxes } from "@/lib/sandbox-data";

export const Route = createFileRoute("/app/providers")({
  component: ProvidersPage,
});

function ProvidersPage() {
  const sandboxesByProvider = sandboxes.reduce<Record<string, number>>((acc, sb) => {
    acc[sb.provider] = (acc[sb.provider] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Providers</h1>
          <p className="text-sm text-muted-foreground">
            Catalog of supported provider specs. Spin up a sandbox to start testing flows against one.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/sandboxes/new"><Plus className="mr-1.5 h-4 w-4" /> New sandbox</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => {
          const count = sandboxesByProvider[p.name] ?? 0;
          return (
            <Card key={p.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <CardDescription className="mt-1">{p.type}</CardDescription>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <MapPin className="h-3.5 w-3.5" /> {p.country}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Operations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.operations.map((o) => (
                      <Badge key={o} variant="secondary" className="font-normal">{o}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Spec parity</span>
                    <span className="font-medium">{p.reliability}%</span>
                  </div>
                  <Progress value={p.reliability} className="h-1.5" />
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Boxes className="h-3.5 w-3.5" /> {count} sandbox{count === 1 ? "" : "es"}
                  </span>
                  <Button asChild size="sm" variant={count === 0 ? "default" : "outline"}>
                    <Link to="/app/sandboxes/new" search={{ provider: p.name }}>
                      {count === 0 ? "Create sandbox" : "New sandbox"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
