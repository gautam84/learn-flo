"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconSchool,
  IconNotes,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { LearnFloLogo } from "./ui/learn-flo-logo"
import { useAuth } from "@/lib/contexts/auth-context"




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  if (!user) return null; // 🔥 Avoid SSR mismatch by skipping render


  const userDetails =  {
    name: user?.username ?? "",
    email: user?.email ?? "",
    avatar: "/avatars/shadcn.jpg",
  }
  
  let data: {
    navMain: any[];
    navSecondary: any[];
    documents: any[];
  } = {
    navMain: [],
    navSecondary: [],
    documents: [],
  };
  if(user?.role === "TEACHER"){
     data = {
      navMain: [
        {
          title: "Dashboard",
          url: "/teacher/dashboard",
          icon: IconDashboard,
        },
        {
          title: "Classrooms",
          url: "/teacher/dashboard/classrooms",
          icon: IconSchool,
        },
        {
          title: "Tests",
          url: "/teacher/dashboard/tests",
          icon: IconNotes,
        },
       
      ],

      navSecondary: [
        {
          title: "Settings",
          url: "#",
          icon: IconSettings,
        },
        {
          title: "Get Help",
          url: "#",
          icon: IconHelp,
        },
      ],
      documents: [
        {
          name: "Data Library",
          url: "#",
          icon: IconDatabase,
        },
        {
          name: "Reports",
          url: "#",
          icon: IconReport,
        },
        {
          name: "Word Assistant",
          url: "#",
          icon: IconFileWord,
        },
      ],
    }
    
  } else {
     data = {
      navMain: [
        // {
        //   title: "Dashboard",
        //   url: "/student/dashboard",
        //   icon: IconDashboard,
        // },
        {
          title: "Classrooms",
          url: "/student/dashboard/classrooms",
          icon: IconSchool,
        },
        {
          title: "Tests",
          url: "/student/dashboard/tests",
          icon: IconNotes,
        },
       
      ],

      navSecondary: [
        {
          title: "Settings",
          url: "#",
          icon: IconSettings,
        },
        {
          title: "Get Help",
          url: "#",
          icon: IconHelp,
        },
      ],
      documents: [
        {
          name: "Data Library",
          url: "#",
          icon: IconDatabase,
        },
        {
          name: "Reports",
          url: "#",
          icon: IconReport,
        },
        {
          name: "Word Assistant",
          url: "#",
          icon: IconFileWord,
        },
      ],
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <LearnFloLogo/>
        
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userDetails} />
      </SidebarFooter>
    </Sidebar>
  )
}