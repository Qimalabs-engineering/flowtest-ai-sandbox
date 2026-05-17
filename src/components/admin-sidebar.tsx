import { Link, useRouterState } from "@tanstack/react-router";
import {
  Gauge,
  Building2,
  Server,
  Workflow,
  ArrowLeftRight,
  AlertOctagon,
  Plug,
  ListChecks,
  Activity,
  Flag,
  ScrollText,
  ShieldCheck,
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

const platform = [
  { title: "Overview", url: "/admin/overview", icon: Gauge },
  { title: "Tenants", url: "/admin/tenants", icon: Building2 },
  { title: "Providers", url: "/admin/providers", icon: Server },
  { title: "Scenarios", url: "/admin/scenarios", icon: Workflow },
  { title: "Transactions", url: "/admin/transactions", icon: ArrowLeftRight },
];

const reliability = [
  { title: "Incidents", url: "/admin/incidents", icon: AlertOctagon },
  { title: "Integrations", url: "/admin/integrations", icon: Plug },
  { title: "Jobs & Queues", url: "/admin/jobs", icon: ListChecks },
  { title: "System Health", url: "/admin/system-health", icon: Activity },
];

const governance = [
  { title: "Feature Flags", url: "/admin/feature-flags", icon: Flag },
  { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  const Section = ({ label, items }: { label: string; items: typeof platform }) => (
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
        <Link to="/admin/overview" className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">FlowSim Console</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Internal control plane
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Section label="Platform" items={platform} />
        <Section label="Reliability" items={reliability} />
        <Section label="Governance" items={governance} />
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-md border border-dashed bg-muted/50 p-2.5 text-[11px] leading-tight group-data-[collapsible=icon]:hidden">
          <p className="font-medium text-foreground">Restricted area</p>
          <p className="mt-0.5 text-muted-foreground">
            All actions are recorded in the audit log.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
