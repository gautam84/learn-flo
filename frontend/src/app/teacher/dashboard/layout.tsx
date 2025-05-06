import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth-guard";

export const metadata: Metadata = {
  title: "LearnFlo - Teacher Dashboard",
  description: "Teacher dashboard for the LearnFlo learning management system.",
};

export default function DashboardLayout({ children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    // <AuthGuard allowedUserTypes={["TEACHER"]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          
          {children}
        </SidebarInset>
      </SidebarProvider>
//  {/* </AuthGuard> */}
  )
}