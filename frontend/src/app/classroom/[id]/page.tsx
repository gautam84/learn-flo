'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AnnouncementsTab from '@/components/announcements-tab';
import ChatTab from '@/components/chat-tab';
import { ClassCode } from '@/components/classrooms/class-code';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { classroomsService } from '@/lib/api/classrooms';
import { Classroom } from '@/lib/common/types';

export default function Page() {
  const params = useParams();
  const classroomId = Number(params?.id); // converts "2" to 2

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(classroomId)) return;

    const fetchClassroom = async () => {
      setLoading(true);
      try {
        const response = await classroomsService.getClassroom(classroomId);

        if (response.success && response.data) {
          setClassroom(response.data);
        } else {
          setError(response.error || 'Failed to load classroom');
        }
      } catch (err) {
        console.error('Error fetching classroom:', err);
        setError('An error occurred while loading this classroom');
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [classroomId]);

  if (isNaN(classroomId)) {
    return <div className="p-4 text-red-500">Invalid classroom ID</div>;
  }

  return (
    <main>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="w-full max-w-4xl px-4 pt-4 mx-auto">
            {loading ? (
              <Skeleton className="h-8 w-48" />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-semibold">{classroom?.name}</h1>
                {/* The API returns the code only to the teacher who owns the classroom. */}
                {classroom?.code && <ClassCode code={classroom.code} />}
              </div>
            )}
          </div>

          <Tabs defaultValue="announcements" className="w-full max-w-4xl p-4 mx-auto">
            <TabsList>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
            </TabsList>

            <TabsContent value="announcements">
              <AnnouncementsTab classroomId={classroomId} />
            </TabsContent>
            <TabsContent value="chat">
              <ChatTab />
            </TabsContent>
            <TabsContent value="people">
              People will appear here.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
