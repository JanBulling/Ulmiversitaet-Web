"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";
import { CalendarIcon, CompassIcon, SettingsIcon } from "lucide-react";
import Logo from "@/ui/logo";
import { NavMain } from "./dashboard-nav-main";
import { NavSecondary } from "./dashboard-sec-nav";

const navigationData = {
  user: {
    name: "Admin",
    email: "info@ulmiversitaet.de",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: CompassIcon,
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: CalendarIcon,
    },
  ],
  navSecondary: [
    {
      title: "Einstellungen",
      url: "#",
      icon: SettingsIcon,
    },
  ],
};

export function AdminDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Logo size="sm" />{" "}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} />
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
