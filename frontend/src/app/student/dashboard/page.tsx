// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"
// import { LogOut } from "lucide-react"
// import { useAuth } from "@/lib/contexts/auth-context";

// export default function StudentDashboardPage() {
//   // const { user, logout } = useAuth();
//   const router = useRouter();

//   // const handleLogout = () => {
//   //   logout();
//   //   router.push('/');
//   // };

//   return (
//     <main>
//       <div className="flex flex-1 flex-col">
//         {/* <div className="flex items-center justify-between p-4 md:p-6">

//           <h1 className="text-xl font-bold">Welcome, {user?.name || 'Student'}</h1>
//           <Button variant="outline" size="sm" onClick={handleLogout}>
//             <LogOut className="h-4 w-4 mr-2" />
//             Logout
//           </Button>
//         </div> */}

//         <div className="flex flex-1 flex-col gap-2">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm text-muted-foreground">Enrolled Courses</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">4</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm text-muted-foreground">Pending Assignments</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">3</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm text-muted-foreground">Average Grade</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold">B+</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Student Details */}
//           <div className="p-4 md:p-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Account Details</CardTitle>
//                 <CardDescription>Your account information</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   <li><span className="font-medium">Email:</span> {user?.email}</li>
//                   <li><span className="font-medium">Account Type:</span> {user?.userType}</li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Recent Activity */}
//           <div className="p-4 md:p-6">
//             <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
//             <div className="grid grid-cols-1 gap-4">
//               {[
//                 { name: "Math Quiz Submitted", updated: "2 hours ago" },
//                 { name: "Science Lab Report Due", updated: "tomorrow" },
//                 { name: "History Essay Feedback", updated: "yesterday" },
//               ].map((activity, idx) => (
//                 <Card key={idx}>
//                   <CardHeader>
//                     <CardTitle className="text-base">{activity.name}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm text-muted-foreground">{activity.updated}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }