import { useState } from "react";
import { Command, Bell, ShieldAlert, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { currentAdmin } from "@/lib/admin-data";

const roleLabel: Record<string, string> = {
  super_admin: "Super Admin",
  operator: "Operator",
  support: "Support",
};

export function AdminTopbar() {
  const [role, setRole] = useState(currentAdmin.role);

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur md:px-4">
      <SidebarTrigger className="h-7 w-7" />
      <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        <span>console.flowsim.internal</span>
        <span className="text-border">·</span>
        <span>region: eu-west-1</span>
      </div>
      <div className="relative ml-2 hidden flex-1 max-w-md md:block">
        <Command className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tenants, incidents, jobs, audit log…"
          className="pl-8 h-8 text-xs"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[11px] font-mono text-muted-foreground">
          <Activity className="h-3 w-3 text-success" />
          <span>p95 142ms</span>
          <span className="text-border">·</span>
          <span>err 0.42%</span>
        </div>
        <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="operator">Operator</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive">
            <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-75" />
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 px-1.5">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-foreground text-background text-[10px]">
                  {currentAdmin.initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-xs font-medium md:inline">
                {currentAdmin.name}
              </span>
              <span className="hidden lg:inline rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {roleLabel[role]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs">
              {currentAdmin.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">
              <ShieldAlert className="mr-2 h-3.5 w-3.5" />
              Exit impersonation
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">Account settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
