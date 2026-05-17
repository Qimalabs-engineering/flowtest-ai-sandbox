import { Bell, Search, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const envLabels: Record<string, string> = {
  "test-sandbox": "Test Sandbox",
  "staging-mirror": "Staging Mirror",
  "production-replay": "Production Replay",
};

export function AppTopbar() {
  const [env, setEnv] = useState("test-sandbox");
  const [switching, setSwitching] = useState<string | null>(null);

  const handleEnvChange = (next: string) => {
    if (next === env) return;
    setSwitching(next);
    window.setTimeout(() => {
      setEnv(next);
      setSwitching(null);
      toast.success(`Switched to ${envLabels[next]}`);
    }, 650);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:px-4">
      <SidebarTrigger />
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search transactions, providers, events…" className="pl-8 h-9" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        {switching && (
          <div className="hidden md:flex items-center gap-1.5 rounded-full border bg-card/70 px-2.5 py-1 text-xs text-muted-foreground fs-fade-in">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            <span>Switching to {envLabels[switching]}…</span>
          </div>
        )}
        <Select value={env} onValueChange={handleEnvChange}>
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent className="w-[320px]">
            <SelectItem value="test-sandbox">
              <div className="flex flex-col">
                <span className="font-medium">Test Sandbox</span>
                <span className="text-xs text-muted-foreground">Fully simulated providers and fake transactions.</span>
              </div>
            </SelectItem>
            <SelectItem value="staging-mirror">
              <div className="flex flex-col">
                <span className="font-medium">Staging Mirror</span>
                <span className="text-xs text-muted-foreground">Mirrors a customer's staging setup for integration testing.</span>
              </div>
            </SelectItem>
            <SelectItem value="production-replay">
              <div className="flex flex-col">
                <span className="font-medium">Production Replay</span>
                <span className="text-xs text-muted-foreground">Safely replays production-like incidents — no real money moves.</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs leading-relaxed">
              FlowSim environments never move real funds. Test Sandbox, Staging Mirror, and Production Replay all simulate provider behavior.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive">
            <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-75" />
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">AO</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">Ada O.</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
