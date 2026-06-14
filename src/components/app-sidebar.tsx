import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Server,
  Workflow,
  ArrowLeftRight,
  Webhook,
  Sparkles,
  KeyRound,
  Settings,
  Waves,
  Plug,
  Brain,
  AlertTriangle,
  Boxes,
  PlayCircle,
  GitBranch,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const build = [
  { title: "Overview", url: "/app/overview", icon: LayoutDashboard },
  { title: "Sandboxes", url: "/app/sandboxes", icon: Boxes },
];

const catalog = [
  { title: "Providers", url: "/app/providers", icon: Server },
  { title: "APIs", url: "/app/flows", icon: Workflow },
  { title: "Scenarios", url: "/app/scenarios", icon: AlertTriangle },
];

const observe = [
  { title: "Instances", url: "/app/instances", icon: ArrowLeftRight },
  { title: "Replay", url: "/app/replay", icon: PlayCircle },
  { title: "Failures", url: "/app/failures", icon: AlertTriangle },
  { title: "Webhooks", url: "/app/webhooks", icon: Webhook },
  { title: "Ops Brain", url: "/app/ops-brain", icon: Brain },
];

const connect = [
  { title: "Code", url: "/app/code", icon: GitBranch },
  { title: "Integrations", url: "/app/integrations", icon: Plug },
  { title: "AI Assistant", url: "/app/assistant", icon: Sparkles },
];

const secondary = [
  { title: "API Keys", url: "/app/api-keys", icon: KeyRound },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

type NavItem = { title: string; url: string; icon: typeof LayoutDashboard };

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  const renderGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/app/overview" className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Waves className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">FlowSim</span>
            <span className="text-[10px] text-muted-foreground">Integration command center</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 pt-1 group-data-[collapsible=icon]:hidden">
          <Button asChild className="w-full justify-start gap-2">
            <Link to="/app/sandboxes/new">
              <Plus className="h-4 w-4" /> Create sandbox
            </Link>
          </Button>
        </div>
        {renderGroup("Build", build)}
        {renderGroup("Catalog", catalog)}
        {renderGroup("Observe", observe)}
        {renderGroup("Connect", connect)}
        {renderGroup("Account", secondary)}
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-md border bg-card p-3 text-xs group-data-[collapsible=icon]:hidden">
          <p className="font-medium">Sandbox mode</p>
          <p className="mt-1 text-muted-foreground">All traffic simulated. No funds move.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
