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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
