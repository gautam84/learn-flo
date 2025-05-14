
"use client";

import { useEffect, useState } from "react";
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
import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth-context";
import { SiteHeader } from "@/components/site-header";
import { classroomsService } from "@/lib/api/classrooms";
import { Classroom } from "@/lib/common/types";

export default function Page() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const response = await classroomsService.getAllClassrooms(page);

        console.log('API response:', response);

        if (response.success && response.data) {
          // Try different response formats
          if (response.data && response.data.classrooms) {
            // Format: response.data.data.classrooms
            setClassrooms(response.data.classrooms);
            setTotalPages(response.data.totalPages || 1);
          } else if (response.data.classrooms) {
            // Format: response.data.classrooms
            setClassrooms(response.data.classrooms);
            setTotalPages(response.data.totalPages || 1);
          } else {
            console.error('Unexpected response format:', response);
            setError('Received unexpected data format from server');
          }
        } else {
          console.error('API error:', response);
          setError(response.error || 'Failed to load classrooms');
        }
      } catch (err) {
        console.error('Error fetching classrooms:', err);
        setError('An error occurred while fetching classrooms');
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [page]);

  return (
    <main>
      <div className="flex flex-1 flex-col">
        <SiteHeader/>

        <div className="@container/main flex flex-1 flex-col gap-2">
          {/* Classrooms List */}
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">All Classrooms</h2>
      
            </div>

            {loading ? (
              <p>Loading classrooms...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : classrooms.length === 0 ? (
              <p>No classrooms found. Create a new classroom to get started.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {classrooms.map((classroom) => (

                <Link href={`/classroom/${classroom.id}`} key={classroom.id}>
                  <Card key={classroom.id} className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-base">{classroom.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Created on {new Date(classroom.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && !error && (
              <div className="flex justify-center mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="flex items-center px-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}