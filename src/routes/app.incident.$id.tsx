import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Rocket,
  GitCommit,
  AlertTriangle,
  Slack,
  Ticket,
  Activity,
  ShieldAlert,
  ExternalLink,
  Check,
  MessageSquare,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import {
  incidents,
  sampleLogs,
  linkedCommit,
  suggestedFixes,
  evidenceTimeline,
  type Severity,
} from "@/lib/ops-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/incident/$id")({
  component: IncidentDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-sm text-muted-foreground">Incident not found.</div>
  ),
  loader: ({ params }) => {
    const inc = incidents.find((i) => i.id === params.id);
    if (!inc) throw notFound();
    return { incident: inc };
  },
});

const sevTone: Record<Severity, string> = {
  critical: "bg-destructive/15 text-destructive ring-destructive/30",
  high: "bg-warning/20 text-warning-foreground ring-warning/30 dark:text-warning",
  medium: "bg-info/10 text-info ring-info/20",
  low: "bg-muted text-muted-foreground ring-border",
};

const kindIcon = {
  deploy: Rocket,
  commit: GitCommit,
  log: Activity,
  tx: AlertTriangle,
  slack: Slack,
  issue: Ticket,
} as const;

function IncidentDetail() {
  const { incident } = Route.useLoaderData();
  const [slackOpen, setSlackOpen] = useState(false);
  const [jiraOpen, setJiraOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link to="/app/ops-brain"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Ops Brain</Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{incident.title}</h1>
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize", sevTone[incident.severity])}>{incident.severity}</span>
              <StatusBadge status={incident.status === "investigating" ? "retrying" : incident.status === "resolved" ? "delivered" : incident.status === "monitoring" ? "pending" : "failed"} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{incident.service} · {incident.provider} · Detected via {incident.source}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setSlackOpen(true)}><Slack className="h-4 w-4 mr-1.5" /> Post to Slack</Button>
            <Button variant="outline" size="sm" onClick={() => setJiraOpen(true)}><Ticket className="h-4 w-4 mr-1.5" /> Create Jira</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("ClickUp task created (mock)")}><Ticket className="h-4 w-4 mr-1.5" /> Create ClickUp</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Owner assigned to Ada O.")}><UserPlus className="h-4 w-4 mr-1.5" /> Assign owner</Button>
            <Button size="sm" onClick={() => toast.success("Incident marked as resolved")}><CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark resolved</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Item label="Provider" value={incident.provider} />
              <Item label="Service" value={incident.service} />
              <Item label="Environment" value={incident.environment} />
              <Item label="Detection source" value={incident.source} />
              <Item label="Started" value={new Date(incident.detectedAt).toLocaleString()} />
              <Item label="Confidence" value={`${Math.round(incident.confidence * 100)}%`} />
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI root cause hypothesis</CardTitle>
            <CardDescription>Generated by FlowSim Ops Brain · {Math.round(incident.confidence * 100)}% confidence</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              FlowSim detected a spike in failed transfers <span className="font-medium">~3 minutes after commit <code className="font-mono">a8f91c2</code> was deployed</span>. Logs from <code className="font-mono">transfer-processor</code> show 214 upstream timeout errors against <span className="font-medium">{incident.provider}</span>. The likely cause is the new retry configuration reducing provider timeout from <span className="font-mono">30s → 10s</span>, which is below the observed p99 latency of 18.4s.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Hypothesis confirmed — feedback recorded")}><Check className="h-3.5 w-3.5 mr-1" /> Looks right</Button>
              <Button size="sm" variant="ghost" onClick={() => toast.message("Re-investigating with fresh data…")}>Re-investigate</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Evidence timeline</CardTitle></CardHeader>
        <CardContent>
          <ol className="relative space-y-4 border-l border-border pl-5">
            {evidenceTimeline.map((e, i) => {
              const Icon = kindIcon[e.kind as keyof typeof kindIcon] ?? Activity;
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.45rem] flex h-5 w-5 items-center justify-center rounded-full bg-background ring-4 ring-background border border-border">
                    <Icon className="h-3 w-3 text-primary" />
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-sm font-medium leading-tight">{e.title}</p>
                    <span className="text-xs text-muted-foreground">{e.ts}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{e.source}</p>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Linked logs</TabsTrigger>
          <TabsTrigger value="code">Linked code changes</TabsTrigger>
          <TabsTrigger value="fixes">Suggested fixes</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sample logs</CardTitle>
              <CardDescription>Correlated to incident window via trace IDs.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y font-mono text-xs">
                {sampleLogs.map((l, i) => (
                  <div key={i} className="flex flex-wrap items-start gap-3 px-4 py-2.5">
                    <span className="text-muted-foreground">{l.ts}</span>
                    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      l.level === "ERROR" && "bg-destructive/10 text-destructive",
                      l.level === "WARN" && "bg-warning/15 text-warning-foreground dark:text-warning",
                      l.level === "INFO" && "bg-info/10 text-info",
                    )}>{l.level}</span>
                    <span className="text-foreground/80">{l.service}</span>
                    <span className="text-muted-foreground">trace={l.trace}</span>
                    <span className="flex-1 min-w-[200px] text-foreground">{l.msg}</span>
                    <a className="inline-flex items-center gap-1 text-primary hover:underline" href="#"><ExternalLink className="h-3 w-3" /> open</a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Linked code change</CardTitle>
              <CardDescription>Most correlated PR with the failure window.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">{linkedCommit.pr}</div>
                  <div className="text-xs text-muted-foreground font-mono">{linkedCommit.repo} · {linkedCommit.commit} · @{linkedCommit.author}</div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-medium">Risk score {linkedCommit.risk}</span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Files changed</p>
                <ul className="text-xs font-mono space-y-1">
                  {linkedCommit.files.map((f) => <li key={f} className="text-foreground/80">{f}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Summary</p>
                <p className="text-sm">{linkedCommit.summary}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixes" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {suggestedFixes.map((f) => (
              <Card key={f.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{f.title}</CardTitle>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                      f.level === "high" && "bg-success/10 text-success ring-success/20",
                      f.level === "medium" && "bg-info/10 text-info ring-info/20",
                      f.level === "low" && "bg-muted text-muted-foreground ring-border",
                    )}>{Math.round(f.confidence * 100)}% confidence</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs"><span className="text-muted-foreground">Reason: </span>{f.reason}</p>
                  <p className="text-xs"><span className="text-muted-foreground">Impact: </span>{f.impact}</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => toast.success(`Action queued: ${f.title}`)}>Apply action</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <SlackDialog open={slackOpen} onOpenChange={setSlackOpen} title={incident.title} />
      <JiraDialog open={jiraOpen} onOpenChange={setJiraOpen} title={incident.title} severity={incident.severity} />
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium capitalize">{value}</dd>
    </div>
  );
}

function SlackDialog({ open, onOpenChange, title }: { open: boolean; onOpenChange: (v: boolean) => void; title: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Slack className="h-4 w-4" /> Slack notification</DialogTitle>
          <DialogDescription>Configure routing and preview the message before sending.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Workspace</Label>
            <Input defaultValue="acme-fintech" />
          </div>
          <div className="space-y-1.5">
            <Label>Default incident channel</Label>
            <Input defaultValue="#fintech-incidents" />
          </div>
          <div className="space-y-1.5">
            <Label>Escalation channel</Label>
            <Input defaultValue="#oncall-pager" />
          </div>
          <div className="space-y-1.5">
            <Label>Trigger</Label>
            <Select defaultValue="high">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical only</SelectItem>
                <SelectItem value="high">High and above</SelectItem>
                <SelectItem value="all">All incidents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notification rules</p>
          <RuleRow label="Send on high-severity incidents" defaultChecked />
          <RuleRow label="Send daily incident summary" defaultChecked />
          <RuleRow label="Send AI root cause hypothesis" defaultChecked />
          <RuleRow label="Send resolution updates" />
        </div>
        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Preview</p>
          <div className="rounded-md bg-background p-3 text-sm border">
            <p>🚨 <span className="font-semibold">High severity incident detected:</span> {title}. FlowSim suspects recent deploy <code className="font-mono">a8f91c2</code> caused timeout regression.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { toast.success("Posted to #fintech-incidents"); onOpenChange(false); }}>Send to Slack</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RuleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border p-2.5">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function JiraDialog({ open, onOpenChange, title, severity }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; severity: Severity }) {
  const priorityMap: Record<Severity, string> = { critical: "Highest", high: "High", medium: "Medium", low: "Low" };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Ticket className="h-4 w-4" /> Create Jira issue</DialogTitle>
          <DialogDescription>Mapping is applied automatically from your Jira settings.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Project</Label>
            <Select defaultValue="FNT"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="FNT">FNT — Fintech ops</SelectItem>
              <SelectItem value="PAY">PAY — Payments</SelectItem>
            </SelectContent></Select>
          </div>
          <div className="space-y-1.5">
            <Label>Issue type</Label>
            <Select defaultValue="incident"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="incident">Incident</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent></Select>
          </div>
          <div className="space-y-1.5">
            <Label>Priority (from severity {severity})</Label>
            <Input defaultValue={priorityMap[severity]} />
          </div>
          <div className="space-y-1.5">
            <Label>Assignee</Label>
            <Input defaultValue="ada.iro" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Labels</Label>
            <Input defaultValue="flowsim, ai-generated, regression" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input defaultValue={title} />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea rows={10} defaultValue={`Summary:\n${title}\n\nImpact:\n38 failed transactions in last 60 seconds, affecting Choice Bank sandbox flow.\n\nAI hypothesis:\nDeploy of commit a8f91c2 reduced provider timeout from 30s to 10s, below observed p99 latency.\n\nEvidence:\n- 214 upstream timeout logs in transfer-processor\n- Failure spike onset within 3 minutes of deploy\n\nSuggested fix:\nRevert commit a8f91c2 or raise timeout back to 25s.\n\nLinks:\n- Logs: https://app.datadoghq.com/logs?query=trace:9ab21f\n- PR: https://github.com/fintech/payments-core/pull/482`} />
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">Auto-create issue for future incidents</p>
            <p className="text-xs text-muted-foreground">Severity threshold: High and above</p>
          </div>
          <Switch defaultChecked />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { toast.success("Jira FNT-1285 created"); onOpenChange(false); }}>Create issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
