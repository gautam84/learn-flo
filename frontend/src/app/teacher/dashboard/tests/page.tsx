
"use client";

import {   
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
 } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PlusCircle, Edit, LogOut } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  // const { user, logout } = useAuth();
  // const router = useRouter();

  // const handleLogout = () => {
  //   logout();
  //   router.push('/');
  // };

  return (
    <main>
      <div className="flex flex-1 flex-col">
        {/* <div className="flex items-center justify-between p-4 md:p-6"> */}
          {/* <h1 className="text-xl font-bold">Welcome, {user?.name || 'Teacher'}</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div> */}
        <SiteHeader/>

        <div className="@container/main flex flex-1 flex-col gap-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Pass Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">80%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Total Appearing Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">8</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Active Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
              </CardContent>
            </Card>
          </div>

          {/* Teacher Details */}
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">All Tests</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: "Histoy Test", updated: "2 hours ago" },
                { name: "Science Test", updated: "yesterday" },
                { name: "Math Test", updated: "3 days ago" },
              ].map((classroom, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">{classroom.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Updated {classroom.updated}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Classrooms */}
    
        </div>
      </div>
    </main>
  );
}