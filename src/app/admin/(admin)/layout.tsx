import { AdminDashboardHeader } from "@/components/admin/dashboard-header";
import { AdminDashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { getSession } from "@/lib/session";
import { SidebarInset, SidebarProvider } from "@/ui/sidebar";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();
  if (!session || (session.role !== "DEVELOPER" && session.role !== "ADMIN")) {
    redirect("/admin/login");
    return;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminDashboardSidebar variant="inset" />
      <SidebarInset>
        <AdminDashboardHeader />
        <div className="bg-background relative flex min-h-svh flex-1 flex-col">
          <div className="my-8 max-w-screen-xl px-4">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
