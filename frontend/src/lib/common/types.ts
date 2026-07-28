type UserType = 'STUDENT' | 'TEACHER';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserType;
}

export interface Classroom {
  id: string;
  name: string;
  createdAt: string;
  code?: string; // Only returned to the teacher who created the classroom
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  fileUrl?: string;
  fileType?: string // Optional field for file URL
}


              