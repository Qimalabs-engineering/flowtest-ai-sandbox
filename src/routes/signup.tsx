import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — FlowSim" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Workspace created — welcome to FlowSim");
    navigate({ to: "/app/overview" });
  };

  return (
    <AuthShell side="signup">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Create your workspace</h2>
        <p className="text-sm text-muted-foreground">Start simulating fintech integrations in minutes. No card required.</p>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Okonkwo" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Pay" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        <Button type="submit" className="w-full fs-press">Create workspace</Button>
      </form>
    </AuthShell>
  );
}
