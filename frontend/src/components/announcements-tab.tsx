"use client";
import { mockAnnouncements } from "@/lib/mockAnnouncements";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "@/lib/contexts/auth-context";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Announcement } from "@/lib/common/types";
import { ClassroomsService } from "@/lib/api/classrooms";
import { toast } from 'sonner';
import { BASE_URL} from "@/lib/api/config";



export default function AnnouncementsTab({ classroomId }: { classroomId: number }) {
  const { user } = useAuth();
  const isTeacher = user?.role === 'TEACHER';

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchAnnouncements = async () => {

    try {
      const service = new ClassroomsService();

      const response = await service.getAnnouncements(classroomId);

      console.log('Announcements:', response);

      
      if (response.success) {
        setAnnouncements(response.data?.announcements || []);
      } else {
        toast.error(response.message || 'Failed to load announcements');
      }
    } catch (err) {
      toast.error('Failed to fetch announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [classroomId]);

  const handlePostAnnouncement = async () => {


    if (!title || !body) {
      toast.warning('Title and body are required');
      return;
    }

      console.log('Fetching announcements for classroomId:', classroomId);


    try {
      const service = new ClassroomsService();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('classroomId', classroomId.toString());
      if (file) {
        formData.append('file', file);
      }

      const response = await service.postAnnouncement(formData);
      if (response.success) {
        toast.success('Announcement posted');
        setTitle('');
        setBody('');
        setFile(null);
        fetchAnnouncements(); // refresh list
      } else {
        toast.error(response.message || 'Failed to post announcement');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="space-y-4">
      {isTeacher && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Create Announcement
            </h2>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Write your announcement..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button onClick={handlePostAnnouncement}  disabled={!title || !body}>
              Post Announcement
            </Button>
          </CardContent>
        </Card>
      )}

      {announcements.map((ann) => (
        <Card key={ann.id}>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">{ann.title}</h2>
            {ann.body && <p>{ann.body}</p>}
            {ann.fileUrl && (
              ann.fileType?.includes('jpeg') ? (
                <img   src={new URL(ann.fileUrl, BASE_URL).toString()}
                    alt="attached" className="max-h-60 rounded-lg" />
              ) : (
                <a href={BASE_URL+ ann.fileUrl} className="text-blue-500 underline" target="_blank" rel="noreferrer">
                  View Attachment
                </a>
              )
            )}
            <p className="text-sm text-muted-foreground">
              {new Date(ann.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}