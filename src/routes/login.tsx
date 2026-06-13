import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — FlowSim" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/app/overview" });
  };

  return (
    <AuthShell side="signin">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your FlowSim workspace.</p>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</a>
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full fs-press">Sign in</Button>
      </form>
    </AuthShell>
  );
}
