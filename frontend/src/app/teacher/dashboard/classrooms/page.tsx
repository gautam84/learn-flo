import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

  

export default function Page() {

  
    return (
      <main>
        <div className="flex flex-1 flex-col">
                    <SiteHeader/>

                    <div className="@container/main flex flex-1 flex-col gap-2">
       
        <Tabs defaultValue="announcements" className="w-[400px] p-4">
  <TabsList>
    <TabsTrigger value="announcements">Announcements</TabsTrigger>
    <TabsTrigger value="chat">Chat</TabsTrigger>
    <TabsTrigger value="people">People</TabsTrigger>
    
  </TabsList>
  <TabsContent value="announcements">Make changes to your account here.</TabsContent>
  <TabsContent value="chat">Change your password here.</TabsContent>
  <TabsContent value="people">People will appear hear.</TabsContent>

</Tabs>

       </div>

        </div>
      </main>
    );
  }