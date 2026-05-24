import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  GitBranch, GitPullRequest, Plug, RefreshCw, ExternalLink,
  CheckCircle2, AlertCircle, FolderGit2, Sparkles,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  repoConnections, repositories, repoProviderMeta, sandboxes,
  type RepoProvider,
} from "@/lib/sandbox-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/code")({
  component: CodePage,
});

const providerTone: Record<RepoProvider, string> = {
  github: "bg-foreground text-background",
  gitlab: "bg-[#fc6d26] text-white",
  bitbucket: "bg-[#2684ff] text-white",
};

function CodePage() {
  const [provider, setProvider] = useState<RepoProvider | "all">("all");

  const filteredRepos = useMemo(
    () => (provider === "all" ? repositories : repositories.filter((r) => r.provider === provider)),
    [provider],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <GitBranch className="h-5 w-5 text-primary" /> Code
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect GitHub, GitLab, or Bitbucket. Map repos to sandboxes so FlowSim can correlate failures to commits and open fix PRs.
          </p>
        </div>
        <Button onClick={() => toast("Authorize flow (mock)")}>
          <Plug className="h-4 w-4 mr-1.5" /> Connect provider
        </Button>
      </div>

      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="prs">Suggested fixes</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            {(["github", "gitlab", "bitbucket"] as RepoProvider[]).map((p) => {
              const conn = repoConnections.find((c) => c.provider === p);
              const meta = repoProviderMeta[p];
              return (
                <Card key={p}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold", providerTone[p])}>
                        {meta.label.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{meta.label}</CardTitle>
                        <CardDescription className="text-xs">{meta.auth}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {conn ? (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-muted-foreground">{conn.account}</span>
                          {conn.status === "connected" ? (
                            <Badge className="bg-success/15 text-success">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" /> Needs reauth
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {conn.repoCount} repositories · synced {new Date(conn.lastSyncedAt).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => toast.success("Sync queued")}>
                            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Sync
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast("Disconnected (mock)")}>
                            Disconnect
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button size="sm" className="w-full" onClick={() => toast("Authorize flow (mock)")}>
                        Connect {meta.label}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="repos" className="mt-4 space-y-3">
          <div className="flex gap-2">
            {(["all", "github", "gitlab", "bitbucket"] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={provider === p ? "default" : "outline"}
                onClick={() => setProvider(p)}
              >
                {p === "all" ? "All" : repoProviderMeta[p].label}
              </Button>
            ))}
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Stack</TableHead>
                    <TableHead>Mapped sandboxes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepos.map((r) => {
                    const mapped = sandboxes.filter((s) => r.mappedSandboxIds.includes(s.id));
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-xs">{r.fullName}</span>
                          </div>
                          <div className="mt-0.5 text-[10px] text-muted-foreground">
                            default · {r.defaultBranch}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded px-2 py-0.5 text-[10px] font-semibold", providerTone[r.provider])}>
                            {repoProviderMeta[r.provider].label}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {r.language} · {r.framework}
                        </TableCell>
                        <TableCell className="text-xs">
                          {mapped.length === 0 ? (
                            <span className="text-muted-foreground">Unmapped</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {mapped.map((s) => (
                                <Link
                                  key={s.id}
                                  to="/app/sandboxes/$id"
                                  params={{ id: s.id }}
                                  className="rounded bg-muted px-1.5 py-0.5 hover:bg-muted/80"
                                >
                                  {s.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => toast("Map to sandbox (mock)")}>
                            Map
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prs" className="mt-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Open fix PR / MR from validated replays
              </CardTitle>
              <CardDescription>
                When a replay validates a fix, FlowSim can open a pull request against the mapped repository.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {suggestedFixes.map((f) => {
                const repo = repositories.find((r) => r.id === f.repoId);
                if (!repo) return null;
                const meta = repoProviderMeta[repo.provider];
                return (
                  <div key={f.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <GitPullRequest className="h-4 w-4 text-success" />
                        <span className="font-medium text-sm truncate">{f.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {f.scenarioCode}
                        </Badge>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground font-mono truncate">
                        {repo.fullName} · {f.branch}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => toast.success(`${meta.mrLabel} drafted`)}>
                      {meta.mrLabel} <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const suggestedFixes = [
  { id: "f1", repoId: "r1", title: "Add idempotency key to /charge retries", scenarioCode: "card_declined", branch: "fix/idempotency-charge" },
  { id: "f2", repoId: "r3", title: "Handle STKPush cancel callback shape", scenarioCode: "user_cancelled", branch: "fix/stkpush-cancel" },
  { id: "f3", repoId: "r4", title: "Tolerate ID mismatch in KYC verifier", scenarioCode: "id_mismatch", branch: "fix/kyc-id-mismatch" },
];
