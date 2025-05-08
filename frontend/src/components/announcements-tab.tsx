import { mockAnnouncements } from "@/lib/mockAnnouncements";
import { Card, CardContent } from "./ui/card";

export default function AnnouncementsTab({ classroomId }: { classroomId: number }) {
  const announcements = mockAnnouncements.filter(a => a.classroomId === classroomId);

  return (
    <div className="space-y-4">
      {announcements.map((ann) => (
        <Card key={ann.id}>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">{ann.title}</h2>
            {ann.body && <p>{ann.body}</p>}
            {ann.fileUrl && (
              ann.fileType?.includes("image") ? (
                <img src={ann.fileUrl} alt="attached" className="max-h-60 rounded-lg" />
              ) : (
                <a href={ann.fileUrl} className="text-blue-500 underline" target="_blank">View Attachment</a>
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
