import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { transactions } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/app/transactions/$id")({
  component: TxDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-sm text-muted-foreground">Transaction not found.</div>
  ),
  loader: ({ params }) => {
    const tx = transactions.find((t) => t.id === params.id);
    if (!tx) throw notFound();
    return { tx };
  },
});

function TxDetail() {
  const { tx } = Route.useLoaderData();

  const timeline = [
    { label: "API request received", time: "00:00.012", done: true },
    { label: "Scenario rule matched", time: "00:00.043", done: true, note: tx.scenario },
    { label: "Provider response generated", time: "00:00.218", done: true },
    { label: "Webhook scheduled", time: "00:00.260", done: true },
    { label: "Webhook delivered", time: "00:05.412", done: tx.status !== "pending" },
    { label: "Transaction status updated", time: "00:05.498", done: tx.status !== "pending", final: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link to="/app/transactions"><ArrowLeft className="h-4 w-4 mr-1" /> Back to transactions</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight font-mono">{tx.reference}</h1>
          <StatusBadge status={tx.status} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Simulated transaction details.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div><dt className="text-muted-foreground text-xs">Provider</dt><dd className="font-medium">{tx.provider}</dd></div>
              <div><dt className="text-muted-foreground text-xs">Amount</dt><dd className="font-medium">{tx.currency} {tx.amount.toLocaleString()}</dd></div>
              <div><dt className="text-muted-foreground text-xs">Scenario matched</dt><dd>{tx.scenario}</dd></div>
              <div><dt className="text-muted-foreground text-xs">Created</dt><dd>{new Date(tx.createdAt).toLocaleString()}</dd></div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Event timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l border-border pl-5">
              {timeline.map((e, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-[1.45rem] flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-background ${e.done ? "bg-success" : "bg-muted"}`}>
                    {e.done && <Check className="h-3 w-3 text-success-foreground" />}
                  </span>
                  <p className="text-sm font-medium leading-tight">{e.label}</p>
                  <p className="text-xs text-muted-foreground">{e.time}</p>
                  {e.note && <p className="mt-0.5 text-xs text-muted-foreground italic">{e.note}</p>}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Request payload</CardTitle></CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono leading-relaxed">{JSON.stringify({
              reference: tx.reference,
              provider: tx.provider,
              amount: tx.amount,
              currency: tx.currency,
              destination: { bank_code: "058", account_number: "0123456789" },
            }, null, 2)}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Simulated provider response</CardTitle></CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono leading-relaxed">{JSON.stringify({
              status: tx.status,
              code: tx.status === "successful" ? "00" : tx.status === "failed" ? "51" : "09",
              message: tx.status === "successful" ? "Approved" : tx.status === "failed" ? "Do not honor" : "Pending confirmation",
              reference: tx.reference,
            }, null, 2)}</pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook deliveries</CardTitle>
          <CardDescription>Delivery attempts for this transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {[1, 2].map((i) => (
              <li key={i} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-mono text-xs">evt_{tx.id}_{i}</p>
                  <p className="text-xs text-muted-foreground">POST https://api.client.dev/webhooks/flowsim</p>
                </div>
                <StatusBadge status={i === 1 ? "delivered" : tx.status === "failed" ? "failed" : "delivered"} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
