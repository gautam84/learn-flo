// 'use client';

// import { useAuth } from "@/lib/contexts/auth-context";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// export default function StudentDashboardPage() {
//   // const { user, logout } = useAuth();

//   return (
//     <div className="flex flex-col gap-8 p-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Student Dashboard</h1>
//         <Button variant="outline" onClick={logout}>Logout</Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Welcome back, {user?.name || 'Student'}</CardTitle>
//           <CardDescription>This is your student dashboard</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p>Your account details:</p>
//           <ul className="list-disc pl-5 mt-2">
//             <li>Email: {user?.email}</li>
//             <li>Account type: {user?.userType}</li>
//           </ul>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>My Courses</CardTitle>
//             <CardDescription>Courses you are enrolled in</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">No courses found.</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Upcoming Assignments</CardTitle>
//             <CardDescription>Your pending assignments</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">No upcoming assignments.</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Grades</CardTitle>
//             <CardDescription>Your latest results</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">No recent grades.</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }