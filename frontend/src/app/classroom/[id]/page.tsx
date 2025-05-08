import AnnouncementsTab from "@/components/announcements-tab";
import ChatTab from "@/components/chat-tab";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

  

export default function Page() {

  
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
  <TabsContent value="announcements"><AnnouncementsTab classroomId={101} /></TabsContent>
  <TabsContent value="chat"><ChatTab/></TabsContent>
  <TabsContent value="people">People will appear hear.</TabsContent>

</Tabs>

       </div>

        </div>
      </main>
    );
  }