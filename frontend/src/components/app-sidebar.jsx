"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, FrameIcon, PieChartIcon,
  MapIcon, LayoutDashboardIcon, FlaskConicalIcon, HistoryIcon, GlobeIcon,
  LeafIcon
} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon />
      ),
      plan: "Free",
    },
  ],
}
const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Validation",
    url: "/result",
    icon: <FlaskConicalIcon />,
  },
  {
    title: "Claim History",
    url: "/history",
    icon: <HistoryIcon />,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: <GlobeIcon />,
  },
];

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div
            className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground"
            style={{
              background:
                "linear-gradient(135deg, #00d4aa 0%, #00b896 100%)",
            }}
          >
            <LeafIcon />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Neural Carbon</span>
            <span className="truncate text-xs">Carbon Validation AI System</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
