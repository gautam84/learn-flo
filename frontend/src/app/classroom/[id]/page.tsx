'use client';

import { useParams } from 'next/navigation';
import AnnouncementsTab from '@/components/announcements-tab';
import ChatTab from '@/components/chat-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
  const params = useParams();
  const classroomId = Number(params?.id); // converts "2" to 2

  if (isNaN(classroomId)) {
    return <div className="p-4 text-red-500">Invalid classroom ID</div>;
  }

  return (
    <main>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
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
