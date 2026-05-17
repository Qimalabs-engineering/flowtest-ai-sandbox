import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminTopbar } from "@/components/admin-topbar";
import { PageTransition } from "@/components/page-transition";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-5">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
