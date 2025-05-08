// lib/mockAnnouncements.ts

export const mockAnnouncements = [
    {
      id: 1,
      classroomId: 101,
      title: "Welcome to the Course!",
      body: "We’re excited to have you on board. Please check the syllabus.",
      fileUrl: null,
      fileType: null,
      createdAt: new Date("2025-05-01T09:00:00").toISOString(),
    },
    {
      id: 2,
      classroomId: 101,
      title: "Lecture Slides Week 1",
      body: "Slides for the first week are now available.",
      fileUrl: "/files/week1-slides.pdf",
      fileType: "application/pdf",
      createdAt: new Date("2025-05-02T10:30:00").toISOString(),
    },
    {
      id: 3,
      classroomId: 101,
      title: "Classroom Group Photo",
      body: "Check out the photo we took on the first day!",
      fileUrl: "/images/class-photo.jpg",
      fileType: "image/jpeg",
      createdAt: new Date("2025-05-03T12:00:00").toISOString(),
    },
  ];
  